import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import socketService from '../services/socketService';
import apiService from '../services/apiService';
import './Customer.css'

const PIZZA_TYPES = [
  { id: 'margherita', name: 'Margherita', price: 8.99 },
  { id: 'pepperoni', name: 'Pepperoni', price: 10.99 },
  { id: 'vegetarian', name: 'Vegetarian', price: 9.99 },
  { id: 'hawaiian', name: 'Hawaiian', price: 11.99 },
  { id: 'supreme', name: 'Supreme', price: 12.99 }
];

const PIZZA_SIZES = [
  { id: 'small', name: 'Small', multiplier: 1 },
  { id: 'medium', name: 'Medium', multiplier: 1.5 },
  { id: 'large', name: 'Large', multiplier: 2 }
];

const CustomerView = () => {
  const [customerName, setCustomerName] = useState('');
  const [selectedPizzaType, setSelectedPizzaType] = useState(PIZZA_TYPES[0].id);
  const [selectedPizzaSize, setSelectedPizzaSize] = useState(PIZZA_SIZES[0].id);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();
    
    // Listen for order status updates
    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Fetch existing orders
    fetchOrders();

    return () => {
      // Clean up socket listeners
      socket.off('orderStatusUpdated');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await apiService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addToCart = () => {
    const pizzaType = PIZZA_TYPES.find(type => type.id === selectedPizzaType);
    const pizzaSize = PIZZA_SIZES.find(size => size.id === selectedPizzaSize);
    
    const item = {
      id: Date.now().toString(),
      type: pizzaType.name,
      size: pizzaSize.name,
      quantity: quantity,
      price: pizzaType.price * pizzaSize.multiplier * quantity
    };
    
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const placeOrder = async () => {
    if (cart.length === 0 || !customerName) {
      alert('Please add items to cart and provide your name');
      return;
    }

    const orderData = {
      customerName,
      pizzas: cart.map(item => ({
        type: item.type,
        size: item.size,
        quantity: item.quantity
      })),
      totalPrice: parseFloat(calculateTotal())
    };

    try {
      // Save order to database
      const newOrder = await apiService.createOrder(orderData);
      
      // Emit order through socket
      socketService.placeOrder(newOrder);
      
      // Update local state
      setOrders([newOrder, ...orders]);
      
      // Clear cart
      setCart([]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'Preparing': return 'warning';
      case 'Ready': return 'success';
      case 'Delivered': return 'info';
      default: return 'light';
    }
  };

  return (
    <div>
      <h2 className="mb-4">Pizza Ordering</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Create Your Order</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)} 
                    placeholder="Enter your name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Pizza Type</Form.Label>
                  <Form.Select 
                    value={selectedPizzaType} 
                    onChange={(e) => setSelectedPizzaType(e.target.value)}
                  >
                    {PIZZA_TYPES.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} (${type.price})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Size</Form.Label>
                  <Form.Select 
                    value={selectedPizzaSize} 
                    onChange={(e) => setSelectedPizzaSize(e.target.value)}
                  >
                    {PIZZA_SIZES.map(size => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                    min="1" 
                  />
                </Form.Group>
                
                <Button variant="primary" onClick={addToCart}>
                  Add to Cart
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>Your Cart</Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  <ListGroup className="mb-3">
                    {cart.map(item => (
                      <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          {item.quantity} x {item.size} {item.type}
                        </div>
                        <div>
                          ${item.price.toFixed(2)}
                          <Button 
                            variant="danger" 
                            size="sm" 
                            className="ms-2"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <h5>Total:</h5>
                    <h5>${calculateTotal()}</h5>
                  </div>
                  
                  <Button variant="success" onClick={placeOrder} className="w-100">
                    Place Order
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Your Orders</Card.Header>
            <Card.Body>
              {orders.length === 0 ? (
                <p>You have no orders yet</p>
              ) : (
                <ListGroup>
                  {orders.map(order => (
                    <ListGroup.Item key={order._id}>
                      <div className="d-flex justify-content-between">
                        <h6>Order #{order._id.substring(order._id.length - 6)}</h6>
                        <Badge bg={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p>Customer: {order.customerName}</p>
                      <p>Items:</p>
                      <ul>
                        {order.pizzas.map((pizza, index) => (
                          <li key={index}>
                            {pizza.quantity} x {pizza.size} {pizza.type}
                          </li>
                        ))}
                      </ul>
                      <p className="mb-0">Total: ${order.totalPrice.toFixed(2)}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerView;
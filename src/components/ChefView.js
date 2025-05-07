import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import socketService from '../services/socketService';
import apiService from '../services/apiService';
import './ChefView.css'
const ChefView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const socket = socketService.connect();

    socket.on('orderForPreparation', (newOrder) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    });

    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });


    fetchOrders();

    return () => {
      // Clean up socket listeners
      socket.off('orderForPreparation');
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrder = await apiService.updateOrderStatus(orderId, status);
      
      // Emit status update through socket
      socketService.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending': return 'Preparing';
      case 'Preparing': return 'Ready';
      case 'Ready': return 'Delivered';
      default: return null;
    }
  };

  const getButtonVariant = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Preparing': return 'success';
      case 'Ready': return 'info';
      default: return 'secondary';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'Pending': return 'Start Preparing';
      case 'Preparing': return 'Mark as Ready';
      case 'Ready': return 'Mark as Delivered';
      default: return 'Update Status';
    }
  };

  // Filter orders by status
  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const preparingOrders = orders.filter(order => order.status === 'Preparing');
  const readyOrders = orders.filter(order => order.status === 'Ready');
  const deliveredOrders = orders.filter(order => order.status === 'Delivered');

  return (
    <div>
      <h2 className="mb-4">Chef Dashboard</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-secondary text-white">Pending Orders</Card.Header>
            <Card.Body>
              {pendingOrders.length === 0 ? (
                <p>No pending orders</p>
              ) : (
                <ListGroup>
                  {pendingOrders.map(order => (
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
                      <Button 
                        variant={getButtonVariant(order.status)} 
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                        className="w-100"
                      >
                        {getButtonText(order.status)}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header className="bg-warning text-dark">Preparing</Card.Header>
            <Card.Body>
              {preparingOrders.length === 0 ? (
                <p>No orders being prepared</p>
              ) : (
                <ListGroup>
                  {preparingOrders.map(order => (
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
                      <Button 
                        variant={getButtonVariant(order.status)} 
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                        className="w-100"
                      >
                        {getButtonText(order.status)}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">Ready for Delivery</Card.Header>
            <Card.Body>
              {readyOrders.length === 0 ? (
                <p>No orders ready for delivery</p>
              ) : (
                <ListGroup>
                  {readyOrders.map(order => (
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
                      <Button 
                        variant={getButtonVariant(order.status)} 
                        onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}
                        className="w-100"
                      >
                        {getButtonText(order.status)}
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="bg-info text-white">Delivered Orders</Card.Header>
            <Card.Body>
              {deliveredOrders.length === 0 ? (
                <p>No delivered orders</p>
              ) : (
                <ListGroup>
                  {deliveredOrders.slice(0, 5).map(order => (
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
                    </ListGroup.Item>
                  ))}
                  {deliveredOrders.length > 5 && (
                    <ListGroup.Item className="text-center text-muted">
                      + {deliveredOrders.length - 5} more delivered orders
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChefView;
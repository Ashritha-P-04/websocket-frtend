import React from 'react';
import { Link } from 'react-router-dom';
import './Main.css';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Pizza Delivered To Your Door</h1>
          <p>Order your favorite pizza online with real-time delivery updates</p>
          <Link to="/customer" className="btn btn-primary">Order Now</Link>
        </div>
      </section>

      <section className="features container">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🍕</div>
            <h3>Quality Ingredients</h3>
            <p>We use only the freshest ingredients for our pizzas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Hot pizza delivered to your doorstep in 30 minutes or less</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Real-time Updates</h3>
            <p>Track your order status in real-time</p>
          </div>
        </div>
      </section>

      <section className="popular container">
        <h2 className="section-title">Popular Pizzas</h2>
        <div className="popular-grid">
          <div className="pizza-card">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Pepperoni Pizza" className="pizza-img" />
            <div className="pizza-info">
              <h3>Pepperoni Pizza</h3>
              <p>Classic pepperoni with cheese and tomato sauce</p>
              <div className="pizza-price">Rs:320.00</div>
              <Link to="/menu" className="btn btn-outline">Order Now</Link>
            </div>
          </div>
          <div className="pizza-card">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Margherita Pizza" className="pizza-img" />
            <div className="pizza-info">
              <h3>Margherita Pizza</h3>
              <p>Fresh tomatoes, mozzarella, and basil</p>
              <div className="pizza-price">Rs:200.00</div>
              <Link to="/menu" className="btn btn-outline">Order Now</Link>
            </div>
          </div>
          <div className="pizza-card">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" alt="Supreme Pizza" className="pizza-img" />
            <div className="pizza-info">
              <h3>Supreme Pizza</h3>
              <p>Loaded with vegetables and meats</p>
              <div className="pizza-price">Rs:280.00</div>
              <Link to="/menu" className="btn btn-outline">Order Now</Link>
            </div>
          </div>
        </div>
        <br /><br /><br />
        <Footer/>
      </section>
    </div>
  );
};

export default Home;
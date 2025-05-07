import React from 'react';
import { Link } from 'react-router-dom';
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="pizzahub-footer">
      <div className="pizzahub-footer-container">
        <div className="pizzahub-footer-logo">
          <Link to="/" className="logo">
            <span className="pizzahub-logo-text">Pizza</span>
            <span className="pizzahub-logo-accent">Hub</span>
          </Link>
          <p className="pizzahub-footer-tagline">
            Delicious pizzas delivered to your doorstep
          </p>
        </div>
        
        <div className="pizzahub-footer-links">
          <div className="pizzahub-footer-section">
            <h3 className="pizzahub-footer-heading">Quick Links</h3>
            <ul className="pizzahub-footer-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/my-orders">My Orders</Link></li>
            </ul>
          </div>
          
          <div className="pizzahub-footer-section">
            <h3 className="pizzahub-footer-heading">Contact Us</h3>
            <ul className="pizzahub-footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Pizza Street, Food City</span>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                <span>+1 234 567 8900</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@pizzahub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="pizzahub-footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
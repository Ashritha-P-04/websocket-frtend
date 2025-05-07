import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomerView from './components/CustomerView';
import ChefView from './components/ChefView';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Home from './components/Home/Main';
import Footer from './components/Home/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Pizza Ordering System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/customer">Customer</Nav.Link>
                <Nav.Link as={Link} to="/chef">Chef</Nav.Link>
                

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chef" element={<ChefView />} />
            <Route path="/customer" element={<CustomerView />} />
           


          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
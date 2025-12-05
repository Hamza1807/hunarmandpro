import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import Dashboard from './pages/Dashboard';
import GigsDashboard from './pages/GigsDashboard';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/gigs" 
            element={
              isAuthenticated() ? <GigsDashboard /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/messages" 
            element={
              isAuthenticated() ? <MessagesPage /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/orders" 
            element={
              isAuthenticated() ? <OrdersPage /> : <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


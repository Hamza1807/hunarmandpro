import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import Dashboard from './pages/Dashboard';
import GigsDashboard from './pages/GigsDashboard';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import SearchResultsPage from './pages/SearchResultsPage';
import GigDetailPage from './pages/GigDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import { isAuthenticated } from './utils/auth';
 import CreateGigPage from './pages/CreateGigPage';
   import MyGigsPage from './pages/MyGigsPage';
   import GigAnalyticsPage from './pages/GigAnalyticsPage';
import HunarmandProPremium from './pages/Premium'; 
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
            path="/search" 
            element={
              isAuthenticated() ? <SearchResultsPage /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/gig/:gigId" 
            element={
              isAuthenticated() ? <GigDetailPage /> : <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/favorites" 
            element={
              isAuthenticated() ? <FavoritesPage /> : <Navigate to="/" replace />
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
          <Route path="/create-gig" element={
              isAuthenticated() ? <CreateGigPage/> : <Navigate to="/" replace />}/>
              <Route path="/my-gigs" element={
              isAuthenticated() ? <MyGigsPage/> : <Navigate to="/" replace />}/>
              <Route path="/gig-analytics/:gigId" element={
              isAuthenticated() ? <GigAnalyticsPage/> : <Navigate to="/" replace />}/>
              <Route path="/edit-gig/:gigId" element={
              isAuthenticated() ? <CreateGigPage/> : <Navigate to="/" replace />}/>
          <Route path="/premium" element={<HunarmandProPremium />} /> 

        </Routes>
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SearchPG from './pages/SearchPG';
import PGDetails from './pages/PGDetails';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import { Toaster } from './components/ui/toaster';
import { useAccessibility } from './hooks/useAccessibility';

function App() {
  // Initialize accessibility features
  useAccessibility();

  return (
    <ErrorBoundary>
      <div className="App" id="main-content">
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchPG />} />
              <Route path="/pg/:id" element={<PGDetails />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Routes>
            <Footer />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;

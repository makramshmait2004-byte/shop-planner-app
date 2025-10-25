import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Signup2 from './pages/Signup2';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const isAuthenticated = useStore(state => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/signup2" 
          element={!isAuthenticated ? <Signup2 /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/join/:familyId" 
          element={<div className="min-h-screen flex items-center justify-center">Join Family Page - Coming Soon</div>} 
        />
      </Routes>
    </Router>
  );
};

export default App;
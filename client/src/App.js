import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookDetails from "./pages/BookDetails";

// Private Route for authenticated users
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route for non-authenticated users
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return !isAuthenticated ? children : <Navigate to="/books" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={<PublicRoute><LandingPage /></PublicRoute>} 
          />
          <Route 
            path="/register" 
            element={<PublicRoute><Register setIsAuthenticated={setIsAuthenticated} /></PublicRoute>} 
          />
          <Route 
            path="/login" 
            element={<PublicRoute><Login setIsAuthenticated={setIsAuthenticated} /></PublicRoute>} 
          />

          {/* Private routes */}
          <Route 
            path="/books" 
            element={<PrivateRoute><Books /></PrivateRoute>} 
          />
          <Route 
            path="/add" 
            element={<PrivateRoute><Add /></PrivateRoute>} 
          />
          <Route 
            path="/update/:id" 
            element={<PrivateRoute><Update /></PrivateRoute>} 
          />
          <Route 
            path="/book/:id" 
            element={<PrivateRoute><BookDetails /></PrivateRoute>}
          /> 

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

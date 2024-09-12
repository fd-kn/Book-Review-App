import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/register', { username, email, password });

      const loginResponse = await axios.post('http://localhost:8800/login', { email, password });
      const { token } = loginResponse.data;

      localStorage.setItem('token', token);

      setIsAuthenticated(true);

      navigate('/');

      alert('Registration and login successful!');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
      <h1 className="text-2xl mb-4">Register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>

      {/* Login Button */}
      <div className="text-center mt-4">
        <p className="text-gray-600">Already have an account?</p>
        <button
          onClick={handleLoginRedirect}
          className="w-full p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Login
        </button>
      </div>

      <button
          onClick={handleGoBack}
          className="w-full p-2 mt-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back
      </button>

    </div>
  );
};

export default Register;

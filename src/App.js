import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import QuotesList from './components/quotesList/quotesList';
import CreateQuote from './components/createQuote/createQuote';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/quotes" /> : <Login setToken={setToken} />} />
        <Route path="/quotes" element={token ? <QuotesList  setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="/create-quote" element={token ? <CreateQuote  setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

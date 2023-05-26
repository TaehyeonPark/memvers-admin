import React from 'react';
import { Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;

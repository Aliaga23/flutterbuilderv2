import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DiagramadorPage } from './pages/DiagramadorPage';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagramador/:id" element={<DiagramadorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

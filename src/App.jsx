import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Camera from './components/Camera';
import EditPhotos from './components/EditPhotos';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/photobooth" element={<Camera />} />
        <Route path="/edit" element={<EditPhotos />} />
        <Route path="/about" element={<div>About Page</div>} />
      </Routes>
    </div>
  );
}

export default App;

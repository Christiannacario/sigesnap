import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutModal from './AboutModal';
import './LandingPage.css';
import logo from './logo5.webp'
import logo2 from './logo6.jpg'

function LandingPage() {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  return (
    <div className="landing-container">
      <div className="header">
        <div className="logo">SigeSnap</div>
        <div className="nav-links">
          <button onClick={() => setIsAboutModalOpen(true)}>About</button>
        </div>
      </div>

      <div className="main-content">
        <h1 className="title">SigeSnap</h1>
        
        <div className="buttons-container">
          <button 
            className="camera-btn"
            onClick={() => navigate('/photobooth')}
          >
            <span className="camera-icon">📸</span> USE CAMERA
          </button>
          
          <button 
            className="upload-btn"
            onClick={() => navigate('/upload')}
          >
            <span className="upload-icon">⬆️</span> UPLOAD PHOTOS
          </button>
        </div>

        <div className="preview-container">
          <div className="preview-frame frame1">
            <img src={logo} alt="Your Image" style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="preview-frame frame2">
            <img src={logo2} alt="Your Image" style={{ width: '100%', height: '102%' ,}} />
          </div>
        </div>
      </div>

      <footer className="footer">
        Made <span className="heart">👽</span> by @chqnn
      </footer>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  );
}

export default LandingPage;

import React from 'react';
import './AboutModal.css';
import { FaGithub } from "react-icons/fa";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";



function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h1>Welcome to SigeSnap! 🎉 📸</h1>
        
        <h3>What is SigeSnap?</h3>
        
        <p className="description">
          Step into a world of vintage charm and playful memories! ✨
        </p>
        
        <p>
          SigeSnap is your go-to photobooth experience, where every snapshot 
          is filled with joy, laughter, and a touch of retro magic. Whether you're 
          celebrating a special occasion or just capturing fun moments with friends, 
          our customizable and aesthetic filters bring your photos to life with a 
          nostalgic yet modern twist.
        </p>

        <p className="tagline">
          📸 Snap. Smile. Sparkle. Let's make memories that last forever—one bubbly click at a time!
        </p>

        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagramSquare style={{ fontSize: '24px' }} />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
          <FaTiktok style={{ fontSize: '24px' }} />
          </a>
          <a href="https://github.com/Christiannacario" target="_blank" rel="noopener noreferrer">
          <FaGithub style={{ fontSize: '24px' }} />
          </a>
          <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
          <AiOutlineGlobal  style={{ fontSize: '24px' }} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;

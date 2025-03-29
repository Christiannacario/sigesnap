import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutModal from './AboutModal';
import './Camera.css';

function Camera() {
  const [countdown, setCountdown] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be loaded
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    startCamera();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCountdown = () => {
    if (capturedPhotos.length >= 3) return;
    
    setCountdown(3);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (capturedPhotos.length >= 3 || !videoRef.current?.videoWidth) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/png');
    
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, dataUrl];
      if (newPhotos.length === 3) {
        setShowMessage(false);
        setShowFinalScreen(true);
      } else {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          startCountdown();
        }, 1500);
      }
      return newPhotos;
    });
  };

  const handleEdit = () => {
    navigate('/edit', { state: { photos: capturedPhotos } });
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setShowFinalScreen(false);
    startCountdown();
  };

  return (
    <div className="camera-page">
      <div className="header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SigeSnap</div>
        <div className="nav-links">
          <button onClick={() => setIsAboutModalOpen(true)}>About</button>
        </div>
      </div>

      <div className="camera-container">
        {showFinalScreen ? (
          <>
            <div className="final-buttons">
              <button className="edit-button" onClick={handleEdit}>
                ✏️ EDIT PHOTOS
              </button>
              <button className="retake-button" onClick={handleRetake}>
                📸 RETAKE
              </button>
            </div>
            <div className="camera-wrapper final-preview">
              <div className="final-message">You look great!</div>
            </div>
          </>
        ) : (
          <>
            <div className="camera-wrapper">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="camera-preview"
              />
              {(countdown || showMessage) && (
                <div className="capture-message">
                  {countdown ? `${countdown}` : "Here's another one!"}
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <button 
              className="capture-button"
              onClick={startCountdown}
              disabled={capturedPhotos.length >= 3 || countdown !== null}
            >
              <span className="camera-icon">📸</span> TAKE A PHOTO
            </button>
          </>
        )}

        <div className="photo-indicators">
          {[0, 1, 2].map(index => (
            <div 
              key={index} 
              className={`indicator ${index < capturedPhotos.length ? 'filled' : ''}`}
            />
          ))}
        </div>
      </div>

      <footer className="footer">
        <span>Made with <span className="heart">👽</span> by @chqnn</span>
      </footer>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  );
}

export default Camera;

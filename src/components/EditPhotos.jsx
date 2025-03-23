import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './EditPhotos.css';
import AboutModal from './AboutModal';

function EditPhotos() {
  const location = useLocation();
  const navigate = useNavigate();
  const [photos] = useState(location.state?.photos || []);
  const [selectedPhotostrip, setSelectedPhotostrip] = useState('white');
  const [selectedBackground, setSelectedBackground] = useState('black');
  const [selectedFilter, setSelectedFilter] = useState('no-filter');
  const [enableDate, setEnableDate] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentStickerType, setCurrentStickerType] = useState(null);
  const photostripRef = useRef(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Initialize stickers for all photos
  const [stickersMap, setStickersMap] = useState(() => {
    const initial = {};
    photos.forEach((_, index) => {
      initial[index] = [];
    });
    return initial;
  });

  const positions = [
    { x: 5, y: 5 },       // top-left
    { x: 95, y: 5 },      // top-right
    { x: 5, y: 33 },      // left-upper
    { x: 95, y: 33 },     // right-upper
    { x: 5, y: 66 },      // left-lower
    { x: 95, y: 66 },     // right-lower
    { x: 5, y: 95 },      // bottom-left
    { x: 95, y: 95 }      // bottom-right
  ];

  const stickerOptions = [
    { id: 'axolotl', emoji: '🦕' },
    { id: 'cat', emoji: '🐱' },
    { id: 'panda', emoji: '🐼' },
  ];

  const handleStickerClick = (sticker) => {
    // Update current sticker type
    setCurrentStickerType(sticker);
    
    // Apply the sticker to all photos
    setStickersMap(prev => {
      const newStickersMap = {};
      
      // For each photo
      photos.forEach((_, photoIndex) => {
        // Clear previous stickers and add new ones in all positions
        newStickersMap[photoIndex] = positions.map((position, index) => ({
          ...sticker,
          id: `${photoIndex}-${index}`,
          x: position.x,
          y: position.y
        }));
      });
      
      return newStickersMap;
    });
  };

  const clearStickers = () => {
    setStickersMap(() => {
      const clearedMap = {};
      photos.forEach((_, index) => {
        clearedMap[index] = [];
      });
      return clearedMap;
    });
    setCurrentStickerType(null);
  };

  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'black-and-white':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'warm':
        return 'saturate(150%) brightness(105%)';
      case 'cold':
        return 'saturate(80%) brightness(95%)';
      case 'cool':
        return 'hue-rotate(180deg)';
      default:
        return 'none';
    }
  };

  const handleDownload = async () => {
    if (!photostripRef.current) return;

    try {
      const canvas = await html2canvas(photostripRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });

      const link = document.createElement('a');
      link.download = 'photostrip.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading photostrip:', error);
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="edit-page">
      <div className="header">
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>SigeSnap</div>
        <div className="nav-links">
          <button onClick={() => setIsAboutModalOpen(true)}>About</button>
        </div>
      </div>

      <div className="edit-container">
        <div className="preview-section">
          <div 
            ref={photostripRef}
            className={`photostrip-preview ${isPreviewMode ? 'preview-mode' : ''}`} 
            style={{ backgroundColor: selectedPhotostrip }}
          >
            {photos.map((photo, photoIndex) => (
              <div 
                key={photoIndex} 
                className="photo-frame"
                style={{ backgroundColor: selectedBackground }}
              >
                <img 
                  src={photo} 
                  alt={`Photo ${photoIndex + 1}`} 
                  style={{ filter: getFilterStyle(selectedFilter), width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {stickersMap[photoIndex]?.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="sticker"
                    style={{
                      position: 'absolute',
                      left: `${sticker.x}%`,
                      top: `${sticker.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '22px'
                    }}
                  >
                    {sticker.emoji}
                  </div>
                ))}
              </div>
            ))}
            {enableDate && (
              <div className="date-stamp">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>

        {!isPreviewMode && (
          <div className="controls-section">
            <div className="control-group">
              <h3>Stickers</h3>
              <div className="stickers-container">
                {stickerOptions.map(sticker => (
                  <button 
                    key={sticker.id} 
                    className={`sticker-button ${currentStickerType?.id === sticker.id ? 'selected' : ''}`}
                    onClick={() => handleStickerClick(sticker)}
                  >
                    {sticker.emoji}
                  </button>
                ))}
                <button 
                  className="sticker-button delete"
                  onClick={clearStickers}
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="control-group">
              <h3>Photostrip</h3>
              <div className="color-options">
                {['white', 'black', '#F5E6D3', 'lightblue', 'pink'].map(color => (
                  <button
                    key={color}
                    className={`color-button ${selectedPhotostrip === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedPhotostrip(color)}
                  />
                ))}
              </div>
            </div>

            <div className="control-group">
              <h3>Background</h3>
              <div className="color-options">
                {['black', 'white', '#F5E6D3', 'lightblue', 'pink'].map(color => (
                  <button
                    key={color}
                    className={`color-button ${selectedBackground === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedBackground(color)}
                  />
                ))}
              </div>
            </div>

            <div className="control-group">
              <h3>Filters</h3>
              <div className="filter-options">
                {['black-and-white', 'sepia', 'warm', 'cold', 'cool', 'no-filter'].map(filter => (
                  <button
                    key={filter}
                    className={`filter-button ${selectedFilter === filter ? 'selected' : ''}`}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="date-toggle">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={enableDate}
                  onChange={(e) => setEnableDate(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Enable Date</span>
            </div>

            <div className="action-buttons">
              <button className="preview-button" onClick={togglePreview}>
                👁️ Preview
              </button>
              <button className="download-button" onClick={handleDownload}>
                ⬇️ Download Photostrip
              </button>
              <button className="retake-button" onClick={() => navigate('/photobooth')}>
                📸 Retake Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {isPreviewMode && (
        <div className="preview-controls">
          <button className="exit-preview-button" onClick={togglePreview}>
            ← Back to Edit
          </button>
        </div>
      )}

      <footer className="footer">
        <span>Made with <span className="heart">❤️</span> by @chqnn</span>
      </footer>

      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  );
}

export default EditPhotos;

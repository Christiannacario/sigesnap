import React, { useEffect } from 'react';

function PhotoGallery({ photos }) {
  useEffect(() => {
    // Save photos to local storage
    localStorage.setItem('photos', JSON.stringify(photos));
  }, [photos]);

  return (
    <div>
      <h2>Photo Gallery</h2>
      <div className="gallery">
        {photos.map((photo, index) => (
          <img key={index} src={photo} alt={`Photo ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;

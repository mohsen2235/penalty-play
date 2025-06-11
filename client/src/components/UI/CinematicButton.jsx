import React from 'react';

export default function CinematicButton({ onClick, children }) {
  return (
    <button
      className="cinematic-btn"
      onClick={onClick}
    >
      {children || 'Cinematic'}
    </button>
  );
}

import React from 'react';

export default function ReplayButton({ onClick }) {
  return (
    <button
      className="replay-btn"
      onClick={onClick}
    >
      Replay
    </button>
  );
}

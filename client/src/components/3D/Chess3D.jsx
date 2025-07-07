import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import io from 'socket.io-client';

function ChessBoard() {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(null)));
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/chess', { transports: ['websocket'] }); // تنظیمات Socket
    socket.on('connect', () => console.log('Connected to chess namespace'));
    socket.on('gameState', (data) => setBoard(data.board || board));
    socket.on('movePiece', (data) => {
      setBoard(data.board || board);
      setSelected(null);
    });

    return () => socket.disconnect();
  }, []);

  const handleClick = (x, y) => {
    if (selected) {
      socket.emit('movePiece', { gameId: 'game1', from: `${selected.x},${selected.y}`, to: `${x},${y}`, userId: socket.id });
    } else if (board[x][y]) {
      setSelected({ x, y });
    }
  };

  return (
    <group>
      {board.map((row, i) =>
        row.map((piece, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[j - 3.5, 0, -(i - 3.5)]}
            onClick={() => handleClick(i, j)}
          >
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color={(i + j) % 2 === 0 ? '#f0d9b5' : '#b58863'} />
            {piece && (
              <mesh position={[0, 0.6, 0]}>
                <dodecahedronGeometry args={[0.4, 0]} />
                <meshStandardMaterial color={piece === piece.toUpperCase() ? '#ffffff' : '#000000'} />
              </mesh>
            )}
          </mesh>
        ))
      )}
    </group>
  );
}

export default function Chess3D() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow intensity={1} />
        <ChessBoard />
        <OrbitControls minDistance={5} maxDistance={15} />
      </Canvas>
    </div>
  );
}
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useStore } from '../store';

function Ball({ position }) {
  const [ref, api] = useBox(() => ({ mass: 1, position, args: [0.2, 0.2, 0.2] }));
  const { shooting } = useStore();
  useEffect(() => {
    if (shooting) {
      api.applyImpulse([0, 0, -5], [0, 0, 0]);
      useStore.setState({ shooting: false });
    }
  }, [shooting]);
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Ground() {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI/2, 0, 0], position: [0, -1, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial transparent opacity={0.3} />
    </mesh>
  );
}

export default function Game3D() {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow />
      <Physics>
        <Ground />
        <Ball position={[0, 0.5, 2]} />
      </Physics>
    </Canvas>
  );
}

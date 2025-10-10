import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface RegionData {
  region: string;
  fairness: number;
  models: number;
  lat: number;
  lng: number;
  description: string;
}

interface GlobeProps {
  onNodeClick: (region: RegionData) => void;
}

const regionalData: RegionData[] = [
  { region: "North America", fairness: 78, models: 234, lat: 40, lng: -100, description: "Leading in fairness metrics with extensive model coverage across major tech hubs." },
  { region: "Europe", fairness: 82, models: 189, lat: 50, lng: 10, description: "Strong regulatory frameworks driving high fairness standards in AI development." },
  { region: "Asia Pacific", fairness: 71, models: 312, lat: 20, lng: 120, description: "Rapid AI adoption with growing focus on ethical AI practices and fairness." },
  { region: "Latin America", fairness: 69, models: 87, lat: -15, lng: -60, description: "Emerging AI landscape with increasing attention to bias mitigation." },
  { region: "Middle East & Africa", fairness: 74, models: 56, lat: 10, lng: 20, description: "Developing AI ecosystems with focus on cultural context and fairness." },
];

function Node({ position, region, onClick, isHovered }: {
  position: [number, number, number];
  region: RegionData;
  onClick: (region: RegionData) => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.1;
    }
  });

  const color = region.fairness >= 80 ? '#10b981' : region.fairness >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.02, 16, 16]}>
        <meshStandardMaterial
          color={isHovered ? '#ffffff' : color}
          emissive={isHovered ? color : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </Sphere>
      {isHovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {region.region}: {region.fairness}%
          </div>
        </Html>
      )}
    </group>
  );
}

function Connections({ regions }: { regions: RegionData[] }) {
  const lines = useMemo(() => {
    const connections: JSX.Element[] = [];

    // Connect regions with fairness scores above 75
    const highFairnessRegions = regions.filter(r => r.fairness >= 75);

    for (let i = 0; i < highFairnessRegions.length; i++) {
      for (let j = i + 1; j < highFairnessRegions.length; j++) {
        const region1 = highFairnessRegions[i];
        const region2 = highFairnessRegions[j];

        const pos1 = latLngToVector3(region1.lat, region1.lng, 1.01);
        const pos2 = latLngToVector3(region2.lat, region2.lng, 1.01);

        connections.push(
          <line key={`${i}-${j}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...pos1, ...pos2])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#10b981" opacity={0.3} transparent />
          </line>
        );
      }
    }

    return connections;
  }, [regions]);

  return <>{lines}</>;
}

function latLngToVector3(lat: number, lng: number, radius: number = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function GlobeScene({ onNodeClick }: GlobeProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = regionalData.map((region) => {
    const position = latLngToVector3(region.lat, region.lng, 1.02);
    const isHovered = hoveredNode === region.region;

    return (
      <Node
        key={region.region}
        position={position}
        region={region}
        onClick={onNodeClick}
        isHovered={isHovered}
      />
    );
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} />
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a2e"
          wireframe
          opacity={0.1}
          transparent
        />
      </Sphere>
      <Connections regions={regionalData} />
      {nodes.map((node, index) => (
        <group
          key={regionalData[index].region}
          onPointerOver={() => setHoveredNode(regionalData[index].region)}
          onPointerOut={() => setHoveredNode(null)}
          onClick={() => onNodeClick(regionalData[index])}
        >
          {node}
        </group>
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Globe({ onNodeClick }: GlobeProps) {
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
        <GlobeScene onNodeClick={onNodeClick} />
      </Canvas>
    </div>
  );
}
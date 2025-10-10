import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Fair' | 'InProgress' | 'Biased';
  score: number;
  description: string;
  region: string;
}

interface GlobeProps {
  onNodeClick: (node: NodeData) => void;
  onNodeHover: (node: NodeData | null) => void;
}

interface NodeData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Fair' | 'InProgress' | 'Biased';
  score: number;
  description: string;
  region: string;
}

interface GlobeProps {
  onNodeClick: (node: NodeData) => void;
  onNodeHover: (node: NodeData | null) => void;
}

const nodeData: NodeData[] = [
  {
    id: "US001",
    name: "New York",
    lat: 40.7128,
    lng: -74.0060,
    status: "Fair",
    score: 85,
    description: "Leading AI fairness research hub with extensive model auditing capabilities.",
    region: "North America"
  },
  {
    id: "GB001",
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    status: "Fair",
    score: 88,
    description: "European center for AI ethics and regulatory compliance frameworks.",
    region: "Europe"
  },
  {
    id: "JP001",
    name: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    status: "InProgress",
    score: 72,
    description: "Rapid AI adoption with ongoing fairness assessments for Asian markets.",
    region: "Asia Pacific"
  },
  {
    id: "IN001",
    name: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    status: "Fair",
    score: 92,
    description: "Analyzing AI bias in language models trained on diverse Indian data.",
    region: "Asia Pacific"
  },
  {
    id: "DE001",
    name: "Berlin",
    lat: 52.5200,
    lng: 13.4050,
    status: "Fair",
    score: 90,
    description: "GDPR-compliant AI auditing and fairness testing center.",
    region: "Europe"
  },
  {
    id: "KE001",
    name: "Nairobi",
    lat: -1.2921,
    lng: 36.8219,
    status: "Biased",
    score: 65,
    description: "Emerging AI hub focusing on African data representation and bias mitigation.",
    region: "Africa"
  },
  {
    id: "BR001",
    name: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
    status: "InProgress",
    score: 68,
    description: "Latin American AI development with growing fairness awareness.",
    region: "Latin America"
  },
  {
    id: "AU001",
    name: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    status: "Fair",
    score: 86,
    description: "Pacific region AI ethics and fairness research center.",
    region: "Asia Pacific"
  }
];

const getNodeColor = (status: string) => {
  switch (status) {
    case 'Fair': return '#10b981'; // Green
    case 'InProgress': return '#f59e0b'; // Orange
    case 'Biased': return '#ef4444'; // Red
    default: return '#6b7280'; // Gray
  }
};

function Node({ position, node, onClick, isHovered }: {
  position: [number, number, number];
  node: NodeData;
  onClick: (node: NodeData) => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime + position[1]) * 0.2;
    }
  });

  const color = getNodeColor(node.status);

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.015, 16, 16]}>
        <meshStandardMaterial
          color={isHovered ? '#ffffff' : color}
          emissive={isHovered ? color : '#000000'}
          emissiveIntensity={isHovered ? 0.4 : 0.1}
        />
      </Sphere>
      {/* Pulsing ring effect */}
      <Sphere args={[0.02, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHovered ? 0.3 : 0.1}
          wireframe
        />
      </Sphere>
      {isHovered && (
        <Html distanceFactor={8}>
          <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-cyan-500/30 text-sm whitespace-nowrap">
            <div className="font-semibold">{node.name}</div>
            <div className="text-cyan-300">Fairness: {node.score}%</div>
            <div className="text-xs text-gray-400">{node.region}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Arc({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.3,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} opacity={0.6} transparent />
    </line>
  );
}

function Connections({ nodes }: { nodes: NodeData[] }) {
  const arcs = useMemo(() => {
    const connections: JSX.Element[] = [];
    const fairNodes = nodes.filter(node => node.status === 'Fair');

    for (let i = 0; i < fairNodes.length; i++) {
      for (let j = i + 1; j < fairNodes.length; j++) {
        const node1 = fairNodes[i];
        const node2 = fairNodes[j];

        const pos1 = latLngToVector3(node1.lat, node1.lng, 1.02);
        const pos2 = latLngToVector3(node2.lat, node2.lng, 1.02);

        connections.push(
          <Arc
            key={`${node1.id}-${node2.id}`}
            start={pos1}
            end={pos2}
            color="#10b981"
          />
        );
      }
    }

    return connections;
  }, [nodes]);

  return <>{arcs}</>;
}

function latLngToVector3(lat: number, lng: number, radius: number = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function Earth({ onNodeClick, onNodeHover }: GlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  // Load Earth textures
  const earthTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg');
  const earthBumpMap = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthbump1k.jpg');
  const earthSpecularMap = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthspec1k.jpg');
  const cloudsTexture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthcloudmap.jpg');

  // Configure textures
  earthTexture.wrapS = earthTexture.wrapT = THREE.RepeatWrapping;
  earthBumpMap.wrapS = earthBumpMap.wrapT = THREE.RepeatWrapping;
  earthSpecularMap.wrapS = earthSpecularMap.wrapT = THREE.RepeatWrapping;
  cloudsTexture.wrapS = cloudsTexture.wrapT = THREE.RepeatWrapping;

  // Animate Earth rotation
  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.12; // Clouds rotate slightly faster
    }
  });

  const nodes = nodeData.map((node) => {
    const position = latLngToVector3(node.lat, node.lng, 1.03);
    const isHovered = hoveredNode?.id === node.id;

    return (
      <Node
        key={node.id}
        position={position}
        node={node}
        onClick={onNodeClick}
        isHovered={isHovered}
      />
    );
  });

  return (
    <group>
      {/* Enhanced lighting for realistic Earth appearance */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4169E1" />

      {/* Earth surface with realistic textures */}
      <Sphere ref={earthRef} args={[1, 128, 128]} castShadow receiveShadow>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={earthBumpMap}
          bumpScale={0.05}
          specularMap={earthSpecularMap}
          specular={0x111111}
          shininess={10}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[1.01, 64, 64]}>
        <meshPhongMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          alphaMap={cloudsTexture}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Enhanced atmosphere with multiple layers */}
      <Sphere args={[1.05, 64, 64]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      <Sphere args={[1.08, 32, 32]}>
        <meshBasicMaterial
          color="#4c1d95"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      <Connections nodes={nodeData} />

      {nodes.map((node, index) => (
        <group
          key={nodeData[index].id}
          onPointerOver={() => {
            setHoveredNode(nodeData[index]);
            onNodeHover(nodeData[index]);
          }}
          onPointerOut={() => {
            setHoveredNode(null);
            onNodeHover(null);
          }}
          onClick={() => onNodeClick(nodeData[index])}
        >
          {node}
        </group>
      ))}
    </group>
  );
}

function GlobeScene({ onNodeClick, onNodeHover }: GlobeProps) {
  return (
    <>
      <Earth onNodeClick={onNodeClick} onNodeHover={onNodeHover} />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={1.5}
        maxDistance={4}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function InteractiveGlobe({ onNodeClick, onNodeHover }: GlobeProps) {
  return (
    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GlobeScene onNodeClick={onNodeClick} onNodeHover={onNodeHover} />
      </Canvas>

      {/* Overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-purple-900/20 via-transparent to-cyan-900/10" />
        <div className="absolute top-4 right-4 text-cyan-300 text-sm font-mono">
          ETHOLENS AI FAIRNESS NETWORK
        </div>
      </div>
    </div>
  );
}
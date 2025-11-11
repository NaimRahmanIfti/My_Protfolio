import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations, Float } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three"; 

/**
 * Enhanced Spaceman Component with multiple animation options
 * 
 * Props:
 * - scale: number or [x,y,z] - Scale of the model (default: 0.01)
 * - position: [x,y,z] - Position in 3D space (default: [0,0,0])
 * - rotation: [x,y,z] - Rotation in radians (default: [0,0,0])
 * - floatIntensity: number - Intensity of floating animation (default: 1)
 * - rotationSpeed: number - Speed of rotation animation (default: 0.002)
 * - enableFloat: boolean - Enable floating animation (default: true)
 * - enableRotation: boolean - Enable rotation animation (default: true)
 * - enableEntrance: boolean - Enable entrance animation (default: true)
 */
export function SpacemanEnhanced(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/spaceman-transformed.glb");
  const { actions } = useAnimations(animations, group);

  // Configuration
  const {
    scale = 0.01,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    floatIntensity = 1,
    rotationSpeed = 0.002,
    enableFloat = true,
    enableRotation = true,
    enableEntrance = true,
    ...restProps
  } = props;

  // Handle model animations if they exist
  useEffect(() => {
    if (animations && animations.length > 0) {
      // Play all animations
      animations.forEach((clip) => {
        const action = actions[clip.name];
        if (action) {
          action.play();
        }
      });
    }
  }, [actions, animations]);

  // Entrance animation setup
  const yPosition = useMotionValue(enableEntrance ? 20 : 0);
  const ySpring = useSpring(yPosition, { 
    damping: 20, 
    stiffness: 40 
  });

  useEffect(() => {
    if (enableEntrance) {
      const timer = setTimeout(() => {
        yPosition.set(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [yPosition, enableEntrance]);

  // Animation state
  const floatY = useRef(0);
  const time = useRef(0);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!group.current) return;

    time.current += delta;

    // Apply entrance animation
    if (enableEntrance) {
      group.current.position.y = position[1] + ySpring.get();
    }

    // Floating animation
    if (enableFloat) {
      floatY.current += delta;
      const floatOffset = Math.sin(floatY.current * 0.5) * 0.1 * floatIntensity;
      const bobOffset = Math.cos(floatY.current * 0.3) * 0.05 * floatIntensity;
      
      if (!enableEntrance) {
        group.current.position.y = position[1] + floatOffset;
      } else {
        group.current.position.y += floatOffset;
      }
      
      // Subtle tilt while floating
      group.current.rotation.z = Math.sin(floatY.current * 0.2) * 0.02 * floatIntensity;
      group.current.rotation.x = Math.cos(floatY.current * 0.3) * 0.02 * floatIntensity;
    }

    // Rotation animation
    if (enableRotation) {
      group.current.rotation.y += rotationSpeed;
    }
  });

  // Mesh component for repeated use
  const MeshComponent = ({ nodeName, materialName, ...meshProps }) => (
    <mesh 
      geometry={nodes[nodeName]?.geometry} 
      material={materials[materialName]}
      position={[13.127, -265.021, -4.456]} 
      rotation={[-1.383, -1.553, -1.427]} 
      scale={[1, 1, 0.812]}
      castShadow
      receiveShadow
      {...meshProps}
    />
  );

  return (
    <group 
      ref={group} 
      {...restProps} 
      dispose={null}
      scale={scale}
      position={position}
      rotation={rotation}
    >
      {/* Body parts */}
      <MeshComponent nodeName="00KOSMONAFT_pants_0" materialName="pants" />
      <MeshComponent nodeName="00KOSMONAFT_belt_0" materialName="belt" />
      <MeshComponent nodeName="00KOSMONAFT_shoulders_0" materialName="shoulders" />
      <MeshComponent nodeName="00KOSMONAFT_elbow_0" materialName="elbow" />
      <MeshComponent nodeName="00KOSMONAFT_oxygen_0" materialName="oxygen" />
      <MeshComponent nodeName="00KOSMONAFT_body_0" materialName="body" />
      <MeshComponent nodeName="00KOSMONAFT_body_kits_0" materialName="body_kits" />
      <MeshComponent nodeName="00KOSMONAFT_socks_0" materialName="socks" />
      <MeshComponent nodeName="00KOSMONAFT_boots_top_0" materialName="boots_top" />
      <MeshComponent nodeName="00KOSMONAFT_boots_0" materialName="boots" />
      <MeshComponent nodeName="00KOSMONAFT_hands_0" materialName="hands" />
      <MeshComponent nodeName="00KOSMONAFT_gloves_0" materialName="gloves" />
      
      {/* Helmet parts */}
      <MeshComponent nodeName="00KOSMONAFT001_details_0" materialName="details" />
      <MeshComponent nodeName="00KOSMONAFT001_glass_0" materialName="glass" />
      <MeshComponent nodeName="00KOSMONAFT001_details2_0" materialName="details2" />
    </group>
  );
}

/**
 * Simple Spaceman Component - Minimal version
 */
export function SpacemanSimple(props) {
  const { nodes, materials } = useGLTF("/spaceman-transformed.glb");
  
  return (
    <group {...props} dispose={null}>
      {Object.keys(nodes).map((nodeName) => {
        const node = nodes[nodeName];
        if (node.geometry) {
          const materialName = nodeName.split('_')[1] || 'default';
          return (
            <mesh
              key={nodeName}
              geometry={node.geometry}
              material={materials[materialName] || materials.default}
              position={[13.127, -265.021, -4.456]} 
              rotation={[-1.383, -1.553, -1.427]} 
              scale={[1, 1, 0.812]}
            />
          );
        }
        return null;
      })}
    </group>
  );
}

/**
 * Spaceman with Float wrapper from drei
 */
export function SpacemanWithFloat(props) {
  const { nodes, materials } = useGLTF("/spaceman-transformed.glb");
  
  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[0, 1]}
    >
      <group {...props} dispose={null} scale={0.01}>
        {/* All mesh components */}
        <mesh geometry={nodes['00KOSMONAFT_pants_0'].geometry} material={materials.pants} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_belt_0'].geometry} material={materials.belt} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_shoulders_0'].geometry} material={materials.shoulders} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_elbow_0'].geometry} material={materials.elbow} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_oxygen_0'].geometry} material={materials.oxygen} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_body_0'].geometry} material={materials.body} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_body_kits_0'].geometry} material={materials.body_kits} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_socks_0'].geometry} material={materials.socks} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_boots_top_0'].geometry} material={materials.boots_top} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_boots_0'].geometry} material={materials.boots} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_hands_0'].geometry} material={materials.hands} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT_gloves_0'].geometry} material={materials.gloves} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT001_details_0'].geometry} material={materials.details} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT001_glass_0'].geometry} material={materials.glass} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
        <mesh geometry={nodes['00KOSMONAFT001_details2_0'].geometry} material={materials.details2} position={[13.127, -265.021, -4.456]} rotation={[-1.383, -1.553, -1.427]} scale={[1, 1, 0.812]} />
      </group>
    </Float>
  );
}

// Preload the model
useGLTF.preload("/models/spaceman-transformed.glb");

// Export all variants
export { SpacemanEnhanced as default };
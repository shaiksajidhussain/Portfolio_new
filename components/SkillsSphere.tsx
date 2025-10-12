'use client'
import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

// Type extensions for navigator and WebGL renderer
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
  
  interface WebGLRenderer {
    antialias?: boolean;
    alpha?: boolean;
  }
}

interface SkillItem {
  name: string
  icon: string
  category: string
  position: [number, number, number]
}

interface SkillsSphereProps {
  skills: Array<{
    title: string
    skills: string[]
  }>
  skillImages: Record<string, string>
  onSkillHover?: (skill: string) => void
  onSkillClick?: (skill: string) => void
  isLowPerformance?: boolean
}

// Individual skill point component
function SkillPoint({ skill, position, onClick }: {
  skill: SkillItem
  position: [number, number, number]
  onClick: (skill: string) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const floatIntensity = 0.03
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * floatIntensity
    }
  })

  const handleClick = () => {
    onClick(skill.name)
  }

  return (
    <group position={position}>
      {/* Invisible larger sphere for click detection */}
      <mesh
        onClick={handleClick}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible skill sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color='#ffffff'
          emissive='#854ce6'
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Skill label - always visible */}
      <Html
        position={[0, 0.2, 0]}
        center
        distanceFactor={6}
        occlude={false}
        style={{
          pointerEvents: 'none',
          fontSize: '14px',
          color: '#ffffff',
          fontWeight: 'bold',
          textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
          opacity: 0.9,
        }}
      >
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          padding: '6px 12px', 
          borderRadius: '15px',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(4px)'
        }}>
          {skill.name}
        </div>
      </Html>
    </group>
  )
}

// Main sphere component
function SkillsSphere({ skills, skillImages, onSkillClick, isLowPerformance = false }: SkillsSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Generate skill positions on sphere surface
  const skillItems = useMemo(() => {
    const items: SkillItem[] = []
    let index = 0

    skills.forEach((category) => {
      category.skills.forEach((skill) => {
        // Fibonacci spiral distribution on sphere
        const phi = Math.acos(1 - 2 * index / (skills.flatMap(s => s.skills).length))
        const theta = Math.PI * (3 - Math.sqrt(5)) * index

        const x = Math.cos(theta) * Math.sin(phi)
        const y = Math.cos(phi)
        const z = Math.sin(theta) * Math.sin(phi)

        items.push({
          name: skill,
          icon: skillImages[skill] || '',
          category: category.title,
          position: [x * 2.5, y * 2.5, z * 2.5] as [number, number, number]
        })
        index++
      })
    })

    return items
  }, [skills, skillImages])

  useFrame(() => {
    if (groupRef.current) {
      // Continuous auto rotation - slower and smoother
      groupRef.current.rotation.y += 0.003
    }
  })

  const handleSkillClick = (skill: string) => {
    console.log(`Clicked on skill: ${skill}`)
    onSkillClick?.(skill)
  }

  return (
    <group ref={groupRef}>
      {/* Main sphere wireframe */}
      <Sphere args={isLowPerformance ? [2.5, 16, 16] : [2.5, 32, 32]}>
        <meshBasicMaterial
          color="#854ce6"
          wireframe
          opacity={0.15}
          transparent
        />
      </Sphere>

      {/* Skill points - limit on low performance devices */}
      <group ref={sphereRef}>
        {(isLowPerformance ? skillItems.slice(0, 15) : skillItems).map((skill, index) => (
          <SkillPoint
            key={`${skill.category}-${skill.name}-${index}`}
            skill={skill}
            position={skill.position}
            onClick={handleSkillClick}
          />
        ))}
      </group>

      {/* Optimized lighting based on performance */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#854ce6" />
      {!isLowPerformance && (
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#5edfff" />
      )}
    </group>
  )
}

// Main component
const SkillsSphereComponent: React.FC<SkillsSphereProps> = (props) => {
  const [mounted, setMounted] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Detect low performance devices
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     (navigator.deviceMemory || 8) <= 4 ||
                     /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsLowPerformance(isLowEnd)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading 3D Skills...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }} // Enable performance monitoring
        dpr={isLowPerformance ? [1, 1.5] : [1, 2]} // Limit pixel ratio on low-end devices
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0)
          
          // Optimize renderer settings
          gl.setPixelRatio(Math.min(window.devicePixelRatio, isLowPerformance ? 1.5 : 2))
        }}
        gl={{ 
          antialias: !isLowPerformance,
          alpha: true,
          powerPreference: isLowPerformance ? "low-power" : "high-performance"
        }}
      >
        <SkillsSphere {...props} isLowPerformance={isLowPerformance} />
      </Canvas>
      
  
      
      {/* Performance indicator */}
      {isLowPerformance && (
        <div className="absolute top-4 right-4 text-xs text-yellow-400 opacity-75">
          Optimized for performance
        </div>
      )}
    </div>
  )
}

export default SkillsSphereComponent

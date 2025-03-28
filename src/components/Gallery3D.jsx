import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, useTexture, Html, Environment } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'

// 키보드 입력 감지
function useKeyboardControls() {
  const keys = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.key.toLowerCase()] = true)
    const handleKeyUp = (e) => (keys.current[e.key.toLowerCase()] = false)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keys
}

// 플레이어
function Player() {
  const ref = useRef()
  const keys = useKeyboardControls()
  const { camera } = useThree()

  useFrame(() => {
    const body = ref.current
    if (!body) return

    const direction = new THREE.Vector3()
    const velocity = new THREE.Vector3()

    const speed = 5

    if (keys.current['w']) velocity.z -= 1
    if (keys.current['s']) velocity.z += 1
    if (keys.current['a']) velocity.x -= 1
    if (keys.current['d']) velocity.x += 1

    velocity.normalize().multiplyScalar(speed)

    // 방향 회전
    const euler = new THREE.Euler(0, camera.rotation.y, 0)
    direction.copy(velocity).applyEuler(euler)

    // 이동 적용
    body.setLinvel({ x: direction.x, y: body.linvel().y, z: direction.z }, true)

    // 카메라는 rigidBody 위치 따라감
    const pos = body.translation()
    camera.position.set(pos.x, pos.y, pos.z)
  })

  return (
    <>
      <RigidBody
        ref={ref}
        colliders="capsule"
        mass={1}
        position={[0, 1.6, 5]}
        enabledRotations={[false, false, false]}
      />
    </>
  )
}

function Wall({ position, scale, color }) {
  return (
    <RigidBody type="fixed">
      <mesh position={position} scale={scale}>
        <boxGeometry />
        <meshStandardMaterial color={color || '#B2A59B'} />
      </mesh>
    </RigidBody>
  )
}

function Painting({ position, imageUrl, title }) {
  const texture = useTexture(imageUrl)

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={position}>
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        <Html position={[0, -1.3, 0]}>
          <div className="bg-white/90 px-2 py-1 rounded text-sm shadow">
            {title}
          </div>
        </Html>
      </group>
    </RigidBody>
  )
}

export default function Gallery3D() {
  return (
    <div className="h-screen w-full">
      <Canvas shadows camera={{ fov: 75 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
        <Environment preset="sunset" />

        <Physics gravity={[0, -9.81, 0]}>
          <Player />

          {/* 바닥 */}
          <RigidBody type="fixed">
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[40, 40]} />
              <meshStandardMaterial color="#DED0B6" />
            </mesh>
          </RigidBody>

          {/* 벽 */}
          <Wall position={[0, 2.5, -20]} scale={[40, 5, 0.5]} />
          <Wall position={[0, 2.5, 20]} scale={[40, 5, 0.5]} />
          <Wall position={[-20, 2.5, 0]} scale={[0.5, 5, 40]} />
          <Wall position={[20, 2.5, 0]} scale={[0.5, 5, 40]} />
          <Wall position={[0, 5, 0]} scale={[40, 0.5, 40]} color="#607274" />

          {/* 그림 */}
          <Painting position={[-6, 2, -19.5]} imageUrl="/art1.png" title="작품 1" />
          <Painting position={[0, 2, -19.5]} imageUrl="/art2.jpeg" title="작품 2" />
          <Painting position={[6, 2, -19.5]} imageUrl="/art3.jpeg" title="작품 3" />
        </Physics>

        <PointerLockControls />
      </Canvas>

      <div className="absolute top-2 left-2 text-white bg-black/70 px-4 py-2 rounded text-sm z-50">
        마우스 클릭 후 → WASD 이동
      </div>
    </div>
  )
}

// src/pages/GalleryWalkable.jsx

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  PointerLockControls,
  Html,
  useTexture,
} from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { ImportedGallery } from '../components/ImportedGallery'

/* 🎮 키 입력 */
function useKeys() {
  const keys = useRef({})
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true)
    const up = (e) => (keys.current[e.key.toLowerCase()] = false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])
  return keys
}

/* 🧍 플레이어 */
function Player() {
  const ref = useRef()
  const keys = useKeys()
  const { camera } = useThree()

  useFrame(() => {
    const body = ref.current
    if (!body) return

    const speed = 4
    const direction = new THREE.Vector3()

    if (keys.current['w']) direction.z -= 1
    if (keys.current['s']) direction.z += 1
    if (keys.current['a']) direction.x -= 1
    if (keys.current['d']) direction.x += 1

    direction.normalize().multiplyScalar(speed)
    direction.applyEuler(new THREE.Euler(0, camera.rotation.y, 0))

    body.setLinvel({ x: direction.x, y: body.linvel().y, z: direction.z }, true)

    const pos = body.translation()
    if (pos) camera.position.set(pos.x, pos.y, pos.z)
  })

  return (
    <RigidBody
      ref={ref}
      colliders="capsule"
      mass={1}
      position={[0, 1.6, 2]}
      enabledRotations={[false, false, false]}
      friction={0}
      linearDamping={0}
    />
  )
}

/* 🖼️ 그림 */
function Painting({ position, imageUrl, title }) {
  const texture = useTexture(imageUrl)
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group position={position}>
        <mesh>
          <planeGeometry args={[2.5, 1.8]} />
          <meshStandardMaterial map={texture} />
        </mesh>
        <Html position={[0, -1.2, 0]}>
          <div className="bg-white/80 text-black px-2 py-1 rounded shadow text-sm">
            {title}
          </div>
        </Html>
      </group>
    </RigidBody>
  )
}

/* 🌐 전체 페이지 */
export default function GalleryWalkable() {
  const controlsRef = useRef()

  const handleTogglePointerLock = () => {
    if (document.pointerLockElement) {
      document.exitPointerLock()
    } else {
      controlsRef.current?.lock()
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {/* 🔘 마우스 잠금 버튼 */}
      <button
        onClick={handleTogglePointerLock}
        className="absolute top-4 right-4 z-50 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        🔒 마우스 잠금 토글
      </button>

      <Canvas shadows camera={{ fov: 45, position: [0, 2, 5] }}>
        {/* ☀️ 조명 */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <Environment preset="sunset" />
        <PointerLockControls ref={controlsRef} />

        {/* 🎯 좌표축 (디버깅용) */}
        <primitive object={new THREE.AxesHelper(5)} position={[0, 0, 0]} />

        <Physics gravity={[0, -9.81, 0]}>
          <Player />
          <ImportedGallery scale={4} position={[0, -1.5, 0]} />
          <Painting position={[0, 2, -23.9]} imageUrl="/art1.png" title="작품 1" />
          <Painting position={[3, 2, -23.9]} imageUrl="/art2.jpeg" title="작품 2" />
          <Painting position={[-3, 2, -23.9]} imageUrl="/art3.jpeg" title="작품 3" />
        </Physics>
      </Canvas>

      {/* 안내 문구 */}
      <div className="absolute top-2 left-2 z-50 bg-black/70 text-white px-4 py-2 rounded text-sm pointer-events-none">
        🧍 WASD로 이동 가능 / 마우스 회전<br />
        🎨 전시관에 작품 배치 완료!
      </div>
    </div>
  )
}

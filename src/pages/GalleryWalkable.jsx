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
import './GalleryWalkable.css'

function useKeys() {
  const keys = useRef({})
  useEffect(() => {
    const down = (e) => {
      console.log('⬇️ 키 눌림:', e.key) // ✅ 이거 꼭 추가!
      keys.current[e.key.toLowerCase()] = true
    }
    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])
  return keys
}

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

    const isMoving = direction.length() > 0
    if(isMoving) {
        console.log("방향 벡터 : ", direction.toArray())
    }

    direction.normalize().multiplyScalar(speed)
    direction.applyEuler(new THREE.Euler(0, camera.rotation.y, 0))

    const velocity = {
        x: direction.x,
        y: body.linvel().y,
        z: direction.z,
    }

    if(isMoving) {
        console.log("속도 적용: ", velocity)
    }

    body.setLinvel({ x: direction.x, y: body.linvel().y, z: direction.z }, true)

    const pos = body.translation()
    if (pos) {
        camera.position.set(pos.x, pos.y, pos.z)
        if(isMoving) console.log("카메라 위치: ", pos)
    }

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
          <div className="painting-label">{title}</div>
        </Html>
      </group>
    </RigidBody>
  )
}

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
    <div className="gallery-container">
      <div className="gallery-wrapper">
        <button className="lock-button" onClick={handleTogglePointerLock}>
          🔒 마우스 잠금 토글
        </button>

        <Canvas shadows camera={{ fov: 45, position: [0, 2, 5] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
          <Environment preset="sunset" />
          <PointerLockControls ref={controlsRef} />
          <primitive object={new THREE.AxesHelper(5)} position={[0, 0, 0]} />

          <Physics gravity={[0, -9.81, 0]}>
            <Player />
            <ImportedGallery scale={4} position={[0, -1.5, 0]} />
            <Painting position={[0, 2, -23.9]} imageUrl="/art1.png" title="작품 1" />
            <Painting position={[3, 2, -23.9]} imageUrl="/art2.jpeg" title="작품 2" />
            <Painting position={[-3, 2, -23.9]} imageUrl="/art3.jpeg" title="작품 3" />
          </Physics>
        </Canvas>

        <div className="info-banner">
          🧍 WASD로 이동 / 마우스 회전<br />
          🎨 전시관에 작품 배치 완료!
        </div>
      </div>
    </div>
  )
}

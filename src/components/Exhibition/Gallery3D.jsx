import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  useGLTF,
  useTexture,
  PointerLockControls,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import * as THREE from "three";
import "./Gallery3D.css";

// 키보드 입력 추적 훅
function useKeyboardControls() {
  const keys = useRef({})
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true)
    const up = (e) => (keys.current[e.key.toLowerCase()] = false)
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])
  return keys
}

// Player 캐릭터 + 걷기 제어
function Player({ position = [-26, 0.8, 15] }) {
  const ref = useRef()
  const keys = useKeyboardControls()
  const { camera } = useThree()

  useFrame(() => {
    const body = ref.current
    if (!body || typeof body.setLinvel !== "function") return

    const speed = 5
    const direction = new Vector3()

    // WASD 이동 방향 설정
    if (keys.current["w"]) direction.z -= 0.1
    if (keys.current["s"]) direction.z += 0.1
    if (keys.current["a"]) direction.x -= 0.1
    if (keys.current["d"]) direction.x += 0.1

    if (direction.length() === 0) return

    direction.normalize().multiplyScalar(speed)
    direction.applyQuaternion(camera.quaternion)  // 카메라 기준 방향 적용

    const velocity = {
      x: direction.x,
      y: body.linvel().y,
      z: direction.z,
    }

    body.setLinvel(velocity, true)

    // 카메라 위치 동기화
    const pos = body.translation()
    if (pos) camera.position.set(pos.x, pos.y + 1.5, pos.z)
  })

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      position={position}
      colliders="cuboid"
      enabledRotations={[false, false, false]}
      canSleep={false}
      friction={0}
    >
      {/* Player의 보이지 않는 Body(충돌 구현 위해 필요) */}
      <mesh>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  )
}

// 전시관 전체 구조물 모델
function GalleryModel({ scale = 2 }) {
  const { scene } = useGLTF("/models/vr_art_gallery_01.glb")
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={scale} position={[-8, 0, 15]} />
    </RigidBody>
  )
}

// 개별 액자 + 그림 + 조명 + 전등
function Painting({ position, imageUrl, title }) {
  const texture = useTexture(imageUrl)
  const wood = useTexture("/wood.jpg")
  const { scene } = useGLTF("/models/led_projector_lamp_vega_c100.glb")
  const lamp = useMemo(() => scene.clone(true), [scene])  // 전등 그림 수 만큼 복제

  const groupRef = useRef()
  const lightRef = useRef()

  const width = 2.5
  const height = 1.8
  const frameWidth = 0.15
  const frameDepth = 0.3

  // SpotLight 타겟을 액자 중심으로 고정
  useFrame(() => {
    if (lightRef.current && groupRef.current) {
      lightRef.current.target = groupRef.current
    }
  })

  return (
    <group position={position} ref={groupRef} className="painting-group">
      {/* 메인 그림 */}
      <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* 액자 테두리 4면 */}
      <mesh position={[0, height / 2 + frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
        <meshStandardMaterial map={wood} />
      </mesh>
      <mesh position={[0, -height / 2 - frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
        <meshStandardMaterial map={wood} />
      </mesh>
      <mesh position={[-width / 2 - frameWidth / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height, frameDepth]} />
        <meshStandardMaterial map={wood} />
      </mesh>
      <mesh position={[width / 2 + frameWidth / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height, frameDepth]} />
        <meshStandardMaterial map={wood} />
      </mesh>

      <mesh position={[-width / 2 + 0.2, height / 2 + 0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.4]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2 - 0.2, height / 2 + 0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.4]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
      </mesh>

      {/* 전등 모델 */}
      <primitive object={lamp} position={[0, -height / 2 - 7, 0.25]} scale={6} rotation={[Math.PI, Math.PI, Math.PI]} />

      {/* 전등 발광 효과용 pointLight */}
      <pointLight color="#ffdca8" decay={2} position={[0, height / 2 + 1.24, 0.26]} intensity={10} distance={0.28} />

      {/* 실제 조명 투사용 SpotLight */}
      <spotLight
        color="#ffdca8"
        decay={2}
        ref={lightRef}
        position={[0, height / 2 + 1.5, 0.9]}
        angle={0.6}
        penumbra={0.01}
        intensity={20}
        distance={4}
        castShadow
      />
      {/* 작품 제목 라벨 */}
      <Html position={[0, -height / 2 - frameWidth - 0.3, 0]}>
        <div className="painting-label">{title}</div>
      </Html>
    </group>
  )
}

export default function Gallery3D_Walkable() {
  return (
    <div className="gallery3d-wrapper fade-in">
      <h2 className="gallery-title">3D 작품 전시관</h2>

      <div className="gallery3d-container">
        <Canvas shadows camera={{ fov: 60, position: [-26, 2.5, 15] }} style={{ background: "#dcdcdc" }}>
          <ambientLight intensity={0.4} />
          <Environment preset="night" />
          <PointerLockControls />   {/* 마우스로 시점 회전 */}

          <primitive object={new THREE.AxesHelper(3)} position={[-26, 1, 15]} />
          <primitive object={new THREE.GridHelper(10, 10)} position={[-26, 0, 15]} />
          {/* 물리 엔진 적용 영역 */}
          {/* 중력 및 충돌 적용 */}
          <Physics gravity={[0, -9.81, 0]}>
            <RigidBody type="fixed" colliders="cuboid">
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
              </mesh>
            </RigidBody>

            <GalleryModel scale={2} />
            <Player />
            <Painting position={[-5, 2, 3.01]} imageUrl="/art1.png" title="작품 1" />
            <Painting position={[0, 2, 3.01]} imageUrl="/art2.jpeg" title="작품 2" />
            <Painting position={[5, 2, 3.01]} imageUrl="/art3.jpeg" title="작품 3" />
          </Physics>
        </Canvas>

        <div className="walk-guide">🧍 마우스 클릭 후 → WASD 걷기 가능</div>
      </div>

      <p className="gallery-description">
        실제 박물관처럼 캐릭터를 이동하여, 생동감있게 전시를 관람하세요.
      </p>
    </div>
  )
}

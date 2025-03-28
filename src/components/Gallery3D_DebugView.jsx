import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// ✅ 모델 컴포넌트
function GalleryModel({ scale = 1, position = [0, 0, 0] }) {
  const { scene } = useGLTF('/models/vr_art_gallery_01.glb')

  console.log('📦 GLB Scene:', scene)
  scene.traverse((obj) => {
    if (obj.isMesh) {
      console.log('🎯 Mesh:', obj.name)
      obj.castShadow = true
      obj.receiveShadow = true
      obj.material.wireframe = false
    }
  })

  return <primitive object={scene} scale={scale} position={position} />
}

// ✅ 디버깅용 전체 씬
export default function Gallery3D_DebugView() {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ fov: 45, position: [0, 200, 200] }}>
        {/* 조명 */}
        <ambientLight intensity={1} />
        <directionalLight position={[100, 200, 100]} intensity={2} castShadow />

        {/* 카메라 제어 */}
        <OrbitControls />

        {/* 축 및 바닥 기준 */}
        <primitive object={new THREE.AxesHelper(20)} />
        <primitive object={new THREE.GridHelper(200, 40)} />

        {/* GLB 모델 삽입 */}
        <Suspense fallback={null}>
          <GalleryModel scale={50} position={[0, 0, 0]} />
        </Suspense>
      </Canvas>

      {/* 안내 문구 */}
      <div className="absolute top-2 left-2 z-50 text-white bg-black/70 px-4 py-2 rounded text-sm">
        🧠 모델 scale 조정 및 시야 확인<br />
        현재 <strong>scale=1</strong>, position [0,0,0] 기준
      </div>
    </div>
  )
}

import React, { Suspense, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

export function ImportedGallery({ position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/models/vr_art_gallery_01.glb')

  useEffect(() => {
    console.log('✅ GLB 모델 로딩 완료:', scene)
  }, [scene])

  return (
    <Suspense fallback={null}>
      <primitive object={scene} position={position} scale={scale} />
    </Suspense>
  )
}

import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'

export function ImportedGallery({ position = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/models/vr_art_gallery_01.glb')

  return (
    <Suspense fallback={null}>
      <primitive object={scene} position={position} scale={scale} />
    </Suspense>
  )
}

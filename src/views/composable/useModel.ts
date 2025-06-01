import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let loadedModel = null

export const useModel = (scene: THREE.Scene) => {
  const loadModel = (model: { path: string; scale: number }) => {
    if (loadedModel) scene.remove(loadedModel) // 移除當前模型
    const loader = new GLTFLoader()
    loader.load(model.path, (gltf) => {
      loadedModel = gltf.scene
      loadedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      const scale = model.scale || 1 // Default scale if not specified
      loadedModel.scale.set(scale, scale, scale) // Scale the model (x, y, z)
      loadedModel.position.set(0, 0, 0) // Adjust position as needed
      scene.add(loadedModel)
    })
  }

  return { loadModel }
}

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Ref } from 'vue'

/**
 * 建立相機視角及控制器
 *
 * @param scene
 * @param renderer
 * @param container
 * @returns { camera: THREE.PerspectiveCamera, cameraControl: OrbitControls }
 */

export const useCamera = (scene: THREE.Scene, renderer: THREE.WebGLRenderer, container: Ref) => {
  //   const camera = new THREE.OrthographicCamera(-30, 30, 30, -30, 0.1, 1000) // 正交投影
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000) // 透視投影
  camera.position.set(30, 30, 30)
  camera.lookAt(scene.position)

  // 支援滑鼠拖動移動相機視角
  const cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.enableDamping = true
  cameraControl.dampingFactor = 0.25

  container.value.appendChild(renderer.domElement)

  return { camera, cameraControl }
}

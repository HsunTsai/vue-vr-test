import * as THREE from 'three'

/**
 * 建立地板
 * @param scene - THREE.Scene 實例
 * @param isGrid - 是否使用網格地板
 */

export const usePlane = (scene: THREE.Scene, plain: boolean) => {
  // 網格地板
  const gridHelper = new THREE.GridHelper(1000, 200, 0x333333, 0x333333) // 1000x1000 的地面，分成 200x200 的格子
  gridHelper.position.y = -0.01
  scene.add(gridHelper)

  if (plain) {
    // 實心地板
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1) // 100x100 的地面
    // const material = new THREE.MeshLambertMaterial({ color: 0x222222 })
    const material = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide }) // 雙面材質
    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = 0
    scene.add(plane)
  }
}

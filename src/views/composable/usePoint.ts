import * as THREE from 'three'

/**
 * 建立粒子系統 (雪)
 * @param {number} particleCount - 粒子數量
 * @param {THREE.Scene} scene - THREE.js 場景對象
 * @returns {THREE.Points} - 返回一個包含粒子的 THREE.Points 對象
 */
export const usePoint = (particleCount: number = 200, scene: THREE.Scene) => {
  const geometry = new THREE.BufferGeometry()

  const texture = new THREE.TextureLoader().load('/assets/snowflake.png')
  const material = new THREE.PointsMaterial({
    size: 2,
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.7,
  })

  const range = 50
  const positions = []
  const velocities = []

  for (let i = 0; i < particleCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(range)
    const y = THREE.MathUtils.randFloatSpread(range)
    const z = THREE.MathUtils.randFloatSpread(range)
    positions.push(x, y, z)

    // Store velocity for each particle
    velocities.push(
      THREE.MathUtils.randFloat(-0.16, 0.16), // velocityX
      THREE.MathUtils.randFloat(0.1, 0.3), // velocityY
      0, // velocityZ
    )
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const pointsAnimation = () => {
    const positions = points.geometry.attributes.position.array
    const velocities = points.geometry.attributes.velocity.array

    for (let i = 0; i < particleCount; i++) {
      const index = i * 3 // 每個粒子有 x, y, z 三個值

      // 更新粒子位置
      positions[index] -= velocities[index] // x 軸
      positions[index + 1] -= velocities[index + 1] // y 軸

      // 當粒子到達地面時
      if (positions[index + 1] <= 0) {
        positions[index + 1] = 100 // 重置粒子到頂部
      }
    }

    // 告訴渲染器需要更新頂點數據
    points.geometry.attributes.position.needsUpdate = true
  }

  return { pointsAnimation }
}

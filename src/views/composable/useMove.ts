import * as THREE from 'three'

export const useMove = (renderer: THREE.WebGLRenderer, camera: THREE.Camera) => {
  // 設定滑鼠控制變數
  let isDragging = false
  let prevMouseX = 0
  let prevMouseY = 0
  let lon = 0,
    lat = 0

  // 監聽滑鼠事件
  function onMouseDown(event) {
    isDragging = true
    prevMouseX = event.clientX
    prevMouseY = event.clientY
  }

  function onMouseMove(event) {
    if (!isDragging) return
    const deltaX = event.clientX - prevMouseX
    const deltaY = event.clientY - prevMouseY

    lon -= deltaX * 0.1
    lat = Math.max(-85, Math.min(85, lat - deltaY * 0.1)) // 限制仰角範圍

    prevMouseX = event.clientX
    prevMouseY = event.clientY
  }

  function onMouseUp() {
    isDragging = false
  }

  // 更新攝影機角度
  function moveUpdateCamera() {
    const phi = THREE.MathUtils.degToRad(90 - lat)
    const theta = THREE.MathUtils.degToRad(lon)
    camera.position.x = Math.sin(phi) * Math.cos(theta)
    camera.position.y = Math.cos(phi)
    camera.position.z = Math.sin(phi) * Math.sin(theta)
    camera.lookAt(0, 0, 0)
  }

  // 監聽滑鼠事件
  renderer.domElement.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  return { moveUpdateCamera }
}

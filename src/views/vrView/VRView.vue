<template>
  <div ref="container" class="scene-container">
    <div id="stats" class="stats-panel"></div>
    <div id="blocker">
      <div id="instructions" ref="instructions" @click="lockPointer">
        <span style="font-size: 40px">點擊開始</span>
        <br />
        (W, A, S, D = 控制方向, SPACE = 跳躍, MOUSE = 轉動視角)
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import * as dat from 'dat.gui'
import { usePoint } from '../composable/usePoint'
import { useModel } from '../composable/useModel'
import { useLight } from '../composable/useLight'

import '../common.scss'

const container = ref(null)

let renderer, scene, camera
let cameraControl, stats, gui
const particleCount = 200 // 粒子數量
let pointsAnimation

let controls
let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  canJump = false
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()
let prevTime = performance.now()

function initStats() {
  const stats = new Stats()
  stats.showPanel(0)
  document.getElementById('stats').appendChild(stats.dom)
  return stats
}

function onKeyDown(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true
      break
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true
      break
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true
      break
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true
      break
    case 'Space':
      if (canJump) velocity.y += 10
      canJump = false
      break
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false
      break
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false
      break
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false
      break
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false
      break
  }
}

document.addEventListener('keydown', onKeyDown)
document.addEventListener('keyup', onKeyUp)

function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(20, 0, 20)
  camera.lookAt(scene.position)

  stats = initStats()

  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  container.value.appendChild(renderer.domElement)

  cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.enableDamping = true
  cameraControl.dampingFactor = 0.25

  // 初始化 PointerLockControls
  controls = new PointerLockControls(camera, document.body)
  controls.pointerSpeed = 0.2
  scene.add(controls.getObject())

  // 鼠標鎖定邏輯
  const blocker = document.getElementById('blocker')
  const instructions = document.getElementById('instructions')

  instructions.addEventListener('click', () => {
    controls.lock()
  })

  controls.addEventListener('lock', () => {
    blocker.style.display = 'none'
  })

  controls.addEventListener('unlock', () => {
    blocker.style.display = 'block'
  })

  // const geometry = new THREE.PlaneGeometry(100, 100, 99, 99) // 100x100 的地面，分成 99x99 的網格
  // const material = new THREE.MeshLambertMaterial({ color: 0x333333 })
  // snowGround = new THREE.Mesh(geometry, material)
  // snowGround.rotation.x = -Math.PI / 2
  // snowGround.position.y = -7
  // scene.add(snowGround)

  const gridHelper = new THREE.GridHelper(1000, 300, 0x333333, 0x333333) // 大小為 100，分成 10x10 的網格
  gridHelper.position.y = -0.01
  scene.add(gridHelper)

  const { pointsAnimation: _pointsAnimation } = usePoint(particleCount, scene) // 建立粒子系統
  pointsAnimation = _pointsAnimation

  // 導入光源
  const { datGUIControls, pointLight, pointLightHelper, hemisphereLight, hemisphereLightHelper } =
    useLight(scene, { HemisphereLight: true, PointLight: true })

  // 加入控制器調整參數
  gui = new dat.GUI()
  gui.add(datGUIControls, 'HemisphereLight').onChange((v) => {
    hemisphereLight.visible = v
    hemisphereLightHelper.visible = v
  })
  gui.add(datGUIControls, 'PointLight').onChange((v) => {
    pointLight.visible = v
    pointLightHelper.visible = v
  })

  // 模型列表
  const models = {
    building: { path: '/model/building.glb', scale: 3 }, // 辦公室模型
  }

  const { loadModel } = useModel(scene) // 導入模型

  // 初始化模型
  loadModel(models.building)

  // 添加模型選擇器到 GUI
  gui.add({ model: 'building' }, 'model', Object.keys(models)).onChange((modelKey) => {
    loadModel(models[modelKey])
  })
}

function animate() {
  pointsAnimation()
  stats.update()
  // cameraControl.update()

  const time = performance.now()
  const delta = (time - prevTime) / 1000

  velocity.x -= velocity.x * 10.0 * delta
  velocity.z -= velocity.z * 10.0 * delta
  velocity.y -= 9.8 * 10.0 * delta // 重力

  direction.z = Number(moveForward) - Number(moveBackward)
  direction.x = Number(moveLeft) - Number(moveRight)
  direction.normalize() // 保持方向向量的長度為 1

  if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
  if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

  controls.moveRight(velocity.x * delta)
  controls.moveForward(-velocity.z * delta)

  controls.object.position.y += velocity.y * delta // 更新 y 軸位置

  if (controls.object.position.y < 10) {
    velocity.y = 0
    controls.object.position.y = 10
    canJump = true
  }

  prevTime = time

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const instructions = ref(null)

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  gui.destroy()
})
</script>

<style lang="scss">
#blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

#instructions {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: box;
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  box-orient: horizontal;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  box-pack: center;
  -webkit-box-align: center;
  -moz-box-align: center;
  box-align: center;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
}
</style>

<template>
  <div ref="container" class="scene-container">
    <div id="stats" class="stats-panel"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import { usePlane } from '../composable/usePlane'
import { useLight } from '../composable/useLight'
import { useCamera } from '../composable/useCamera'
import { useModel } from '../composable/useModel'

import '../common.scss'
import { usePoint } from '../composable/usePoint'

const container = ref(null)

let renderer, scene, camera
let cameraControl, stats, gui
// points
const particleCount = 200
let pointsAnimation

function init() {
  // 初始化效能監視器
  stats = new Stats()
  stats.showPanel(0)
  document.getElementById('stats').appendChild(stats.dom)

  // 初始化場景
  scene = new THREE.Scene()

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // 導入相機及控制器
  const { camera: _camera, cameraControl: _cameraControl } = useCamera(scene, renderer, container)
  camera = _camera
  cameraControl = _cameraControl

  // 導入地板
  usePlane(scene, true)

  // 建立粒子系統
  const { pointsAnimation: _pointsAnimation } = usePoint(particleCount, scene)
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
  cameraControl.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

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

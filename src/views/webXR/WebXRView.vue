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
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { usePlane } from '../composable/usePlane'
import { useLight } from '../composable/useLight'
import { useCamera } from '../composable/useCamera'
import { useModel } from '../composable/useModel'

import '../common.scss'

const container = ref(null)

let renderer, scene, camera
let cameraControl, stats, gui

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
  renderer.xr.enabled = true // 啟用 WebXR 支援

  document.body.appendChild(VRButton.createButton(renderer))

  // 導入相機及控制器
  const { camera: _camera, cameraControl: _cameraControl } = useCamera(scene, renderer, container)
  camera = _camera
  cameraControl = _cameraControl

  // 導入地板
  usePlane(scene, true)

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
  stats.update()
  cameraControl.update()
  // 使用 WebXR 的相機進行渲染
  renderer.setAnimationLoop(() => {
    renderer.render(scene, renderer.xr.getCamera(camera))
  })
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

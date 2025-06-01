<template>
  <div ref="container" class="scene-container">
    <div id="stats" class="stats-panel"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import * as dat from 'dat.gui'
import { useCamera } from '../composable/useCamera'
import { usePlane } from '../composable/usePlane'
import { useLight } from '../composable/useLight'
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

  // 導入相機及控制器
  const { camera: _camera, cameraControl: _cameraControl } = useCamera(scene, renderer, container)
  camera = _camera
  cameraControl = _cameraControl

  // 導入地板
  usePlane(scene, true)

  // 導入光源
  const {
    datGUIControls,
    ambientLight,
    pointLight,
    pointLightHelper,
    spotLight,
    spotLightHelper,
    directionalLight,
    directionalLightHelper,
    hemisphereLight,
    hemisphereLightHelper,
  } = useLight(scene, { HemisphereLight: true, PointLight: true })

  // 加入控制器調整參數
  gui = new dat.GUI()
  gui.add(camera, 'near', 0.01, 1).onChange(() => {
    camera.updateProjectionMatrix() // 更新投影矩陣
  })
  gui.add(camera, 'far', 500, 2000).onChange(() => {
    camera.updateProjectionMatrix() // 更新投影矩陣
  })
  gui.add(datGUIControls, 'AmbientLight').onChange((v) => (ambientLight.visible = v))
  gui.add(datGUIControls, 'HemisphereLight').onChange((v) => {
    hemisphereLight.visible = v
    hemisphereLightHelper.visible = v
  })
  gui.add(datGUIControls, 'PointLight').onChange((v) => {
    pointLight.visible = v
    pointLightHelper.visible = v
  })
  gui.add(datGUIControls, 'Spotlight').onChange((v) => {
    spotLight.visible = v
    spotLightHelper.visible = v
  })
  gui.add(datGUIControls, 'DirectionalLight').onChange((v) => {
    directionalLight.visible = v
    directionalLightHelper.visible = v
  })

  const { loadModel } = useModel(scene) // 導入模型

  // 模型列表
  let focusModel = 'building'
  const models = {
    building: { path: '/model/building.glb', scale: 3, lightRange: 20 }, // 辦公室模型
  }

  // 初始化模型
  loadModel(models[focusModel])

  // 添加模型選擇器到 GUI
  gui.add({ model: focusModel }, 'model', Object.keys(models)).onChange((modelKey) => {
    focusModel = modelKey
    loadModel(models[focusModel])
  })
}

function animate() {
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

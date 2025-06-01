import * as THREE from 'three'

type DatGUI = {
  AmbientLight?: boolean
  HemisphereLight?: boolean
  PointLight?: boolean
  Spotlight?: boolean
  DirectionalLight?: boolean
}

const defaultdatGUIControls = {
  AmbientLight: false,
  HemisphereLight: false,
  PointLight: false,
  Spotlight: false,
  DirectionalLight: false,
}

export const useLight = (scene: THREE.Scene, _datGUIControls: DatGUI = {}) => {
  const datGUIControls = { ...defaultdatGUIControls, ..._datGUIControls }

  // 環境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
  ambientLight.visible = datGUIControls.AmbientLight ?? false
  scene.add(ambientLight)

  // 半球光
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 2.5)
  hemisphereLight.visible = datGUIControls.HemisphereLight ?? false
  hemisphereLight.position.set(0, 25, 0)
  scene.add(hemisphereLight)
  const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1)
  scene.add(hemisphereLightHelper)
  hemisphereLightHelper.visible = datGUIControls.HemisphereLight ?? false

  // 點光源
  const pointLight = new THREE.PointLight(0xffffff, 5)
  pointLight.castShadow = true
  pointLight.decay = 0.1
  pointLight.position.set(-10, 20, 20)
  pointLight.shadow.bias = -0.001 // 避免產生陰影線條 (避免陰影貼圖與物件表面重疊造成的 z-fighting)
  scene.add(pointLight)
  const pointLightHelper = new THREE.PointLightHelper(pointLight)
  scene.add(pointLightHelper)
  pointLight.visible = datGUIControls.PointLight ?? false
  pointLightHelper.visible = datGUIControls.PointLight ?? false
  // const shadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera) // 陰影範圍輔助線
  // scene.add(shadowCameraHelper)

  // 聚光燈
  const spotLight = new THREE.SpotLight(0xffffff, 2.5)
  spotLight.castShadow = true
  spotLight.decay = 0.1
  spotLight.position.set(-10, 20, 20)
  spotLight.shadow.bias = -0.001 // 避免產生陰影線條 (避免陰影貼圖與物件表面重疊造成的 z-fighting)
  scene.add(spotLight)
  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)
  spotLight.visible = datGUIControls.Spotlight ?? false
  spotLightHelper.visible = datGUIControls.Spotlight ?? false
  // const shadowCameraHelper = new THREE.CameraHelper(spotLightHelper.shadow.camera) // 陰影範圍輔助線
  // scene.add(shadowCameraHelper)

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
  directionalLight.castShadow = true
  directionalLight.position.set(-10, 20, 20)
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50
  directionalLight.shadow.bias = -0.001 // 避免產生陰影線條 (避免陰影貼圖與物件表面重疊造成的 z-fighting)
  scene.add(directionalLight)
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
  scene.add(directionalLightHelper)
  directionalLight.visible = datGUIControls.DirectionalLight ?? false
  directionalLightHelper.visible = datGUIControls.DirectionalLight ?? false
  // const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera) // 陰影範圍輔助線
  // scene.add(shadowCameraHelper)

  return {
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
  }
}

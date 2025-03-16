<template>
    <div style="width: 100%; height: 100%">
        <div class="container" ref="container" style="width: 100%; height: 100%"></div>
        <canvas class="previewCanvas" ref="previewCanvas" style=" width: 100%; height: 100%"></canvas>
    </div>
</template>


<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

const container = ref(null);
const previewCanvas = ref(null);

onMounted(() => {
    // 建立場景、攝影機和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 2); // 設定攝影機位置（符合VR視角）

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // 啟用VR模式
    container.value.appendChild(renderer.domElement);

    // 建立WebGLRenderTarget來儲存VR畫面
    const renderTarget = new THREE.WebGLRenderTarget(512, 512);
    const previewRenderer = new THREE.WebGLRenderer({ canvas: previewCanvas.value });

    // 建立地板
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // 建立光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // 建立立方體
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 1, -3);
    scene.add(cube);

    // 設定VR控制器
    const controller = renderer.xr.getController(0);
    scene.add(controller);

    // 渲染動畫
    function animate() {
        renderer.setRenderTarget(renderTarget);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null); // 恢復預設渲染

        // 更新預覽畫面
        previewRenderer.render(scene, camera);

        cube.rotation.y += 0.01;
        renderer.setAnimationLoop(animate);
    }

    animate();

    // 啟動VR按鈕
    // document.body.appendChild(THREE.XRButton.createButton(renderer));
});
</script>

<style scoped lang="scss">
.container {
    // background: red;
}
</style>
<template>
    <div ref="container" class="panorama-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Vue ref
const container = ref(null);

onMounted(() => {
    let scene, camera, renderer, controls;

    // 1️⃣ 建立場景
    scene = new THREE.Scene();

    // 2️⃣ 建立相機（FOV 75°）
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 2); // 調整相機高度

    // 3️⃣ 建立渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.value.appendChild(renderer.domElement);

    // 4️⃣ 載入全景背景（Equirectangular）
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/taipei_tech.jpg", (texture) => {
        const geometry = new THREE.SphereGeometry(10, 32, 32);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    });

    // 5️⃣ 建立儀表板（半透明 UI 面板）
    const panelGeometry = new THREE.PlaneGeometry(2, 1);
    const panelMaterial = new THREE.MeshBasicMaterial({
        color: 0x222222,
        opacity: 0.8,
        transparent: true,
    });
    const dashboard = new THREE.Mesh(panelGeometry, panelMaterial);
    dashboard.position.set(0, 1.5, -2); // UI 面板位置
    scene.add(dashboard);

    // 6️⃣ 加入文字或數據（CanvasTexture 渲染）
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 256;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Dashboard Data", 150, 100);
    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });
    const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.6), textMaterial);
    textMesh.position.set(0, 1.5, -1.99);
    scene.add(textMesh);

    // 7️⃣ 加入控制（滑鼠縮放/旋轉）
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;

    // 8️⃣ 窗口大小變化時調整
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});
</script>

<style scoped>
.panorama-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
Ｆ
<template>
    <div ref="container" class="scene-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { useMove } from "./composable/useMove";

const container = ref(null);

onMounted(() => {


    // 建立場景
    const scene = new THREE.Scene();
    // 建立攝影機
    const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // 初始位置略微前進避免視角錯誤


    // 建立渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setAnimationLoop(animate);
    container.value.appendChild(renderer.domElement);

    // 使用滑鼠移動角度
    const { moveUpdateCamera } = useMove(renderer, camera);

    // 載入 360° 全景貼圖
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("./taipei_tech.jpg", (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40); // 建立球體
        geometry.scale(-1, 1, 1); // 反轉法線，讓內部可見
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    });

    // 渲染動畫
    function animate() {
        moveUpdateCamera();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
</script>

<style scoped>
.scene-container {
    width: 100%;
    height: 100%;
}
</style>

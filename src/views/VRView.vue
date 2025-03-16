<template>
    <div class="vr-view">
        <div class="vr-view__three">
            <div ref="container"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";

const container = ref(null);

onMounted(() => {
    // 建立場景
    const scene = new THREE.Scene();

    // 建立攝影機
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // 初始位置略微前進避免視角錯誤

    // 建立渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.value.appendChild(renderer.domElement);

    // 載入 360° 全景貼圖
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("./photo.jpg", (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40); // 建立球體
        geometry.scale(-1, 1, 1); // 反轉法線，讓內部可見
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    });

    // 設定滑鼠控制變數
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let lon = 0, lat = 0;

    // 監聽滑鼠事件
    function onMouseDown(event) {
        isDragging = true;
        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function onMouseMove(event) {
        if (!isDragging) return;
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        lon -= deltaX * 0.1;
        lat = Math.max(-85, Math.min(85, lat - deltaY * 0.1)); // 限制仰角範圍

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function onMouseUp() {
        isDragging = false;
    }

    // 更新攝影機角度
    function updateCamera() {
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon);

        camera.position.x = Math.sin(phi) * Math.cos(theta);
        camera.position.y = Math.cos(phi);
        camera.position.z = Math.sin(phi) * Math.sin(theta);
        camera.lookAt(0, 0, 0);
    }

    // 渲染動畫
    function animate() {
        updateCamera();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    // 監聽滑鼠事件
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
});
</script>

<style scoped lang="scss">
.vr-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &__three {
        overflow: hidden;
        width: 80%;
        height: 80%;
    }
}
</style>
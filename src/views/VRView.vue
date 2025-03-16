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
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { useMove } from "./composable/useMove";

const container = ref(null);

onMounted(() => {
    // 建立場景
    const scene = new THREE.Scene();

    // 建立攝影機
    const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // 初始位置略微前進避免視角錯誤

    // 建立渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // 設置更高的解析度
    container.value.appendChild(renderer.domElement);

    // 載入 360° 全景貼圖
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("./taipei_tech.jpg", (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40); // 建立球體
        geometry.scale(-1, 1, 1); // 反轉法線，讓內部可見
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    });


    // 新增一個圓球
    // const sphereGeometry = new THREE.SphereGeometry(4, 32, 32); // 半徑為5，32段
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0087dc }); // 紅色材質
    // const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphereMesh.position.set(0, 0, -30); // 設置球的位置
    // scene.add(sphereMesh);

    // 3. 創建 3D 物件
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 2. 添加 CSS2DRenderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none'; // 確保不影響滑鼠事件
    document.body.appendChild(labelRenderer.domElement);

    const div = document.createElement('div');
    div.className = 'css-label';
    div.innerHTML = '🎉 動畫標籤';
    document.body.appendChild(div);
    //  設置 CSS 樣式與動畫
    const style = document.createElement('style');
    style.innerHTML = `
    .css-label {
        background: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        color: black;
        animation: fadeInOut 2s infinite alternate;
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: scale(1); }
        100% { opacity: 1; transform: scale(1.2); }
    }
`;
    document.head.appendChild(style);
    const label = new CSS2DObject(div);
    label.position.set(0, 0.6, 0); // 調整標籤的位置
    sphere.add(label); // 附加到球體

    const { moveUpdateCamera } = useMove(renderer, camera);

    // 渲染動畫
    function animate() {
        moveUpdateCamera();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera); // 渲染 CSS2DRenderer
        requestAnimationFrame(animate);
    }

    animate();
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
        width: calc(100% - 6rem);
        height: calc(100% - 6rem);
    }
}
</style>
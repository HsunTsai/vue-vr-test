<template>
    <div ref="container" class="scene-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';
import { useMove } from "./composable/useMove";

const container = ref(null);

onMounted(() => {

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(animate);
    container.value.appendChild(renderer.domElement);

    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    const effect = new AnaglyphEffect(renderer);
    effect.setSize(width, height);

    // 載入 360° 全景貼圖
    const textureLoader = new THREE.TextureLoader();
    // const texture = 
    textureLoader.load("./taipei_tech.jpg", (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40); // 建立球體
        geometry.scale(-1, 1, 1); // 反轉法線，讓內部可見
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    });

    // 1. 建立場景與相機
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);


    // const spheres = [];
    // const geometry = new THREE.SphereGeometry(0.1, 32, 16);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: texture });
    // for (let i = 0; i < 30; i++) {
    //     const mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = Math.random() * 10 - 5;
    //     mesh.position.y = Math.random() * 10 - 5;
    //     mesh.position.z = Math.random() * 10 - 5;
    //     mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
    //     scene.add(mesh);
    //     spheres.push(mesh);
    // }

    const { moveUpdateCamera } = useMove(renderer, camera);

    // 渲染動畫
    function animate() {
        moveUpdateCamera();

        renderer.render(scene, camera);

        // const timer = 0.0001 * Date.now();
        // for (let i = 0, il = spheres.length; i < il; i++) {
        //     const sphere = spheres[i];
        //     sphere.position.x = 5 * Math.cos(timer + i);
        //     sphere.position.y = 5 * Math.sin(timer + i * 1.1);
        // }
        // effect.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
</script>

<style scoped>
.scene-container {
    width: 100vw;
    height: 100vh;
    position: relative;
}
</style>

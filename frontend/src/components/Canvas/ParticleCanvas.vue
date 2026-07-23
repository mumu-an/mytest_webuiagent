<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
    const canvas = canvasRef.value!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // 粒子
    const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.6 + 0.2,
        drift: Math.random() * 0.3 - 0.15
    }));

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const p of particles) {
            p.y += p.speed;
            p.x += p.drift;

            if (p.y > window.innerHeight) {
                p.y = -5;
                p.x = Math.random() * window.innerWidth;
            }

            ctx.beginPath();            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(draw);
    };

    draw();
});
</script>
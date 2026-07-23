<template>
  <div class="layout">

    <!-- 🌌 氛围层（可选） -->
    <div class="ambient-layer">
      <ParticleCanvas/>
    </div>

    <!-- 🧱 顶部 -->
    <Header/>

    <!-- 🧱 主区域 -->
    <main class="scene">

      <!-- 左侧 -->
      <section class="scene-left">
        Live2D
      </section>

      <!-- 右侧整体容器 -->
      <section class="scene-right">

        <ChatPanel ref="chatRef" :messages="messages" :typing="isStreaming"/>
        <ChatInput
          :isStreaming="isStreaming"
          @send="handleSend"
          @stop="handleStop"
        />

      </section>

    </main>

  </div>
</template>

<script setup lang="ts">
import Header from "../components/Header/Header.vue"
import ChatPanel from "../components/Chat/ChatPanel.vue"
import ChatInput from "../components/Chat/ChatInput.vue"
import ParticleCanvas from "../components/Canvas/ParticleCanvas.vue"
import {ref} from 'vue'

import {useChat} from "../composables/useChat"

const chatRef = ref<InstanceType<typeof ChatPanel> | null>(null)

const isNearBottom = () => {
  const el = chatRef.value?.$el || chatRef.value
  if (!el) return true

  return el.scrollTop + el.clientHeight >= el.scrollHeight - 100
}

const scroll = () => {
  chatRef.value?.scrollToBottom(false)
}
const {messages, isStreaming, send, stop} = useChat(scroll, isNearBottom)

const handleSend = (text: string) => {
  send(text)
}

const handleStop = () => {
  stop()
}

</script>

<style scoped>

.layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0b0f17;
  overflow: hidden;
}

.scene {
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 20px;
  z-index: 1;
  min-height: 0;
  position: relative;
}

/* 左侧 */
.scene-left {
  width: 60%;
  border-radius: 18px;

  background: rgba(20, 25, 35, 0.35);

  border: 1px solid rgba(255, 255, 255, 0.06);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* 右侧整体容器 */
.scene-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  height: 100%;
}

.ambient-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.ambient-layer canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}

</style>
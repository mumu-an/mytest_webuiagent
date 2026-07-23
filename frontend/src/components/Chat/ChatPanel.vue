<template>
  <div class="chat-panel" ref="panelRef" @scroll="onScroll">
    <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.role"
        class="message"
    >
      <div class="row">
        <div class="avatar" v-if="msg.role === 'ai'">🤖</div>

        <div class="bubble">
          <component
              :is="messageMap[msg.type]"
              v-bind="msg"
          />
        </div>

        <div class="avatar user" v-if="msg.role === 'user'">🧑</div>
      </div>
    </div>
    <div v-if="typing" class="typing-indicator">
      🤖 正在思考...
    </div>
  </div>
</template>


<script setup lang="ts">
import {watch, nextTick, ref} from "vue";
import type {ChatMessage} from '../../types/chat'
import TextMessage from './messages/TextMessage.vue'
import ImageMessage from './messages/ImageMessage.vue'
import ToolMessage from './messages/ToolMessage.vue'
import ThinkingMessage from './messages/ThinkingMessage.vue'

const messageMap = {
  text: TextMessage,
  image: ImageMessage,
  tool: ToolMessage,
  thinking: ThinkingMessage
}


const panelRef = ref<HTMLElement | null>(null);
const autoScroll = ref(true)

const isAtBottom = () => {
  const el = panelRef.value
  if (!el) return true

  return el.scrollTop + el.clientHeight >= el.scrollHeight - 80
}

const onScroll = () => {
  autoScroll.value = isAtBottom()
}

const props = defineProps<{
  messages: ChatMessage[]
  typing: boolean
}>()

const scrollToBottom = (smooth = false) => {
  const el = panelRef.value
  if (!el) return

  el.scrollTo({
    top: el.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

defineExpose({
  scrollToBottom
})

watch(
    () => props.messages.length,
    async () => {
      await nextTick()

      scrollToBottom(true)
    }
)

</script>


<style scoped>
.chat-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  background: transparent;
  border-radius: 16px;
}

/* 每一行 */
.row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  animation: fadeIn 0.2s ease;
}


/* 左右分布 */
.row.user {
  justify-content: flex-end;
}

.row.ai {
  justify-content: flex-start;
}

.chat-panel::-webkit-scrollbar {
  display: none; /* Chrome / Safari / Edge */
}

.chat-panel::-webkit-scrollbar-track {
  background: transparent;
}

.chat-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

.chat-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  font-weight: 600;

  background: rgba(20, 25, 35, 0.25);
}

.chat-body {
  flex: 1;
  padding: 20px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
  animation: fadeIn 0.2s ease;
}

.message.user .row {
  justify-content: flex-end;
}

.message.ai .row {
  justify-content: flex-start;
}

.user {
  justify-content: flex-end;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  margin-top: 12px;
  background: linear-gradient(135deg, #4c6fff, #7c4dff);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 10px 20px rgba(76, 111, 255, 0.25);
}

.bubble {
  max-width: 70%;
  width: fit-content;
  display: inline-block;

  padding: 12px 16px;
  border-radius: 16px;
  color: white;
  line-height: 1.5;

  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}


.user .avatar {
  background: rgba(26, 31, 42, 0.3);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-indicator {
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-style: italic;
}


.message-image {
  max-width: 320px;
  border-radius: 12px;
  display: block;
}


</style>
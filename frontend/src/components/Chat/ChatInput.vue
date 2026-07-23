<template>
  <div class="chat-input">

    <button class="tool-btn">
      😊
    </button>

    <textarea
        ref="textareaRef"
        v-model="input"
        placeholder="请输入消息..."
        @input="autoResize"
        @keydown="handleKeydown"
    />

    <button
        class="send-btn"
        @click="props.isStreaming ? emit('stop') : sendMessage()"
        :disabled="!input.trim() && !props.isStreaming"
    >
      {{ props.isStreaming ? '停止' : '发送' }}
    </button>

  </div>
</template>

<script setup lang="ts">


import {ref, nextTick} from "vue";

const props = defineProps<{
  isStreaming: boolean
}>()

const input = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const autoResize = () => {
  const el = textareaRef.value;
  if (!el) return;

  el.style.height = "auto";
  const maxHeight = 100;
  const scrollHeight = el.scrollHeight;
  el.style.height = Math.min(scrollHeight, maxHeight) + "px";
};

const emit = defineEmits(["send", 'stop']);

const sendMessage = () => {
  const text = input.value.trim();
  if (!text) return;

  emit("send", text);

  input.value = "";

  nextTick(() => {
    autoResize();
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.isComposing) return;

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};


</script>

<style scoped>

.chat-input {
  border-radius: 16px;

  display: flex;
  align-items: center;
  gap: 16px;

  padding: 0 20px;

  flex-shrink: 0; /* 🔥关键 */

}


textarea {
  flex: 1;

  height: 52px;
  max-height: 160px;

  resize: none;
  overflow-y: auto;

  outline: none;
  border: none;

  border-radius: 14px;
  padding: 14px;

  background: rgba(26, 31, 42, 0.3);
  color: white;
  font-size: 15px;

  scrollbar-width: none; /* Firefox */

}

textarea::placeholder {
  color: #7a8296;
}

.tool-btn {
  width: 44px;

  height: 44px;

  border: none;

  border-radius: 12px;

  background: rgba(26, 31, 42, 0.3);

  color: white;

  cursor: pointer;
}

.send-btn {

  width: 90px;

  height: 46px;

  border: none;

  border-radius: 14px;

  background: #4C6FFF;

  color: white;

  cursor: pointer;

  font-size: 15px;

  font-weight: 600;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:hover {
  background: #6885ff;
}

.tool-btn:hover {
  background: #30384d;
}

</style>
<template>
  <PlainText v-if="role === 'user'" :text="text" />
  <MarkdownMessage v-else :text="text" />
</template>

<script setup lang="ts">
import MarkdownMessage from '../MarkdownMessage.vue'
import PlainText from './PlainText.vue'

defineProps<{
  text: string
  role: 'user' | 'ai'
}>()

</script>
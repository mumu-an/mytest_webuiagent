<template>
  <img
      :src="url"
      class="message-image"
      alt="AI image"
  />
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>()
</script>

<style scoped>
.message-image {
  max-width: 360px;
  border-radius: 12px;
  display: block;
}
</style>
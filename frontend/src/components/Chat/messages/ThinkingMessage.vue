<template>
  <div class="thinking">
    🤔 {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
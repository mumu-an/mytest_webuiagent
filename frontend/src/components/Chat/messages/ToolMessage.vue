<template>
  <div class="tool">
    🔧 {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
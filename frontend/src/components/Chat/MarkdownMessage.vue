<template>
  <div
      class="markdown-body"
      v-html="html"
  />
</template>

<script setup lang="ts">
import {computed, onMounted} from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<{
  text: string
}>()

const md = new MarkdownIt({
  html: false,
  breaks: true,

  highlight(code, lang) {
    const validLang = lang && hljs.getLanguage(lang)

    const highlighted = validLang
        ? hljs.highlight(code, {language: lang}).value
        : hljs.highlightAuto(code).value

    return `
<div class="code-block">
  <div class="code-header">
    <span class="lang">${lang || 'code'}</span>
    <button class="copy-btn" data-code="${encodeURIComponent(code)}">📋</button>
  </div>
  <pre><code class="hljs ${lang || ''}">${highlighted}</code></pre>
</div>
`
  }
})

onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    if (target.classList.contains('copy-btn')) {
      const code = decodeURIComponent(target.dataset.code || '')
      navigator.clipboard.writeText(code)
    }
  })
})

const html = computed(() => {
  return md.render(props.text)
})
</script>

<style scoped>
.markdown-body {
  line-height: 1.7;
}

.markdown-body :deep(h1) {
  font-size: 26px;
}

.markdown-body :deep(h2) {
  margin-top: 18px;
}

.markdown-body :deep(pre) {
  overflow: auto;
  border-radius: 10px;
}

.markdown-body :deep(code) {
  font-family: Consolas, Monaco, monospace;
}
.code-block {
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
  background: #0d1117;
}

.code-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  font-size: 12px;
  background: #161b22;
  color: #aaa;
}

.copy-btn {
  cursor: pointer;
  background: transparent;
  border: none;
  color: #aaa;
}

pre {
  margin: 0;
  padding: 10px;
  overflow-x: auto;
}

</style>
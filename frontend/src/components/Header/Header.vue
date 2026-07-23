<template>
  <header class="header">

    <div class="header-left">
      <div class="logo">🐞</div>
      <div class="title">
        <div class="name">Ayaka</div>
        <div class="sub-title">AI Assistant</div>
      </div>
    </div>

    <div class="header-center">
      <span class="status-dot"></span>
      <span>Online</span>
    </div>

    <div class="header-right">
      <button class="icon-btn">⚙</button>
      <button class="icon-btn">👤</button>
    </div>

  </header>
</template>

<script setup lang="ts">

</script>

<style scoped>

.header {
  height: 72px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: 0 24px;

  background: #171B24;

  border-bottom: 1px solid #2b3240;
}

.header-left {

  display: flex;

  align-items: center;

  gap: 14px;
}

.logo {

  width: 42px;

  height: 42px;

  border-radius: 10px;

  background: #4c6fff;

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 22px;
}

.title {

  display: flex;

  flex-direction: column;
}

.name {

  color: white;

  font-size: 18px;

  font-weight: 600;
}

.sub-title {

  color: #9097a7;

  font-size: 12px;
}

.header-center {

  display: flex;

  align-items: center;

  gap: 8px;

  color: white;
}

.status-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #32d74b;
}

.header-right {

  display: flex;

  gap: 10px;
}

.icon-btn {

  width: 38px;

  height: 38px;

  border: none;

  border-radius: 10px;

  cursor: pointer;

  background: #232b3d;

  color: white;

  font-size: 18px;
}

.icon-btn:hover {

  background: #30394d;
}

</style>
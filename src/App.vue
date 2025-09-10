<template>
  <div id="app">
    <MountainPathwayVisualization />
  </div>
</template>

<script setup lang="ts">
import MountainPathwayVisualization from '@/views/MountainPathwayVisualization.vue'
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
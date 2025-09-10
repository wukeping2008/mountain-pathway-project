<template>
  <div class="progress-tracker">
    <div class="tracker-header">
      <span class="tracker-title">升学进度</span>
      <span class="tracker-percentage">{{ currentProgress }}%</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: currentProgress + '%' }"
      ></div>
    </div>
    <div class="milestones-mini">
      <div 
        v-for="milestone in milestones"
        :key="milestone.id"
        class="mini-milestone"
        :class="milestone.status"
        :title="milestone.title"
      >
        <i :class="milestone.icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  milestones: any[]
  currentProgress: number
}>()
</script>

<style scoped>
.progress-tracker {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 300px;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tracker-title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.tracker-percentage {
  font-size: 14px;
  color: #667eea;
  font-weight: bold;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #9f7aea);
  transition: width 0.5s ease;
}

.milestones-mini {
  display: flex;
  justify-content: space-between;
}

.mini-milestone {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.mini-milestone.completed {
  background: #48bb78;
  color: white;
}

.mini-milestone.in-progress {
  background: #4299e1;
  color: white;
}

.mini-milestone.pending {
  background: #cbd5e0;
  color: #718096;
}

.mini-milestone:hover {
  transform: scale(1.2);
}
</style>
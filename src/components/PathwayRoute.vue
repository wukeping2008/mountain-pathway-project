<template>
  <div class="pathway-route">
    <svg class="route-svg" width="100%" height="100%">
      <path 
        :d="routePath" 
        stroke="rgba(255, 255, 255, 0.6)"
        stroke-width="3"
        fill="none"
        stroke-dasharray="10,5"
        class="route-line"
      />
    </svg>
    
    <div 
      v-for="(milestone, index) in milestones"
      :key="milestone.id"
      class="milestone-point"
      :style="getMilestonePosition(index)"
      @click="$emit('milestone-click', milestone)"
    >
      <div class="milestone-icon" :class="milestone.status">
        <i :class="milestone.icon"></i>
      </div>
      <div class="milestone-label">
        {{ milestone.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  milestones: any[]
  currentProgress: number
  targetSchool: any
}>()

defineEmits<{
  'milestone-click': [milestone: any]
}>()

const routePath = computed(() => {
  // 简单的路径绘制
  return 'M 100,500 Q 300,400 500,300 T 900,100'
})

const getMilestonePosition = (index: number) => {
  const total = props.milestones.length
  const progress = (index + 1) / (total + 1)
  
  return {
    left: `${20 + progress * 60}%`,
    bottom: `${20 + progress * 50}%`
  }
}
</script>

<style scoped>
.pathway-route {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.route-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.route-line {
  animation: dash 20s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -100;
  }
}

.milestone-point {
  position: absolute;
  pointer-events: all;
  cursor: pointer;
  transform: translate(-50%, 50%);
}

.milestone-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
}

.milestone-icon.completed {
  background: #48bb78;
  color: white;
}

.milestone-icon.in-progress {
  background: #4299e1;
  color: white;
}

.milestone-icon.pending {
  background: #e2e8f0;
  color: #718096;
}

.milestone-label {
  background: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  text-align: center;
}
</style>
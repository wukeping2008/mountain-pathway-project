<template>
  <div class="student-markers">
    <div 
      v-for="student in students"
      :key="student.id"
      class="student-marker"
      :style="getStudentPosition(student)"
    >
      <div class="student-avatar">
        {{ student.name.charAt(0) }}
      </div>
      <div class="student-name">{{ student.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  students: any[]
}>()

const getStudentPosition = (student: any) => {
  return {
    left: `${30 + student.currentProgress * 0.4}%`,
    bottom: `${15 + student.currentProgress * 0.5}%`
  }
}
</script>

<style scoped>
.student-markers {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.student-marker {
  position: absolute;
  transform: translate(-50%, 50%);
}

.student-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 3px;
}

.student-name {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 5px;
  border-radius: 3px;
  white-space: nowrap;
}
</style>
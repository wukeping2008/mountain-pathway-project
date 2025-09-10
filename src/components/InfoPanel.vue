<template>
  <div class="info-panel" v-if="selectedSchool || selectedMilestone">
    <div class="panel-header">
      <h3>详细信息</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    
    <div v-if="selectedSchool" class="school-info">
      <h4>{{ selectedSchool.name }}</h4>
      <p>{{ selectedSchool.location }}</p>
      <div class="info-row">
        <span class="label">世界排名:</span>
        <span class="value">#{{ selectedSchool.ranking?.world }}</span>
      </div>
      <div class="info-row">
        <span class="label">匹配度:</span>
        <span class="value">{{ selectedSchool.matchScore }}%</span>
      </div>
      <div class="info-row">
        <span class="label">GPA要求:</span>
        <span class="value">{{ selectedSchool.requirements?.gpa }}</span>
      </div>
      <div class="tags">
        <span v-for="tag in selectedSchool.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div v-if="statistics" class="statistics">
      <div class="stat-item">
        <span class="stat-label">成功率</span>
        <span class="stat-value">{{ statistics.successRate }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">预计时间</span>
        <span class="stat-value">{{ statistics.estimatedTime }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">难度等级</span>
        <span class="stat-value">{{ statistics.difficulty }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedSchool: any
  selectedMilestone: any
  statistics: any
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.info-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 280px;
  max-width: 350px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.school-info h4 {
  margin: 0 0 5px 0;
  color: #667eea;
}

.school-info p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.label {
  color: #666;
}

.value {
  font-weight: bold;
  color: #333;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 15px;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.statistics {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 13px;
}

.stat-value {
  font-weight: bold;
  color: #667eea;
  font-size: 14px;
}
</style>
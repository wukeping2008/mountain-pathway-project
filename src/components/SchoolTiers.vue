<template>
  <div class="school-tiers professional">
    <div 
      v-for="school in schools" 
      :key="school.id"
      class="school-marker"
      :class="[school.tier, { selected: selectedSchool?.id === school.id }]"
      :style="getSchoolPosition(school)"
      @click="$emit('select', school)"
    >
      <!-- 专业的标记设计 -->
      <div class="school-indicator">
        <!-- 垂直连接线 -->
        <div class="connection-line"></div>
        
        <!-- 主标记点 -->
        <div class="marker-point">
          <div class="point-core"></div>
          <div class="point-ring"></div>
        </div>
        
        <!-- 信息标签 -->
        <div class="school-label">
          <div class="label-header">
            <span class="school-name">{{ school.name }}</span>
            <span class="tier-badge">{{ getTierLabel(school.tier) }}</span>
          </div>
          <div class="label-stats">
            <div class="stat-item">
              <span class="stat-label">匹配度</span>
              <span class="stat-value">{{ school.matchScore }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">排名</span>
              <span class="stat-value">#{{ school.ranking?.world }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  schools: any[]
  selectedSchool: any
}>()

defineEmits<{
  select: [school: any]
}>()

const getTierLabel = (tier: string) => {
  const labels = {
    dream: '冲刺',
    match: '匹配',
    safety: '保底'
  }
  return labels[tier as keyof typeof labels] || tier
}

const getSchoolPosition = (school: any) => {
  // 根据学校的高度和tier计算位置
  const tierPositions = {
    dream: { bottom: '65%', spread: 25 },
    match: { bottom: '40%', spread: 30 },
    safety: { bottom: '20%', spread: 35 }
  }
  
  const pos = tierPositions[school.tier as keyof typeof tierPositions]
  const index = props.schools.filter(s => s.tier === school.tier).indexOf(school)
  const totalInTier = props.schools.filter(s => s.tier === school.tier).length
  
  // 计算水平分布
  const horizontalPosition = 30 + (40 / (totalInTier + 1)) * (index + 1)
  
  return {
    bottom: pos.bottom,
    left: `${horizontalPosition}%`,
    transform: `translateX(-50%)`
  }
}
</script>

<style scoped>
.school-tiers.professional {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.school-marker {
  position: absolute;
  pointer-events: all;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.school-indicator {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.connection-line {
  position: absolute;
  bottom: -100px;
  width: 1px;
  height: 100px;
  background: linear-gradient(to top, transparent, rgba(255, 255, 255, 0.2));
  pointer-events: none;
}

.marker-point {
  position: relative;
  width: 12px;
  height: 12px;
  margin-bottom: 8px;
}

.point-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.point-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.school-label {
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 14px;
  min-width: 180px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.label-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.school-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.tier-badge {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* 层级颜色 */
.school-marker.dream {
  .point-core {
    background: #dc2626;
  }
  .point-ring {
    border-color: #dc2626;
  }
  .tier-badge {
    background: rgba(220, 38, 38, 0.2);
    color: #ef4444;
    border: 1px solid rgba(220, 38, 38, 0.3);
  }
}

.school-marker.match {
  .point-core {
    background: #2563eb;
  }
  .point-ring {
    border-color: #2563eb;
  }
  .tier-badge {
    background: rgba(37, 99, 235, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(37, 99, 235, 0.3);
  }
}

.school-marker.safety {
  .point-core {
    background: #16a34a;
  }
  .point-ring {
    border-color: #16a34a;
  }
  .tier-badge {
    background: rgba(22, 163, 74, 0.2);
    color: #22c55e;
    border: 1px solid rgba(22, 163, 74, 0.3);
  }
}

/* 选中状态 */
.school-marker.selected {
  z-index: 20;
  
  .school-label {
    background: rgba(37, 99, 235, 0.1);
    border-color: rgba(37, 99, 235, 0.5);
    box-shadow: 0 0 30px rgba(37, 99, 235, 0.3);
  }
  
  .point-core {
    transform: translate(-50%, -50%) scale(1.5);
  }
}

/* 悬停效果 */
.school-marker:hover {
  z-index: 15;
  
  .school-label {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }
  
  .point-ring {
    animation-duration: 1s;
  }
}
</style>
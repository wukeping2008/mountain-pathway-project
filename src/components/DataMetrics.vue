<template>
  <div class="data-metrics professional">
    <div class="metrics-container">
      <!-- 关键指标卡片 -->
      <div class="metric-card" v-for="metric in metrics" :key="metric.id">
        <div class="metric-header">
          <svg class="metric-icon" :class="metric.trend" width="20" height="20" viewBox="0 0 20 20">
            <path v-if="metric.trend === 'up'" d="M10 4 L16 12 L13 12 L13 16 L7 16 L7 12 L4 12 Z" fill="currentColor"/>
            <path v-if="metric.trend === 'down'" d="M10 16 L16 8 L13 8 L13 4 L7 4 L7 8 L4 8 Z" fill="currentColor"/>
            <circle v-if="metric.trend === 'stable'" cx="10" cy="10" r="3" fill="currentColor"/>
          </svg>
          <span class="metric-label">{{ metric.label }}</span>
        </div>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-detail">
          <span class="metric-change" :class="metric.trend">
            {{ metric.change }}
          </span>
          <span class="metric-period">{{ metric.period }}</span>
        </div>
        <div class="metric-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: metric.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时数据流 -->
    <div class="data-stream">
      <div class="stream-header">
        <h3>申请进度追踪</h3>
        <div class="stream-controls">
          <button class="control-btn active">实时</button>
          <button class="control-btn">历史</button>
        </div>
      </div>
      <div class="stream-content">
        <div class="stream-item" v-for="item in dataStream" :key="item.id">
          <div class="stream-time">{{ item.time }}</div>
          <div class="stream-indicator" :class="item.type"></div>
          <div class="stream-info">
            <div class="stream-title">{{ item.title }}</div>
            <div class="stream-description">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  studentProfile?: any
  selectedSchool?: any
}

const props = defineProps<Props>()

// 关键指标数据
const metrics = ref([
  {
    id: 'match-rate',
    label: '整体匹配率',
    value: '78%',
    change: '+5.2%',
    period: '较上月',
    trend: 'up',
    progress: 78
  },
  {
    id: 'application-status',
    label: '申请完成度',
    value: '12/15',
    change: '3所待定',
    period: '截止日期临近',
    trend: 'stable',
    progress: 80
  },
  {
    id: 'success-rate',
    label: '预测成功率',
    value: '85%',
    change: '+2.1%',
    period: '基于历史数据',
    trend: 'up',
    progress: 85
  },
  {
    id: 'ranking-change',
    label: '排名变化',
    value: '#42',
    change: '-3',
    period: '全球排名',
    trend: 'down',
    progress: 65
  }
])

// 实时数据流
const dataStream = ref([
  {
    id: 1,
    time: '10:30',
    type: 'success',
    title: 'MIT 材料已提交',
    description: '所有申请材料已成功上传，等待审核'
  },
  {
    id: 2,
    time: '09:45',
    type: 'warning',
    title: 'UCL 推荐信提醒',
    description: '第二封推荐信需在3天内提交'
  },
  {
    id: 3,
    time: '昨天',
    type: 'info',
    title: '剑桥大学面试邀请',
    description: '恭喜！您已收到面试邀请，请查看详情'
  },
  {
    id: 4,
    time: '3天前',
    type: 'success',
    title: '托福成绩更新',
    description: '新成绩：110分，已同步到所有申请'
  }
])
</script>

<style scoped lang="scss">
.data-metrics.professional {
  // 移除旧的背景和边框样式，因为现在每个卡片都是独立的
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background-color: $card-bg-color;
  border: 1px solid $border-color;
  border-radius: $border-radius-lg;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px $shadow-color;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px $shadow-color;
  }
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.metric-icon {
  &.up { color: $success-color; }
  &.down { color: $danger-color; }
  &.stable { color: $text-light-color; }
}

.metric-label {
  font-size: 13px;
  color: $text-light-color;
  font-weight: 500;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: $text-color;
  margin-bottom: 8px;
}

.metric-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
}

.metric-change {
  font-weight: 600;
  
  &.up { color: $success-color; }
  &.down { color: $danger-color; }
  &.stable { color: $text-light-color; }
}

.metric-period {
  color: $text-light-color;
}

.metric-progress {
  margin-top: 8px;
}

.progress-bar {
  height: 5px;
  background-color: #E0E6ED;
  border-radius: 2.5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: $primary-color;
  border-radius: 2.5px;
  transition: width 0.5s ease;
}

.data-stream {
  background-color: $card-bg-color;
  border: 1px solid $border-color;
  border-radius: $border-radius-lg;
  padding: 20px;
  margin-top: 24px; // 与上方卡片组增加间距
  box-shadow: 0 4px 12px $shadow-color;
}

.stream-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $text-color;
    margin: 0;
  }
}

.stream-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid $border-color;
  border-radius: 6px;
  color: $text-light-color;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &.active {
    background-color: $primary-color;
    border-color: $primary-color;
    color: #FFFFFF;
  }
}

.stream-content {
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F4F7FA; // 使用浅灰色背景
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #DDE2E7; // 使用更深的灰色
    border-radius: 2px;
  }
}

.stream-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $border-color; // 使用新的边框颜色
  
  &:last-child {
    border-bottom: none;
  }
}

.stream-time {
  min-width: 45px;
  font-size: 12px;
  color: $text-light-color;
  text-align: right;
}

.stream-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
  
  &.success { background-color: $success-color; }
  &.warning { background-color: $warning-color; }
  &.info { background-color: $info-color; }
}

.stream-info {
  flex: 1;
}

.stream-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-color;
  margin-bottom: 4px;
}

.stream-description {
  font-size: 13px;
  color: $text-light-color;
  line-height: 1.5;
}
</style>

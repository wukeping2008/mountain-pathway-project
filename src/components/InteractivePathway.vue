<template>
  <div class="interactive-pathway">
    <!-- 路径动画层 -->
    <svg class="pathway-svg" :viewBox="`0 0 ${width} ${height}`">
      <defs>
        <!-- 渐变定义 -->
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.3"/>
        </linearGradient>
        
        <!-- 发光效果 -->
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- 主路径 -->
      <path
        v-for="path in pathways"
        :key="path.id"
        :d="path.d"
        fill="none"
        stroke="url(#pathGradient)"
        stroke-width="2"
        stroke-dasharray="5,5"
        :opacity="path.active ? 1 : 0.3"
        class="animated-path"
      >
        <animate
          v-if="path.active"
          attributeName="stroke-dashoffset"
          from="10"
          to="0"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
      
      <!-- 节点连接点 -->
      <g v-for="node in pathNodes" :key="node.id">
        <circle
          :cx="node.x"
          :cy="node.y"
          :r="node.selected ? 8 : 5"
          :fill="getNodeColor(node)"
          filter="url(#glow)"
          class="pathway-node"
          @click="selectNode(node)"
        />
        
        <!-- 节点标签 -->
        <text
          v-if="node.showLabel"
          :x="node.x"
          :y="node.y - 15"
          text-anchor="middle"
          fill="white"
          font-size="11"
          font-weight="500"
        >
          {{ node.label }}
        </text>
      </g>
      
      <!-- 进度指示器 -->
      <g v-if="currentProgress">
        <circle
          :cx="currentProgress.x"
          :cy="currentProgress.y"
          r="12"
          fill="none"
          stroke="#3b82f6"
          stroke-width="2"
          opacity="0.5"
        >
          <animate
            attributeName="r"
            from="12"
            to="20"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.5"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle
          :cx="currentProgress.x"
          :cy="currentProgress.y"
          r="6"
          fill="#3b82f6"
          class="current-position"
        />
      </g>
    </svg>
    
    <!-- 里程碑标记 -->
    <div class="milestones">
      <div 
        v-for="milestone in milestones" 
        :key="milestone.id"
        class="milestone-marker"
        :class="{ 
          'achieved': milestone.achieved,
          'current': milestone.current 
        }"
        :style="getMilestonePosition(milestone)"
        @click="showMilestoneDetail(milestone)"
      >
        <div class="milestone-icon">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path v-if="milestone.achieved" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
            <circle v-else-if="milestone.current" cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2">
              <animate attributeName="stroke-dasharray" values="0 50;50 0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle v-else cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
          </svg>
        </div>
        <div class="milestone-label">{{ milestone.label }}</div>
        <div class="milestone-date">{{ milestone.date }}</div>
      </div>
    </div>
    
    <!-- 交互提示 -->
    <transition name="tooltip">
      <div v-if="activeTooltip" class="pathway-tooltip" :style="tooltipPosition">
        <div class="tooltip-header">{{ activeTooltip.title }}</div>
        <div class="tooltip-content">{{ activeTooltip.content }}</div>
        <div class="tooltip-actions">
          <button class="action-btn">查看详情</button>
          <button class="action-btn secondary" @click="closeTooltip">关闭</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  schools: any[]
  selectedSchool: any
  studentProgress?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  nodeSelected: [node: any]
  milestoneClicked: [milestone: any]
}>()

// 画布尺寸
const width = 1200
const height = 600

// 路径数据
const pathways = ref([
  {
    id: 'main',
    d: 'M 100,500 Q 300,400 500,350 T 900,200 T 1100,100',
    active: true
  },
  {
    id: 'alternative',
    d: 'M 100,500 Q 400,450 600,400 T 1000,300',
    active: false
  }
])

// 路径节点
const pathNodes = ref([
  { id: 1, x: 100, y: 500, label: '起点', type: 'start', showLabel: true, selected: false },
  { id: 2, x: 300, y: 420, label: '基础准备', type: 'milestone', showLabel: false, selected: false },
  { id: 3, x: 500, y: 350, label: '标化考试', type: 'milestone', showLabel: true, selected: false },
  { id: 4, x: 700, y: 280, label: '学校选择', type: 'milestone', showLabel: false, selected: false },
  { id: 5, x: 900, y: 200, label: '申请提交', type: 'milestone', showLabel: true, selected: false },
  { id: 6, x: 1100, y: 100, label: '录取', type: 'end', showLabel: true, selected: false }
])

// 里程碑
const milestones = ref([
  { 
    id: 1, 
    label: 'GPA提升', 
    date: '2024.09', 
    achieved: true,
    x: 20,
    y: 80
  },
  { 
    id: 2, 
    label: 'TOEFL首考', 
    date: '2024.10', 
    achieved: true,
    x: 35,
    y: 65
  },
  { 
    id: 3, 
    label: 'SAT考试', 
    date: '2024.12', 
    current: true,
    x: 50,
    y: 50
  },
  { 
    id: 4, 
    label: '文书完成', 
    date: '2025.01', 
    achieved: false,
    x: 65,
    y: 35
  },
  { 
    id: 5, 
    label: '申请截止', 
    date: '2025.03', 
    achieved: false,
    x: 80,
    y: 20
  }
])

// 当前进度
const currentProgress = ref({
  x: 500,
  y: 350
})

// 工具提示
const activeTooltip = ref<any>(null)
const tooltipPosition = ref({ left: '0px', top: '0px' })

// 获取节点颜色
const getNodeColor = (node: any) => {
  if (node.selected) return '#3b82f6'
  switch (node.type) {
    case 'start': return '#10b981'
    case 'end': return '#f59e0b'
    case 'milestone': return '#6b7280'
    default: return '#6b7280'
  }
}

// 获取里程碑位置
const getMilestonePosition = (milestone: any) => {
  return {
    left: `${milestone.x}%`,
    top: `${milestone.y}%`
  }
}

// 选择节点
const selectNode = (node: any) => {
  pathNodes.value.forEach(n => n.selected = false)
  node.selected = true
  
  activeTooltip.value = {
    title: node.label,
    content: `这是您升学路径的重要节点。点击查看详细规划和建议。`
  }
  
  tooltipPosition.value = {
    left: `${node.x}px`,
    top: `${node.y - 100}px`
  }
  
  emit('nodeSelected', node)
}

// 显示里程碑详情
const showMilestoneDetail = (milestone: any) => {
  emit('milestoneClicked', milestone)
}

// 关闭提示
const closeTooltip = () => {
  activeTooltip.value = null
}

// 动画初始化
onMounted(() => {
  // 启动路径动画
  animateProgress()
})

// 进度动画
const animateProgress = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 0.01
    if (progress > 1) {
      clearInterval(interval)
      return
    }
    
    // 更新当前位置
    const path = pathways.value[0]
    // 简化的路径插值计算
    currentProgress.value = {
      x: 100 + progress * 1000,
      y: 500 - progress * 400
    }
  }, 50)
}
</script>

<style scoped lang="scss">
.interactive-pathway {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pathway-svg {
  width: 100%;
  height: 100%;
}

.animated-path {
  transition: all 0.3s ease;
}

.pathway-node {
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    r: 10;
    fill-opacity: 0.8;
  }
}

.current-position {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}

.milestones {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.milestone-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  
  &.achieved {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    
    .milestone-icon { color: #10b981; }
  }
  
  &.current {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    animation: current-pulse 2s ease-in-out infinite;
    
    .milestone-icon { color: #3b82f6; }
  }
}

@keyframes current-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0); }
}

.milestone-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.6);
}

.milestone-label {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
}

.milestone-date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.pathway-tooltip {
  position: absolute;
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transform: translateX(-50%);
  z-index: 1000;
}

.tooltip-header {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.tooltip-content {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 12px;
}

.tooltip-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  background: #3b82f6;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &.secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.3s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
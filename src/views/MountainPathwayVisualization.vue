<template>
  <div class="mountain-pathway-visualization professional">
    <!-- 主画布 -->
    <MountainCanvas 
      :mountain-theme="selectedMountain"
      :view-mode="viewMode"
    >
      <!-- 学校层级展示 -->
      <SchoolTiers 
        :schools="filteredSchools"
        :selected-school="selectedSchool"
        @select="handleSchoolSelect"
      />

      <!-- 交互式路径 -->
      <InteractivePathway
        :schools="filteredSchools"
        :selected-school="selectedSchool"
        :student-progress="studentProgress"
        @node-selected="handleNodeSelection"
        @milestone-clicked="handleMilestoneClick"
      />
    </MountainCanvas>

    <!-- 数据指标面板 -->
    <div class="metrics-overlay" v-if="showMetrics">
      <DataMetrics
        :student-profile="studentProfile"
        :selected-school="selectedSchool"
      />
    </div>

    <!-- 学校详情面板 -->
    <SchoolDetail
      v-if="selectedSchool"
      :school="selectedSchool"
      @close="selectedSchool = null"
      @add-to-comparison="addToComparison"
      @start-application="startApplication"
    />

    <!-- 学校对比面板 -->
    <div class="comparison-overlay" v-if="showComparison">
      <SchoolComparison
        :schools="schools"
        :selected-schools="comparisonSchools"
        @school-selected="handleSchoolSelect"
        @comparison-export="exportComparison"
      />
    </div>

    <!-- 专业控制栏 -->
    <div class="professional-controls-bar">
      <div class="controls-group">
        <button class="pro-control-btn" @click="toggleMetrics" :class="{ active: showMetrics }">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect x="2" y="2" width="14" height="5" fill="currentColor"/>
            <rect x="2" y="9" width="6" height="7" fill="currentColor"/>
            <rect x="10" y="9" width="6" height="7" fill="currentColor"/>
          </svg>
          <span>数据分析</span>
        </button>
        <button class="pro-control-btn" @click="toggleComparison" :class="{ active: showComparison }">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <rect x="2" y="2" width="6" height="6" fill="currentColor"/>
            <rect x="10" y="2" width="6" height="6" fill="currentColor"/>
            <rect x="2" y="10" width="6" height="6" fill="currentColor"/>
            <rect x="10" y="10" width="6" height="6" fill="currentColor"/>
          </svg>
          <span>院校对比</span>
        </button>
        <button class="pro-control-btn" @click="switchTheme">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 2L11 7H16L12 10L14 15L9 12L4 15L6 10L2 7H7L9 2Z" fill="currentColor"/>
          </svg>
          <span>{{ mountainThemeLabels[selectedMountain] }}</span>
        </button>
      </div>
      <div class="controls-group">
        <button class="pro-control-btn" @click="handleExport">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 12L5 8h3V2h2v6h3L9 12z" fill="currentColor"/>
            <path d="M2 14h14v2H2z" fill="currentColor"/>
          </svg>
          <span>导出报告</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import MountainCanvas from '@/components/MountainCanvas.vue'
import SchoolTiers from '@/components/SchoolTiers.vue'
import InteractivePathway from '@/components/InteractivePathway.vue'
import DataMetrics from '@/components/DataMetrics.vue'
import SchoolDetail from '@/components/SchoolDetail.vue'
import SchoolComparison from '@/components/SchoolComparison.vue'
import { usePathwayStore } from '@/stores/pathway'
import { useSchoolStore } from '@/stores/schools'

// TypeScript 类型定义
interface School {
  id: string;
  name: string;
  nameEn: string;
  location: string;
  tier: 'dream' | 'match' | 'safety';
  mountain: string;
  altitude: number;
  matchScore: number;
  ranking: {
    world: number;
    national?: number;
    regional?: number;
  };
  requirements: {
    gpa: number;
    sat?: number;
    alevel?: string;
    ielts?: number;
    toefl?: number;
    activities: string;
  };
  tags: string[];
  description: string;
  color: string;
  icon: string;
}

type MountainTheme = 'everest' | 'alps' | 'rockies' | 'fuji';
type ViewMode = 'single' | 'comparison' | 'presentation';

// Store
const pathwayStore = usePathwayStore()
const schoolStore = useSchoolStore()

// 响应式数据
const selectedMountain: Ref<MountainTheme> = ref('everest')
const viewMode: Ref<ViewMode> = ref('single')
const selectedSchool: Ref<School | null> = ref(null)
const selectedMilestone = ref(null)
const currentProgress = ref(45)
const showMetrics = ref(true)
const showComparison = ref(false)
const comparisonSchools = ref<any[]>([])

// 学校数据
const schools = computed(() => schoolStore.schools)

// 学生档案
const studentProfile = ref({
  gpa: 3.8,
  sat: 1450,
  toefl: 105,
  activities: '良好',
  preferences: {
    location: 'any',
    size: 'medium',
    type: 'research'
  }
})

// 学生进度
const studentProgress = ref({
  completedMilestones: ['gpa', 'toefl'],
  currentMilestone: 'sat',
  applicationStatus: {
    submitted: 3,
    inProgress: 5,
    planned: 7
  }
})

// 山峰主题标签
const mountainThemeLabels = {
  everest: '珠峰路径',
  alps: '阿尔卑斯',
  rockies: '落基山脉',
  fuji: '富士山径'
}

// 计算属性
const filteredSchools = computed(() => {
  return schoolStore.getSchoolsByMountain(selectedMountain.value)
})

const pathwayMilestones = computed(() => {
  return pathwayStore.getMilestones(selectedSchool.value)
})

const pathwayStatistics = computed(() => {
  return {
    successRate: calculateSuccessRate(),
    estimatedTime: calculateEstimatedTime(),
    difficulty: calculateDifficulty()
  }
})

const comparisonStudents = computed(() => {
  return pathwayStore.comparisonStudents
})

// 方法
const handleSchoolSelect = (school: any) => {
  selectedSchool.value = school
  pathwayStore.setTargetSchool(school)
}

const handleMilestoneClick = (milestone: any) => {
  selectedMilestone.value = milestone
}

const handleNodeSelection = (node: any) => {
  console.log('Node selected:', node)
}

const toggleMetrics = () => {
  showMetrics.value = !showMetrics.value
}

const toggleComparison = () => {
  showComparison.value = !showComparison.value
}

const switchTheme = () => {
  const themes: MountainTheme[] = ['everest', 'alps', 'rockies', 'fuji']
  const currentIndex = themes.indexOf(selectedMountain.value)
  selectedMountain.value = themes[(currentIndex + 1) % themes.length]
}

const addToComparison = (school: any) => {
  if (comparisonSchools.value.length < 4 && !comparisonSchools.value.find(s => s.id === school.id)) {
    comparisonSchools.value.push(school)
    showComparison.value = true
  }
}

const startApplication = (school: any) => {
  console.log('Starting application for:', school.name)
  // 实现申请流程逻辑
}

const exportComparison = (data: any) => {
  console.log('Exporting comparison data:', data)
  // 实现导出逻辑
}

const handleExport = () => {
  console.log('Exporting pathway visualization...')
  // 实现导出功能
}

const calculateSuccessRate = () => {
  if (!selectedSchool.value) return 0
  // 基于学校匹配度和当前进度计算
  return Math.round(selectedSchool.value.matchScore * (currentProgress.value / 100))
}

const calculateEstimatedTime = () => {
  if (!selectedSchool.value) return '未知'
  const months = Math.ceil((100 - currentProgress.value) / 5)
  return `${months}个月`
}

const calculateDifficulty = () => {
  if (!selectedSchool.value) return '中等'
  const tierMap = {
    dream: '极高',
    match: '适中',
    safety: '保底'
  }
  return tierMap[selectedSchool.value.tier] || '中等'
}

// 生命周期
onMounted(() => {
  // 加载初始数据
  schoolStore.loadSchools()
  pathwayStore.loadStudentData()
})
</script>

<style lang="scss" scoped>
.mountain-pathway-visualization.professional {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: $secondary-color; // 应用新的浅灰色背景
  overflow: hidden;
  font-family: 'Inter', sans-serif; // 引入新字体 (需要在index.html中引入)
}

.metrics-overlay {
  position: absolute;
  top: 80px;
  left: 24px;
  width: 420px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  z-index: 100;
  animation: slideInLeft 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.comparison-overlay {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1400px;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 100;
  animation: slideInUp 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.professional-controls-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: $card-bg-color; // 使用白色背景
  border-top: 1px solid $border-color; // 使用新的边框颜色
  box-shadow: 0 -2px 10px $shadow-color; // 添加顶部阴影
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 200;
}

.controls-group {
  display: flex;
  gap: 8px;
}

.pro-control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent; // 默认透明背景
  border: 1px solid $border-color; // 使用新的边框颜色
  border-radius: 6px;
  color: $text-light-color; // 使用浅色文字
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background-color: rgba($primary-color, 0.1); // 悬停时显示主色调的浅色背景
    border-color: $primary-color;
    color: $primary-color;
  }
  
  &.active {
    background-color: $primary-color; // 激活时使用主色调背景
    border-color: $primary-color;
    color: #FFFFFF; // 激活时使用白色文字
  }
  
  &:active {
    transform: scale(0.98);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>

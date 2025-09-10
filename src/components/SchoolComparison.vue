<template>
  <div class="school-comparison professional">
    <!-- 比较头部 -->
    <div class="comparison-header">
      <h2 class="comparison-title">院校对比分析</h2>
      <div class="comparison-controls">
        <button class="control-btn" @click="toggleView">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <rect x="2" y="2" width="5" height="5" fill="currentColor"/>
            <rect x="9" y="2" width="5" height="5" fill="currentColor"/>
            <rect x="2" y="9" width="5" height="5" fill="currentColor"/>
            <rect x="9" y="9" width="5" height="5" fill="currentColor"/>
          </svg>
          {{ viewMode === 'grid' ? '表格视图' : '网格视图' }}
        </button>
        <button class="control-btn" @click="exportComparison">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M8 12L3 7h3V2h4v5h3L8 12z" fill="currentColor"/>
            <path d="M2 14h12v2H2z" fill="currentColor"/>
          </svg>
          导出报告
        </button>
      </div>
    </div>

    <!-- 学校选择器 -->
    <div class="school-selector">
      <div 
        v-for="(slot, index) in comparisonSlots" 
        :key="index"
        class="selector-slot"
        :class="{ 'has-school': slot.school }"
      >
        <div v-if="slot.school" class="selected-school">
          <div class="school-badge" :style="{ background: slot.school.color + '20', borderColor: slot.school.color }">
            <span class="school-rank">#{{ slot.school.ranking?.world }}</span>
          </div>
          <div class="school-info">
            <h3>{{ slot.school.name }}</h3>
            <p>{{ slot.school.nameEn }}</p>
          </div>
          <button class="remove-btn" @click="removeSchool(index)">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div v-else class="empty-slot" @click="openSchoolPicker(index)">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4"/>
            <path d="M16 10v12M10 16h12" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>添加学校</span>
        </div>
      </div>
    </div>

    <!-- 比较内容 -->
    <div class="comparison-content" :class="viewMode">
      <!-- 关键指标对比 -->
      <div class="metrics-comparison">
        <h3 class="section-title">关键指标</h3>
        <div class="metrics-grid">
          <div v-for="metric in comparisonMetrics" :key="metric.id" class="metric-row">
            <div class="metric-name">{{ metric.name }}</div>
            <div class="metric-values">
              <div 
                v-for="(slot, index) in comparisonSlots" 
                :key="index"
                class="metric-value-cell"
              >
                <div v-if="slot.school" class="value-wrapper">
                  <div class="value-bar" :style="getMetricBarStyle(slot.school, metric)"></div>
                  <span class="value-text">{{ getMetricValue(slot.school, metric) }}</span>
                </div>
                <div v-else class="empty-value">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 雷达图对比 -->
      <div class="radar-comparison">
        <h3 class="section-title">综合能力对比</h3>
        <div class="radar-container">
          <svg class="radar-chart" viewBox="0 0 400 400">
            <!-- 背景网格 -->
            <g class="radar-grid">
              <circle 
                v-for="level in 5" 
                :key="level"
                cx="200" 
                cy="200" 
                :r="level * 30"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
              />
              <line 
                v-for="axis in radarAxes" 
                :key="axis.id"
                :x1="200"
                :y1="200"
                :x2="axis.x"
                :y2="axis.y"
                stroke="rgba(255,255,255,0.1)"
              />
            </g>
            
            <!-- 数据多边形 -->
            <g class="radar-data">
              <polygon
                v-for="(slot, index) in comparisonSlots.filter(s => s.school)"
                :key="index"
                :points="getRadarPoints(slot.school)"
                :fill="slot.school.color + '30'"
                :stroke="slot.school.color"
                stroke-width="2"
              />
            </g>
            
            <!-- 轴标签 -->
            <g class="radar-labels">
              <text 
                v-for="axis in radarAxes" 
                :key="axis.id"
                :x="axis.labelX"
                :y="axis.labelY"
                text-anchor="middle"
                fill="rgba(255,255,255,0.7)"
                font-size="12"
              >
                {{ axis.label }}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 详细对比表 -->
      <div class="detailed-comparison">
        <h3 class="section-title">详细信息对比</h3>
        <div class="comparison-table">
          <div class="table-row header-row">
            <div class="table-cell category-cell">项目</div>
            <div 
              v-for="(slot, index) in comparisonSlots" 
              :key="index"
              class="table-cell school-cell"
            >
              {{ slot.school?.name || '-' }}
            </div>
          </div>
          
          <div v-for="category in detailCategories" :key="category.id" class="category-group">
            <div class="table-row category-header">
              <div class="table-cell" :colspan="comparisonSlots.length + 1">
                {{ category.name }}
              </div>
            </div>
            <div v-for="item in category.items" :key="item.id" class="table-row">
              <div class="table-cell category-cell">{{ item.label }}</div>
              <div 
                v-for="(slot, index) in comparisonSlots" 
                :key="index"
                class="table-cell value-cell"
              >
                <span v-if="slot.school" :class="getValueClass(slot.school, item)">
                  {{ getDetailValue(slot.school, item) }}
                </span>
                <span v-else class="empty-value">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐指数 -->
      <div class="recommendation-summary">
        <h3 class="section-title">智能推荐分析</h3>
        <div class="recommendation-cards">
          <div 
            v-for="(slot, index) in comparisonSlots.filter(s => s.school)" 
            :key="index"
            class="recommendation-card"
          >
            <div class="recommendation-header">
              <h4>{{ slot.school.name }}</h4>
              <div class="match-score" :style="{ background: getScoreColor(slot.school.matchScore) }">
                {{ slot.school.matchScore }}%
              </div>
            </div>
            <div class="recommendation-content">
              <div class="pros-cons">
                <div class="pros">
                  <h5>优势</h5>
                  <ul>
                    <li v-for="pro in getSchoolPros(slot.school)" :key="pro">{{ pro }}</li>
                  </ul>
                </div>
                <div class="cons">
                  <h5>挑战</h5>
                  <ul>
                    <li v-for="con in getSchoolCons(slot.school)" :key="con">{{ con }}</li>
                  </ul>
                </div>
              </div>
              <div class="recommendation-action">
                <button class="primary-btn">查看详细分析</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  schools: any[]
  selectedSchools?: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  schoolSelected: [school: any]
  comparisonExport: [data: any]
}>()

// 视图模式
const viewMode = ref<'grid' | 'table'>('grid')

// 比较槽位（最多4个）
const comparisonSlots = ref([
  { school: null },
  { school: null },
  { school: null },
  { school: null }
])

// 比较指标
const comparisonMetrics = ref([
  { id: 'ranking', name: '世界排名', key: 'ranking.world', inverse: true },
  { id: 'gpa', name: 'GPA要求', key: 'requirements.gpa' },
  { id: 'toefl', name: '托福要求', key: 'requirements.toefl' },
  { id: 'match', name: '匹配度', key: 'matchScore' }
])

// 雷达图轴
const radarAxes = ref([
  { id: 'academic', label: '学术实力', x: 200, y: 80, labelX: 200, labelY: 60 },
  { id: 'ranking', label: '全球排名', x: 320, y: 140, labelX: 340, labelY: 140 },
  { id: 'employment', label: '就业前景', x: 320, y: 260, labelX: 340, labelY: 260 },
  { id: 'location', label: '地理位置', x: 200, y: 320, labelX: 200, labelY: 340 },
  { id: 'cost', label: '性价比', x: 80, y: 260, labelX: 60, labelY: 260 },
  { id: 'culture', label: '文化适应', x: 80, y: 140, labelX: 60, labelY: 140 }
])

// 详细对比类别
const detailCategories = ref([
  {
    id: 'basic',
    name: '基本信息',
    items: [
      { id: 'location', label: '地理位置', key: 'location' },
      { id: 'tier', label: '申请层级', key: 'tier' },
      { id: 'tags', label: '特色标签', key: 'tags' }
    ]
  },
  {
    id: 'requirements',
    name: '申请要求',
    items: [
      { id: 'gpa', label: 'GPA', key: 'requirements.gpa' },
      { id: 'sat', label: 'SAT', key: 'requirements.sat' },
      { id: 'toefl', label: 'TOEFL', key: 'requirements.toefl' },
      { id: 'activities', label: '活动要求', key: 'requirements.activities' }
    ]
  }
])

// 切换视图
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid'
}

// 导出比较
const exportComparison = () => {
  const data = comparisonSlots.value
    .filter(slot => slot.school)
    .map(slot => slot.school)
  emit('comparisonExport', data)
}

// 移除学校
const removeSchool = (index: number) => {
  comparisonSlots.value[index].school = null
}

// 打开学校选择器
const openSchoolPicker = (index: number) => {
  // 实现学校选择逻辑
}

// 获取指标值
const getMetricValue = (school: any, metric: any) => {
  const keys = metric.key.split('.')
  let value = school
  for (const key of keys) {
    value = value?.[key]
  }
  return value || '-'
}

// 获取指标条形图样式
const getMetricBarStyle = (school: any, metric: any) => {
  const value = getMetricValue(school, metric)
  if (value === '-') return {}
  
  let percentage = 0
  if (metric.id === 'ranking') {
    percentage = Math.max(0, 100 - (value / 100) * 100)
  } else if (metric.id === 'gpa') {
    percentage = (value / 4) * 100
  } else if (metric.id === 'toefl') {
    percentage = (value / 120) * 100
  } else {
    percentage = value
  }
  
  return {
    width: `${percentage}%`,
    background: `linear-gradient(90deg, ${school.color}80, ${school.color})`
  }
}

// 获取雷达图点
const getRadarPoints = (school: any) => {
  // 简化的雷达图数据计算
  const values = [
    85, // 学术实力
    90, // 全球排名
    80, // 就业前景
    75, // 地理位置
    70, // 性价比
    85  // 文化适应
  ]
  
  return values.map((value, index) => {
    const angle = (index * 60 - 90) * Math.PI / 180
    const radius = (value / 100) * 150
    const x = 200 + radius * Math.cos(angle)
    const y = 200 + radius * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')
}

// 获取详细值
const getDetailValue = (school: any, item: any) => {
  const keys = item.key.split('.')
  let value = school
  for (const key of keys) {
    value = value?.[key]
  }
  
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  
  return value || '-'
}

// 获取值的类名
const getValueClass = (school: any, item: any) => {
  // 根据值的类型返回不同的样式类
  return ''
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 85) return 'linear-gradient(135deg, #10b981, #34d399)'
  if (score >= 70) return 'linear-gradient(135deg, #3b82f6, #60a5fa)'
  if (score >= 50) return 'linear-gradient(135deg, #f59e0b, #fbbf24)'
  return 'linear-gradient(135deg, #ef4444, #f87171)'
}

// 获取学校优势
const getSchoolPros = (school: any) => {
  // 根据学校数据动态生成优势
  return [
    '世界排名前50',
    '地理位置优越',
    '就业率高达95%'
  ]
}

// 获取学校挑战
const getSchoolCons = (school: any) => {
  // 根据学校数据动态生成挑战
  return [
    '竞争激烈',
    '费用较高'
  ]
}

// 初始化默认比较学校
if (props.selectedSchools && props.selectedSchools.length > 0) {
  props.selectedSchools.slice(0, 4).forEach((school, index) => {
    comparisonSlots.value[index].school = school
  })
}
</script>

<style scoped lang="scss">
.school-comparison.professional {
  background: rgba(26, 32, 44, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comparison-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.comparison-controls {
  display: flex;
  gap: 12px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(45, 55, 72, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
}

.school-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.selector-slot {
  background: rgba(45, 55, 72, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &.has-school {
    background: rgba(45, 55, 72, 0.5);
  }
}

.selected-school {
  position: relative;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.school-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 14px;
}

.school-info {
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  
  p {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(45, 55, 72, 0.5);
    color: rgba(255, 255, 255, 0.6);
  }
  
  span {
    margin-top: 8px;
    font-size: 12px;
  }
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.metrics-comparison {
  background: rgba(45, 55, 72, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-name {
  min-width: 120px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.metric-values {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.metric-value-cell {
  position: relative;
  background: rgba(26, 32, 44, 0.5);
  border-radius: 6px;
  overflow: hidden;
  height: 32px;
}

.value-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.value-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0.3;
  transition: width 0.5s ease;
}

.value-text {
  position: relative;
  z-index: 1;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.empty-value {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.3);
}

.radar-comparison {
  background: rgba(45, 55, 72, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.radar-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.radar-chart {
  max-width: 400px;
  width: 100%;
  height: auto;
}

.detailed-comparison {
  background: rgba(45, 55, 72, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.comparison-table {
  overflow-x: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 150px repeat(4, 1fr);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &.header-row {
    background: rgba(26, 32, 44, 0.5);
    font-weight: 600;
    
    .table-cell {
      padding: 12px;
      color: rgba(255, 255, 255, 0.9);
    }
  }
  
  &.category-header {
    background: rgba(37, 99, 235, 0.1);
    grid-template-columns: 1fr;
    
    .table-cell {
      padding: 8px 12px;
      font-weight: 600;
      color: #60a5fa;
    }
  }
}

.table-cell {
  padding: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  
  &.category-cell {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &.value-cell {
    color: rgba(255, 255, 255, 0.8);
  }
}

.recommendation-summary {
  background: rgba(45, 55, 72, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.recommendation-card {
  background: rgba(26, 32, 44, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
  }
}

.match-score {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  h5 {
    font-size: 12px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: rgba(255, 255, 255, 0.6);
  }
  
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    
    li {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 4px;
      padding-left: 12px;
      position: relative;
      
      &:before {
        content: '•';
        position: absolute;
        left: 0;
      }
    }
  }
  
  .pros li:before { color: #10b981; }
  .cons li:before { color: #f59e0b; }
}

.primary-btn {
  width: 100%;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
}
</style>
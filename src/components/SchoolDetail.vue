<template>
  <transition name="panel-slide">
    <div v-if="school" class="school-detail-panel professional">
      <!-- 面板头部 -->
      <div class="panel-header">
        <button class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M4 10H16M4 10L8 6M4 10L8 14" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="header-content">
          <div class="school-badge" :style="{ background: school.color + '20', borderColor: school.color }">
            <span class="ranking">#{{ school.ranking?.world }}</span>
          </div>
          <div class="school-title">
            <h2>{{ school.name }}</h2>
            <p>{{ school.nameEn }}</p>
          </div>
        </div>
        <div class="quick-actions">
          <button class="action-btn" @click="addToComparison">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <rect x="2" y="2" width="5" height="5" fill="currentColor"/>
              <rect x="9" y="2" width="5" height="5" fill="currentColor"/>
              <rect x="2" y="9" width="5" height="5" fill="currentColor"/>
              <rect x="9" y="9" width="5" height="5" fill="currentColor"/>
            </svg>
          </button>
          <button class="action-btn" @click="toggleFavorite">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M8 2L10 7H15L11 10L13 15L8 12L3 15L5 10L1 7H6L8 2Z" 
                :fill="isFavorite ? 'currentColor' : 'none'"
                stroke="currentColor" 
                stroke-width="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 关键信息卡片 -->
      <div class="key-info-grid">
        <div class="info-card">
          <div class="info-label">申请层级</div>
          <div class="info-value tier-value" :class="school.tier">
            {{ getTierName(school.tier) }}
          </div>
        </div>
        <div class="info-card">
          <div class="info-label">匹配度</div>
          <div class="info-value">
            <div class="match-indicator">
              <div class="match-bar" :style="{ width: school.matchScore + '%' }"></div>
              <span class="match-text">{{ school.matchScore }}%</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-label">地理位置</div>
          <div class="info-value location-value">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M7 0C4.2 0 2 2.2 2 5C2 9 7 14 7 14S12 9 12 5C12 2.2 9.8 0 7 0ZM7 7C5.9 7 5 6.1 5 5S5.9 3 7 3S9 3.9 9 5S8.1 7 7 7Z" fill="currentColor"/>
            </svg>
            {{ school.location }}
          </div>
        </div>
      </div>

      <!-- 详细信息标签页 -->
      <div class="detail-tabs">
        <div class="tab-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 概览标签 -->
          <div v-if="activeTab === 'overview'" class="tab-panel">
            <div class="overview-section">
              <h3>学校简介</h3>
              <p>{{ school.description }}</p>
            </div>
            
            <div class="overview-section">
              <h3>特色标签</h3>
              <div class="tags-list">
                <span v-for="tag in school.tags" :key="tag" class="tag-item">
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <div class="overview-section">
              <h3>关键数据</h3>
              <div class="data-grid">
                <div class="data-item">
                  <span class="data-label">世界排名</span>
                  <span class="data-value">#{{ school.ranking?.world }}</span>
                </div>
                <div class="data-item">
                  <span class="data-label">国内排名</span>
                  <span class="data-value">#{{ school.ranking?.national || school.ranking?.regional }}</span>
                </div>
                <div class="data-item">
                  <span class="data-label">申请难度</span>
                  <span class="data-value">{{ getDifficulty(school.tier) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 申请要求标签 -->
          <div v-if="activeTab === 'requirements'" class="tab-panel">
            <div class="requirements-grid">
              <div class="requirement-card">
                <div class="requirement-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 2L2 7V12C2 16.5 4.5 20.7 8.5 22.3L12 24L15.5 22.3C19.5 20.7 22 16.5 22 12V7L12 2Z" fill="currentColor" opacity="0.2"/>
                    <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor">GPA</text>
                  </svg>
                </div>
                <div class="requirement-info">
                  <div class="requirement-label">GPA要求</div>
                  <div class="requirement-value">{{ school.requirements?.gpa || 'N/A' }}</div>
                  <div class="requirement-note">最低要求</div>
                </div>
              </div>
              
              <div class="requirement-card" v-if="school.requirements?.sat">
                <div class="requirement-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" opacity="0.2"/>
                    <text x="12" y="14" text-anchor="middle" font-size="8" fill="currentColor">SAT</text>
                  </svg>
                </div>
                <div class="requirement-info">
                  <div class="requirement-label">SAT分数</div>
                  <div class="requirement-value">{{ school.requirements.sat }}</div>
                  <div class="requirement-note">建议分数</div>
                </div>
              </div>
              
              <div class="requirement-card" v-if="school.requirements?.alevel">
                <div class="requirement-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" opacity="0.2"/>
                    <text x="12" y="14" text-anchor="middle" font-size="8" fill="currentColor">A-L</text>
                  </svg>
                </div>
                <div class="requirement-info">
                  <div class="requirement-label">A-Level</div>
                  <div class="requirement-value">{{ school.requirements.alevel }}</div>
                  <div class="requirement-note">最低要求</div>
                </div>
              </div>
              
              <div class="requirement-card">
                <div class="requirement-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2"/>
                    <text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">LANG</text>
                  </svg>
                </div>
                <div class="requirement-info">
                  <div class="requirement-label">语言要求</div>
                  <div class="requirement-value">
                    {{ school.requirements?.toefl ? `TOEFL ${school.requirements.toefl}` : '' }}
                    {{ school.requirements?.ielts ? `IELTS ${school.requirements.ielts}` : '' }}
                  </div>
                  <div class="requirement-note">最低分数</div>
                </div>
              </div>
              
              <div class="requirement-card">
                <div class="requirement-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" fill="currentColor" opacity="0.2"/>
                  </svg>
                </div>
                <div class="requirement-info">
                  <div class="requirement-label">课外活动</div>
                  <div class="requirement-value">{{ school.requirements?.activities || '良好' }}</div>
                  <div class="requirement-note">期望水平</div>
                </div>
              </div>
            </div>
            
            <div class="requirements-note">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 5V9M8 11V11.5" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <p>以上为参考要求，实际录取标准可能因专业和申请年份有所不同</p>
            </div>
          </div>
          
          <!-- 申请策略标签 -->
          <div v-if="activeTab === 'strategy'" class="tab-panel">
            <div class="strategy-section">
              <h3>申请时间线</h3>
              <div class="timeline">
                <div class="timeline-item" v-for="item in getTimeline(school)" :key="item.id">
                  <div class="timeline-marker" :class="{ completed: item.completed, current: item.current }"></div>
                  <div class="timeline-content">
                    <div class="timeline-date">{{ item.date }}</div>
                    <div class="timeline-title">{{ item.title }}</div>
                    <div class="timeline-desc">{{ item.description }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="strategy-section">
              <h3>申请建议</h3>
              <div class="advice-cards">
                <div class="advice-card">
                  <div class="advice-icon success">✓</div>
                  <div class="advice-content">
                    <h4>优势项</h4>
                    <ul>
                      <li>GPA达到要求</li>
                      <li>语言成绩优秀</li>
                    </ul>
                  </div>
                </div>
                <div class="advice-card">
                  <div class="advice-icon warning">!</div>
                  <div class="advice-content">
                    <h4>提升项</h4>
                    <ul>
                      <li>增加科研经历</li>
                      <li>丰富课外活动</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="panel-footer">
        <button class="footer-btn primary" @click="startApplication">
          开始申请规划
        </button>
        <button class="footer-btn secondary" @click="downloadReport">
          下载详细报告
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  school: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addToComparison: [school: any]
  startApplication: [school: any]
}>()

// 状态
const activeTab = ref('overview')
const isFavorite = ref(false)

// 标签页配置
const tabs = [
  { id: 'overview', label: '概览' },
  { id: 'requirements', label: '申请要求' },
  { id: 'strategy', label: '申请策略' }
]

// 获取层级名称
const getTierName = (tier: string) => {
  const names = {
    dream: '冲刺院校',
    match: '匹配院校',
    safety: '保底院校'
  }
  return names[tier as keyof typeof names] || tier
}

// 获取难度
const getDifficulty = (tier: string) => {
  const difficulties = {
    dream: '极高',
    match: '适中',
    safety: '较低'
  }
  return difficulties[tier as keyof typeof difficulties] || '未知'
}

// 获取时间线
const getTimeline = (school: any) => {
  return [
    {
      id: 1,
      date: '2024年9月',
      title: '准备阶段',
      description: '完成标化考试，准备申请材料',
      completed: true
    },
    {
      id: 2,
      date: '2024年11月',
      title: '文书撰写',
      description: '完成个人陈述和推荐信',
      completed: true
    },
    {
      id: 3,
      date: '2025年1月',
      title: '提交申请',
      description: '在截止日期前提交所有材料',
      current: true
    },
    {
      id: 4,
      date: '2025年3月',
      title: '等待结果',
      description: '跟进申请状态，准备面试',
      completed: false
    }
  ]
}

// 方法
const addToComparison = () => {
  emit('addToComparison', props.school)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const startApplication = () => {
  emit('startApplication', props.school)
}

const downloadReport = () => {
  // 实现下载报告逻辑
}
</script>

<style scoped lang="scss">
.school-detail-panel.professional {
  position: fixed;
  right: 0;
  top: 0;
  width: 480px;
  height: 100vh;
  background: rgba(26, 32, 44, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  color: white;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(45, 55, 72, 0.8);
    color: white;
  }
}

.header-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.school-badge {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  
  .ranking {
    font-size: 18px;
    font-weight: 700;
  }
}

.school-title {
  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
  }
  
  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(45, 55, 72, 0.8);
    color: white;
  }
}

.key-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card {
  background: rgba(45, 55, 72, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: white;
  
  &.tier-value {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    
    &.dream {
      background: rgba(220, 38, 38, 0.2);
      color: #ef4444;
      border: 1px solid rgba(220, 38, 38, 0.3);
    }
    
    &.match {
      background: rgba(37, 99, 235, 0.2);
      color: #3b82f6;
      border: 1px solid rgba(37, 99, 235, 0.3);
    }
    
    &.safety {
      background: rgba(22, 163, 74, 0.2);
      color: #22c55e;
      border: 1px solid rgba(22, 163, 74, 0.3);
    }
  }
  
  &.location-value {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.match-indicator {
  position: relative;
  width: 120px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.match-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.match-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.detail-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-nav {
  display: flex;
  gap: 8px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-btn {
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
  
  &.active {
    color: white;
    border-bottom-color: #3b82f6;
  }
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  
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

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.overview-section {
  margin-bottom: 24px;
  
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  p {
    font-size: 13px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 6px 12px;
  background: rgba(45, 55, 72, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.data-item {
  background: rgba(45, 55, 72, 0.3);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  
  .data-label {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 4px;
  }
  
  .data-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: white;
  }
}

.requirements-grid {
  display: grid;
  gap: 16px;
}

.requirement-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(45, 55, 72, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.requirement-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.requirement-info {
  flex: 1;
  
  .requirement-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 4px;
  }
  
  .requirement-value {
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin-bottom: 2px;
  }
  
  .requirement-note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.requirements-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 8px;
  margin-top: 20px;
  
  svg {
    flex-shrink: 0;
    color: #60a5fa;
  }
  
  p {
    font-size: 12px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }
}

.strategy-section {
  margin-bottom: 24px;
  
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 16px 0;
  }
}

.timeline {
  position: relative;
  padding-left: 32px;
  
  &:before {
    content: '';
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(45, 55, 72, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &.completed {
    background: #10b981;
    border-color: #10b981;
  }
  
  &.current {
    background: #3b82f6;
    border-color: #3b82f6;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.timeline-content {
  .timeline-date {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 4px;
  }
  
  .timeline-title {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
  }
  
  .timeline-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.4;
  }
}

.advice-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.advice-card {
  background: rgba(45, 55, 72, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px;
}

.advice-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  
  &.success {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
  
  &.warning {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }
}

.advice-content {
  h4 {
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin: 0 0 8px 0;
  }
  
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    
    li {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
      padding-left: 16px;
      position: relative;
      
      &:before {
        content: '→';
        position: absolute;
        left: 0;
        color: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.panel-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(26, 32, 44, 0.5);
}

.footer-btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  }
  
  &.secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}
</style>
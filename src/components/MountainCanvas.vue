<template>
  <div class="mountain-canvas professional-theme" :class="`theme-${mountainTheme}`">
    <!-- 专业背景层 -->
    <div class="background-layers">
      <!-- 渐变背景 -->
      <div class="gradient-background" :style="backgroundGradientStyle"></div>
      
      <!-- 网格覆盖层 - 增加专业感 -->
      <div class="grid-overlay"></div>
      
      <!-- 山峰轮廓层 -->
      <div class="mountain-silhouette">
        <svg class="mountain-svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          <!-- 背景山脉 -->
          <g class="background-mountains">
            <path 
              :d="backgroundMountainPath" 
              fill="rgba(255, 255, 255, 0.5)"
              class="mountain-shadow"
            />
          </g>
          
          <!-- 中景山脉 -->
          <g class="midground-mountains">
            <path 
              :d="midgroundMountainPath" 
              fill="rgba(255, 255, 255, 0.7)"
            />
          </g>
          
          <!-- 前景山脉 - 主山峰 -->
          <g class="foreground-mountains">
            <path 
              :d="foregroundMountainPath" 
              fill="rgba(255, 255, 255, 1)"
            />
            <!-- 山峰高光 -->
            <path 
              :d="peakHighlightPath" 
              fill="url(#peakGradient)"
              opacity="0.3"
            />
          </g>
          
          <!-- 定义渐变 -->
          <defs>
            <linearGradient id="peakGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <!-- 大气效果层 -->
      <div class="atmosphere-layer">
        <!-- 细微的雾气效果 -->
        <div class="mist-effect"></div>
        <!-- 光线效果 -->
        <div class="light-rays"></div>
      </div>
    </div>
    
    <!-- 内容层 -->
    <div class="canvas-content">
      <slot></slot>
    </div>
    
    <!-- 专业控制界面 -->
    <div class="professional-controls">
      <!-- 视角控制 -->
      <div class="view-control-panel">
        <div class="control-group">
          <button 
            v-for="view in viewOptions" 
            :key="view.id"
            @click="switchView(view.id)"
            :class="{ active: currentView === view.id }"
            class="view-button"
          >
            <svg class="icon" width="16" height="16" viewBox="0 0 16 16">
              <rect v-if="view.id === 'front'" x="4" y="4" width="8" height="8" fill="currentColor"/>
              <circle v-if="view.id === '3d'" cx="8" cy="8" r="4" fill="currentColor"/>
              <path v-if="view.id === 'top'" d="M8 2 L14 8 L8 14 L2 8 Z" fill="currentColor"/>
            </svg>
            <span>{{ view.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- 缩放控制 -->
      <div class="zoom-control-panel">
        <button @click="zoomOut" class="zoom-button">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="zoom-indicator">{{ Math.round(zoomLevel * 100) }}%</div>
        <button @click="zoomIn" class="zoom-button">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" stroke-width="2"/>
            <line x1="8" y1="4" x2="8" y2="12" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// Props
interface Props {
  mountainTheme: 'everest' | 'fuji' | 'alps' | 'rockies'
  viewMode: 'single' | 'comparison' | 'presentation'
}

const props = withDefaults(defineProps<Props>(), {
  mountainTheme: 'everest',
  viewMode: 'single'
})

// 响应式数据
const zoomLevel = ref(1)
const currentView = ref('front')

// 视角选项
const viewOptions = [
  { id: 'front', label: '正视图' },
  { id: '3d', label: '透视图' },
  { id: 'top', label: '俯视图' }
]

// 山峰路径 - 更专业的几何形状
const mountainPaths = {
  everest: {
    background: 'M0,600 L200,500 L400,450 L600,400 L800,350 L1000,320 L1200,340 L1400,380 L1600,420 L1920,450 L1920,1080 L0,1080 Z',
    midground: 'M0,700 L300,600 L600,500 L900,420 L1100,400 L1300,450 L1500,520 L1920,580 L1920,1080 L0,1080 Z',
    foreground: 'M0,800 L400,700 L700,550 L960,400 L1200,480 L1500,600 L1920,680 L1920,1080 L0,1080 Z',
    highlight: 'M700,550 L960,400 L1200,480 L960,500 Z'
  },
  alps: {
    background: 'M0,650 L320,550 L640,480 L960,420 L1280,460 L1600,510 L1920,550 L1920,1080 L0,1080 Z',
    midground: 'M0,750 L400,650 L800,520 L1200,480 L1600,560 L1920,620 L1920,1080 L0,1080 Z',
    foreground: 'M0,850 L480,720 L960,500 L1440,580 L1920,700 L1920,1080 L0,1080 Z',
    highlight: 'M800,520 L960,500 L1100,540 L960,560 Z'
  },
  rockies: {
    background: 'M0,600 L240,520 L480,460 L720,410 L960,430 L1200,470 L1440,510 L1680,540 L1920,560 L1920,1080 L0,1080 Z',
    midground: 'M0,720 L360,620 L720,500 L1080,460 L1440,540 L1920,600 L1920,1080 L0,1080 Z',
    foreground: 'M0,820 L450,700 L900,520 L1350,600 L1920,720 L1920,1080 L0,1080 Z',
    highlight: 'M720,500 L900,520 L1080,560 L900,580 Z'
  },
  fuji: {
    background: 'M0,700 L480,600 L960,500 L1440,600 L1920,700 L1920,1080 L0,1080 Z',
    midground: 'M0,800 L600,680 L960,550 L1320,680 L1920,800 L1920,1080 L0,1080 Z',
    foreground: 'M0,900 L720,750 L960,600 L1200,750 L1920,900 L1920,1080 L0,1080 Z',
    highlight: 'M960,550 L960,600 L1100,650 L960,620 Z'
  }
}

// 计算属性
const backgroundMountainPath = computed(() => 
  mountainPaths[props.mountainTheme].background
)

const midgroundMountainPath = computed(() => 
  mountainPaths[props.mountainTheme].midground
)

const foregroundMountainPath = computed(() => 
  mountainPaths[props.mountainTheme].foreground
)

const peakHighlightPath = computed(() => 
  mountainPaths[props.mountainTheme].highlight
)

// "光明之巅"主题背景渐变
const backgroundGradientStyle = computed(() => {
  const gradients = {
    everest: 'linear-gradient(180deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)', // 淡天蓝渐变
    alps: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',    // 淡雅蓝渐变
    rockies: 'linear-gradient(180deg, #F1F8E9 0%, #DCEDC8 50%, #C5E1A5 100%)', // 柔和绿渐变
    fuji: 'linear-gradient(180deg, #FCE4EC 0%, #F8BBD0 50%, #F48FB1 100%)'     // 晨曦粉渐变
  }
  return {
    background: gradients[props.mountainTheme]
  }
})

// 方法
const zoomIn = () => {
  if (zoomLevel.value < 2) {
    zoomLevel.value = Math.min(2, zoomLevel.value + 0.1)
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
  }
}

const switchView = (viewId: string) => {
  currentView.value = viewId
}

// 生命周期
onMounted(() => {
  // 初始化专业动画
})
</script>

<style lang="scss" scoped>
.mountain-canvas {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: transparent;
  
  &.professional-theme {
    font-family: 'Inter', sans-serif;
  }
  
  .background-layers {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .gradient-background {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: background 1s ease;
  }
  
  .grid-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.5;
  }
  
  .mountain-silhouette {
    position: absolute;
    width: 100%;
    height: 100%;
    
    .mountain-svg {
      width: 100%;
      height: 100%;
    }
  }
  
  .atmosphere-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .mist-effect {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40%;
      background: linear-gradient(to top, rgba(26, 32, 44, 0.3), transparent);
    }
    
    .light-rays {
      position: absolute;
      top: 0;
      right: 20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
      filter: blur(40px);
    }
  }
  
  .canvas-content {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  
  .professional-controls {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .view-control-panel,
    .zoom-control-panel {
      background-color: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1px solid $border-color;
      border-radius: $border-radius-md;
      padding: 8px;
      box-shadow: 0 4px 12px $shadow-color;
    }
    
    .control-group {
      display: flex;
      gap: 4px;
    }
    
    .view-button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: $border-radius-sm;
      color: $text-light-color;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
      }
      
      &.active {
        background-color: $primary-color;
        color: #FFFFFF;
      }
      
      .icon {
        width: 16px;
        height: 16px;
      }
    }
    
    .zoom-control-panel {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .zoom-button {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid $border-color;
        border-radius: $border-radius-sm;
        color: $text-light-color;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: rgba($primary-color, 0.1);
          border-color: $primary-color;
          color: $primary-color;
        }
      }
      
      .zoom-indicator {
        min-width: 48px;
        text-align: center;
        color: $text-color;
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
}
</style>

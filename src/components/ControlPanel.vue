<template>
  <div class="control-panel">
    <div class="panel-header">
      <h3>控制面板</h3>
    </div>
    
    <div class="control-group">
      <label>选择山峰主题</label>
      <select v-model="mountain" @change="updateMountain">
        <option value="everest">珠穆朗玛峰</option>
        <option value="alps">阿尔卑斯山</option>
        <option value="rockies">落基山脉</option>
        <option value="fuji">富士山</option>
      </select>
    </div>
    
    <div class="control-group">
      <label>视图模式</label>
      <div class="button-group">
        <button 
          :class="{ active: mode === 'single' }"
          @click="updateMode('single')"
        >单人</button>
        <button 
          :class="{ active: mode === 'comparison' }"
          @click="updateMode('comparison')"
        >对比</button>
        <button 
          :class="{ active: mode === 'presentation' }"
          @click="updateMode('presentation')"
        >演示</button>
      </div>
    </div>
    
    <div class="control-actions">
      <button @click="$emit('export')" class="btn-export">
        <i class="fas fa-download"></i> 导出
      </button>
      <button @click="$emit('share')" class="btn-share">
        <i class="fas fa-share"></i> 分享
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  viewMode: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:viewMode': [value: string]
  'export': []
  'share': []
}>()

const mountain = ref(props.modelValue)
const mode = ref(props.viewMode)

const updateMountain = () => {
  emit('update:modelValue', mountain.value)
}

const updateMode = (newMode: string) => {
  mode.value = newMode
  emit('update:viewMode', newMode)
}

watch(() => props.modelValue, (val) => {
  mountain.value = val
})

watch(() => props.viewMode, (val) => {
  mode.value = val
})
</script>

<style scoped>
.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 200px;
}

.panel-header h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 12px;
}

.control-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
}

.button-group {
  display: flex;
  gap: 5px;
}

.button-group button {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.button-group button.active,
.button-group button:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.control-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.control-actions button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.btn-export {
  background: #48bb78;
  color: white;
}

.btn-share {
  background: #4299e1;
  color: white;
}

.control-actions button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
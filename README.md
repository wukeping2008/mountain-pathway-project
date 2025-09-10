# 🏔️ Mountain Pathway - 登山图升学路径可视化系统

<div align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.5+-4FC08D?style=flat-square&logo=vue.js" alt="Vue.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/ECharts-5.5+-AA344D?style=flat-square&logo=apache-echarts" alt="ECharts">
</div>

## 📖 项目简介

Mountain Pathway 是一个创新的升学路径可视化系统，通过登山隐喻直观展示学生的升学规划。系统将不同难度的目标院校映射到不同高度的山峰，让升学路径规划变得生动有趣且易于理解。

### ✨ 核心特色

- 🎨 **沉浸式视觉体验** - 真实山峰背景，动态天气效果
- 📊 **智能路径规划** - AI驱动的个性化升学建议
- 🎯 **多维度院校匹配** - Dream/Match/Safety三层次规划
- 📈 **实时进度追踪** - 可视化里程碑和成就系统
- 🔄 **多模式展示** - 单人/对比/演示多种视图

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+）

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/your-org/mountain-pathway.git

# 进入项目目录
cd mountain-pathway-project

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3003
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 🏗️ 项目架构

```
mountain-pathway-project/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── MountainCanvas.vue       # 山峰画布
│   │   ├── SchoolTiers.vue          # 学校层级
│   │   ├── PathwayRoute.vue         # 路径路线
│   │   └── ProgressTracker.vue      # 进度追踪
│   │
│   ├── views/               # 页面视图
│   │   └── MountainPathwayVisualization.vue
│   │
│   ├── composables/         # 组合式函数
│   │   ├── useMountainTheme.ts      # 山峰主题
│   │   └── useAnimation.ts          # 动画效果
│   │
│   ├── stores/              # 状态管理
│   │   ├── pathway.ts               # 路径状态
│   │   └── schools.ts               # 学校数据
│   │
│   └── data/                # 静态数据
│       ├── schools.json             # 学校数据库
│       └── milestones.json          # 里程碑模板
```

## 🎮 功能特性

### 1. 山峰主题系统

| 山峰 | 高度 | 难度等级 | 对应院校层次 |
|------|------|----------|-------------|
| 珠穆朗玛峰 | 8848m | 极限挑战 | 世界Top10 |
| 阿尔卑斯山 | 4810m | 高难度 | 世界Top50 |
| 落基山脉 | 4401m | 中高难度 | 世界Top100 |
| 富士山 | 3776m | 中等难度 | 地区顶尖 |

### 2. 交互功能

- **拖拽调整** - 自由调整目标院校位置
- **缩放平移** - 灵活查看细节
- **3D视角** - 立体展示升学路径
- **实时对比** - 多学生路径对比

### 3. 数据分析

- **成功率预测** - 基于历史数据的AI预测
- **时间规划** - 智能时间线生成
- **风险评估** - 多维度风险分析
- **投资回报** - ROI计算和展示

## 🛠️ 技术栈

### 前端框架
- **Vue 3.5** - 渐进式JavaScript框架
- **TypeScript 5.0** - 类型安全的JavaScript超集
- **Vite 5.0** - 下一代前端构建工具

### UI组件
- **Element Plus 2.5** - Vue 3组件库
- **ECharts 5.5** - 数据可视化库
- **GSAP 3.12** - 专业动画库

### 状态管理
- **Pinia 2.1** - Vue官方状态管理
- **VueUse 11.0** - Vue组合式API工具集

## 📱 响应式设计

系统支持多种设备和屏幕尺寸：

- 🖥️ **桌面端** (1920×1080及以上) - 完整功能体验
- 💻 **笔记本** (1366×768) - 优化布局
- 📱 **平板** (768×1024) - 触控优化
- 📲 **手机** (375×667) - 简化视图

## 🎨 视觉效果

### 动态效果
- ☁️ 云层飘动
- ❄️ 雪花飘落（珠峰主题）
- 🌸 樱花飘散（富士山主题）
- 🌅 日夜交替
- 🌈 天气变化

### 交互反馈
- 悬停高亮
- 点击涟漪
- 平滑过渡
- 视差滚动

## 📊 数据接口

### 学校数据结构

```typescript
interface School {
  id: string
  name: string
  location: string
  tier: 'dream' | 'match' | 'safety'
  mountain: string
  altitude: number
  matchScore: number
  requirements: {
    gpa: number
    sat?: number
    toefl?: number
    activities: string
  }
  tags: string[]
}
```

### 里程碑数据结构

```typescript
interface Milestone {
  id: string
  title: string
  description: string
  deadline: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
  icon: string
}
```

## 🔧 配置说明

### 环境变量

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ASSETS_URL=https://cdn.example.com
VITE_ENABLE_MOCK=true
```

### 主题配置

```javascript
// src/config/theme.config.js
export const themeConfig = {
  mountains: {
    everest: {
      primary: '#4A5568',
      secondary: '#E2E8F0'
    }
    // ...
  }
}
```

## 📈 性能优化

- ⚡ **代码分割** - 路由级懒加载
- 🗜️ **资源压缩** - Gzip/Brotli压缩
- 🖼️ **图片优化** - WebP格式支持
- 💾 **缓存策略** - Service Worker缓存
- 🎯 **虚拟滚动** - 大数据列表优化

## 🧪 测试

```bash
# 单元测试
npm run test:unit

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

## 📝 更新日志

### v1.0.0 (2025-01)
- 🎉 初始版本发布
- ✨ 实现基础山峰可视化
- 📊 集成学校数据系统
- 🎯 添加路径规划功能

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 山峰图片来源：Unsplash
- 图标：Font Awesome
- 灵感来源：传统登山路径图

## 📞 联系方式

- 项目主页：[https://mountain-pathway.example.com](https://mountain-pathway.example.com)
- 问题反馈：[GitHub Issues](https://github.com/your-org/mountain-pathway/issues)
- 邮箱：support@mountain-pathway.com

---

<div align="center">
  <b>攀登学术高峰，规划美好未来 🏔️</b>
</div>
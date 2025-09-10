export const useMountainTheme = () => {
  const getMountainPaths = (theme: string) => {
    const paths = {
      everest: {
        far: 'M0,400 L0,250 Q200,200 400,220 Q600,180 800,160 Q1000,140 1200,120 Q1400,100 1600,80 Q1800,60 1920,50 L1920,600 Z',
        mid: 'M0,600 L0,350 Q300,320 600,340 Q900,300 1200,280 Q1500,260 1920,240 L1920,600 Z',
        near: 'M0,800 L0,450 Q400,400 800,420 Q1200,380 1600,360 Q1920,340 1920,340 L1920,800 Z',
        snow: 'M600,340 Q700,300 800,280 Q900,260 1000,240 Q1100,260 1200,280 Q1300,300 1400,340'
      },
      alps: {
        far: 'M0,400 L0,280 Q300,240 600,260 Q900,220 1200,200 Q1500,180 1920,160 L1920,600 Z',
        mid: 'M0,600 L0,380 Q400,350 800,370 Q1200,330 1600,310 Q1920,290 1920,290 L1920,600 Z',
        near: 'M0,800 L0,480 Q480,440 960,460 Q1440,420 1920,400 L1920,800 Z',
        snow: 'M700,400 Q800,360 900,340 Q1000,320 1100,340 Q1200,360 1300,400'
      },
      rockies: {
        far: 'M0,400 L0,300 Q240,260 480,280 Q720,240 960,220 Q1200,200 1440,180 Q1680,160 1920,140 L1920,600 Z',
        mid: 'M0,600 L0,400 Q320,370 640,390 Q960,350 1280,330 Q1600,310 1920,290 L1920,600 Z',
        near: 'M0,800 L0,500 Q400,460 800,480 Q1200,440 1600,420 Q1920,400 1920,400 L1920,800 Z',
        snow: 'M750,420 Q850,380 950,360 Q1050,340 1150,360 Q1250,380 1350,420'
      },
      fuji: {
        far: 'M0,400 L0,320 Q400,280 800,300 Q1200,260 1600,240 Q1920,220 1920,220 L1920,600 Z',
        mid: 'M0,600 L0,420 Q480,390 960,410 Q1440,370 1920,350 L1920,600 Z',
        near: 'M0,800 L0,520 Q600,480 960,500 Q1320,460 1920,440 L1920,800 Z',
        snow: 'M860,440 Q910,410 960,390 Q1010,410 1060,440'
      }
    }
    
    return paths[theme as keyof typeof paths] || paths.everest
  }

  const getMountainColors = (theme: string) => {
    const colors = {
      everest: {
        far: 'rgba(100, 120, 150, 0.3)',
        mid: 'rgba(80, 100, 130, 0.5)',
        near: 'rgba(60, 80, 110, 0.7)'
      },
      alps: {
        far: 'rgba(120, 140, 160, 0.3)',
        mid: 'rgba(100, 120, 140, 0.5)',
        near: 'rgba(80, 100, 120, 0.7)'
      },
      rockies: {
        far: 'rgba(140, 120, 100, 0.3)',
        mid: 'rgba(120, 100, 80, 0.5)',
        near: 'rgba(100, 80, 60, 0.7)'
      },
      fuji: {
        far: 'rgba(150, 130, 150, 0.3)',
        mid: 'rgba(130, 110, 130, 0.5)',
        near: 'rgba(110, 90, 110, 0.7)'
      }
    }
    
    return colors[theme as keyof typeof colors] || colors.everest
  }

  const getSkyGradient = (theme: string, timeOfDay: string) => {
    if (timeOfDay === 'night') {
      return 'linear-gradient(0deg, #2C3E50 0%, #000428 100%)'
    }
    
    const gradients = {
      everest: 'linear-gradient(0deg, #87CEEB 0%, #87CEEB 50%, #00BFFF 100%)',
      alps: 'linear-gradient(0deg, #B0C4DE 0%, #87CEEB 50%, #4682B4 100%)',
      rockies: 'linear-gradient(0deg, #F4A460 0%, #FFA500 50%, #FF8C00 100%)',
      fuji: 'linear-gradient(0deg, #FFB6C1 0%, #FFC0CB 50%, #FF69B4 100%)'
    }
    
    return gradients[theme as keyof typeof gradients] || gradients.everest
  }

  return {
    getMountainPaths,
    getMountainColors,
    getSkyGradient
  }
}
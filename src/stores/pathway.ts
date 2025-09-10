import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Milestone {
  id: string
  title: string
  description: string
  deadline: string
  status: 'completed' | 'in-progress' | 'pending'
  icon: string
  progress?: number
}

export interface Student {
  id: string
  name: string
  grade: string
  currentProgress: number
  targetSchool?: any
}

export const usePathwayStore = defineStore('pathway', () => {
  // State
  const currentStudent = ref<Student | null>(null)
  const milestones = ref<Milestone[]>([])
  const targetSchool = ref<any>(null)
  const comparisonStudents = ref<Student[]>([])

  // Getters
  const completedMilestones = computed(() => 
    milestones.value.filter(m => m.status === 'completed')
  )

  const progressPercentage = computed(() => {
    if (milestones.value.length === 0) return 0
    return Math.round((completedMilestones.value.length / milestones.value.length) * 100)
  })

  // Actions
  function loadStudentData() {
    // 加载示例学生数据
    currentStudent.value = {
      id: '1',
      name: '张明',
      grade: '10年级',
      currentProgress: 45
    }

    // 加载示例里程碑
    milestones.value = [
      {
        id: '1',
        title: '基础学术提升',
        description: '提高GPA至3.8以上',
        deadline: '2025-06',
        status: 'completed',
        icon: 'fas fa-book',
        progress: 100
      },
      {
        id: '2',
        title: '标准化考试',
        description: 'SAT 1450+, TOEFL 100+',
        deadline: '2025-09',
        status: 'in-progress',
        icon: 'fas fa-graduation-cap',
        progress: 60
      },
      {
        id: '3',
        title: '课外活动',
        description: '参加科研项目和社团活动',
        deadline: '2025-12',
        status: 'pending',
        icon: 'fas fa-users',
        progress: 20
      },
      {
        id: '4',
        title: '申请材料准备',
        description: '文书、推荐信等',
        deadline: '2026-01',
        status: 'pending',
        icon: 'fas fa-file-alt',
        progress: 0
      }
    ]
  }

  function setTargetSchool(school: any) {
    targetSchool.value = school
  }

  function getMilestones(school: any) {
    // 根据目标学校返回定制的里程碑
    if (!school) return milestones.value
    
    // 这里可以根据学校难度调整里程碑
    return milestones.value
  }

  function addComparisonStudent(student: Student) {
    if (comparisonStudents.value.length < 3) {
      comparisonStudents.value.push(student)
    }
  }

  function removeComparisonStudent(studentId: string) {
    comparisonStudents.value = comparisonStudents.value.filter(s => s.id !== studentId)
  }

  return {
    // State
    currentStudent,
    milestones,
    targetSchool,
    comparisonStudents,
    // Getters
    completedMilestones,
    progressPercentage,
    // Actions
    loadStudentData,
    setTargetSchool,
    getMilestones,
    addComparisonStudent,
    removeComparisonStudent
  }
})
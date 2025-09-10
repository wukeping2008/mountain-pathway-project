import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import schoolsData from '@/data/schools.json'

export interface School {
  id: string
  name: string
  nameEn: string
  location: string
  tier: 'dream' | 'match' | 'safety'
  mountain: string
  altitude: number
  matchScore: number
  ranking: {
    world: number
    national?: number
    regional?: number
  }
  requirements: {
    gpa: number
    sat?: number
    alevel?: string
    toefl?: number
    ielts?: number
    activities: string
  }
  tags: string[]
  description: string
  color: string
  icon: string
}

export const useSchoolStore = defineStore('schools', () => {
  // State
  const schools = ref<School[]>([])
  const mountains = ref(schoolsData.mountains)
  const tiers = ref(schoolsData.tiers)

  // Getters
  const dreamSchools = computed(() => 
    schools.value.filter(s => s.tier === 'dream')
  )

  const matchSchools = computed(() => 
    schools.value.filter(s => s.tier === 'match')
  )

  const safetySchools = computed(() => 
    schools.value.filter(s => s.tier === 'safety')
  )

  // Actions
  function loadSchools() {
    schools.value = schoolsData.schools as School[]
  }

  function getSchoolsByMountain(mountain: string) {
    return schools.value.filter(s => s.mountain === mountain)
  }

  function getSchoolsByTier(tier: string) {
    return schools.value.filter(s => s.tier === tier)
  }

  function getSchoolById(id: string) {
    return schools.value.find(s => s.id === id)
  }

  function searchSchools(query: string) {
    const lowerQuery = query.toLowerCase()
    return schools.value.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.nameEn.toLowerCase().includes(lowerQuery) ||
      s.location.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  return {
    // State
    schools,
    mountains,
    tiers,
    // Getters
    dreamSchools,
    matchSchools,
    safetySchools,
    // Actions
    loadSchools,
    getSchoolsByMountain,
    getSchoolsByTier,
    getSchoolById,
    searchSchools
  }
})
export interface PMSSymptom {
	id: string
	name: string
	severity: 'mild' | 'moderate' | 'severe'
	date: string
}

export interface PMSCycleData {
	currentDay: number
	totalDays: number
	startDate: string
	nextPeriodDate: string
	symptoms: PMSSymptom[]
	lastUpdated: string
}

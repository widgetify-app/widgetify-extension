import moment from 'jalali-moment'

export const formatDate = (dateString: string) => {
	try {
		const date = new Date(dateString)
		return moment(date).locale('fa').format('HH:mm - jYYYY/jMM/jDD')
	} catch (e) {
		return dateString
	}
}

export const getSeverityColor = (severity: string) => {
	switch (severity) {
		case 'mild':
			return 'bg-green-500/20 text-green-500'
		case 'moderate':
			return 'bg-yellow-500/20 text-yellow-500'
		case 'severe':
			return 'bg-red-500/20 text-red-500'
		default:
			return 'bg-primary/10 text-primary'
	}
}

export const getSeverityLabel = (severity: string) => {
	switch (severity) {
		case 'mild':
			return 'خفیف'
		case 'moderate':
			return 'متوسط'
		case 'severe':
			return 'شدید'
		default:
			return severity
	}
}

export const daysUntilNextPeriod = (nextPeriodDate: string) => {
	if (!nextPeriodDate) return '?'
	const today = new Date()
	const nextPeriod = new Date(nextPeriodDate)
	const diffTime = nextPeriod.getTime() - today.getTime()
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return diffDays > 0 ? diffDays : 0
}

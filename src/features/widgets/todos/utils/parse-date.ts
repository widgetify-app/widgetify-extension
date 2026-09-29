import moment from 'jalali-moment'

export const parseTodoDate = (dateString: string) => {
	const isGregorian = dateString.includes('T') || dateString.startsWith('20')

	if (isGregorian) {
		return moment(dateString)
	} else {
		return moment(dateString, 'jYYYY-jMM-jDD')
	}
}

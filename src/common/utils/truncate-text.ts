export const truncateTitle = (title: string, maxLength = 60) => {
	if (title.length > maxLength) {
		return title.slice(0, maxLength - 3) + '...'
	}
	return title
}

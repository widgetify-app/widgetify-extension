export const getItemTypeEmoji = (type: string) => {
	switch (type) {
		case 'BROWSER_TITLE':
			return '🌐'
		case 'FONT':
			return '🔤'
		case 'THEME':
			return '🎨'
		default:
			return '📦'
	}
}

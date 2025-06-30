const getLuminance = (hex: string) => {
	const rgb = Number.parseInt(hex.replace('#', ''), 16)
	const r = (rgb >> 16) & 0xff
	const g = (rgb >> 8) & 0xff
	const b = rgb & 0xff
	return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255)
}

export const useContrastTextColor = (bgColor: string | undefined) => {
	if (!bgColor) return '#000000'
	const luminance = getLuminance(bgColor)
	if (luminance < 0.4) return '#FFFFFF'
	if (luminance > 0.8) return '#000000'
	return luminance < 0.5 ? '#FFFFFF' : '#000000'
}

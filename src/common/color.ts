export const addOpacityToColor = (color: string, opacity: number): string => {
	if (color.startsWith('rgba')) {
		return color.replace(/rgba\((.+?),\s*[\d.]+\)/, `rgba($1, ${opacity})`)
	}

	if (color.startsWith('rgb(')) {
		const rgb = color.match(/rgb\((.+?)\)/)?.[1]
		return rgb ? `rgba(${rgb}, ${opacity})` : color
	}

	const tempDiv = document.createElement('div')
	tempDiv.style.color = color
	document.body.appendChild(tempDiv)
	const computedColor = window.getComputedStyle(tempDiv).color
	document.body.removeChild(tempDiv)

	const rgbMatch = computedColor.match(/rgb\((.+?)\)/)
	return rgbMatch
		? `rgba(${rgbMatch[1]}, ${opacity})`
		: `${color}${Math.round(opacity * 255)
				.toString(16)
				.padStart(2, '0')}`
}

export function getContrastingTextColor(hex: string) {
	const cleaned = hex.replace('#', '').trim()
	const full =
		cleaned.length === 3
			? cleaned
					.split('')
					.map((c) => c + c)
					.join('')
			: cleaned

	const r = parseInt(full.slice(0, 2), 16)
	const g = parseInt(full.slice(2, 4), 16)
	const b = parseInt(full.slice(4, 6), 16)

	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

	return luminance > 0.6 ? '#0b0b0f' : '#ffffff'
}

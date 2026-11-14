import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'

export function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
) {
	const radius = Math.min(r, w / 2, h / 2)

	ctx.beginPath()
	ctx.moveTo(x + radius, y)
	ctx.lineTo(x + w - radius, y)
	ctx.arcTo(x + w, y, x + w, y + radius, radius)
	ctx.lineTo(x + w, y + h - radius)
	ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
	ctx.lineTo(x + radius, y + h)
	ctx.arcTo(x, y + h, x, y + h - radius, radius)
	ctx.lineTo(x, y + radius)
	ctx.arcTo(x, y, x + radius, y, radius)
	ctx.closePath()
}

function hexToRgb(hex: string) {
	const normalized = hex.replace('#', '')

	if (normalized.length !== 6) {
		return { r: 83, g: 109, b: 254 }
	}

	return {
		r: Number.parseInt(normalized.slice(0, 2), 16),
		g: Number.parseInt(normalized.slice(2, 4), 16),
		b: Number.parseInt(normalized.slice(4, 6), 16),
	}
}

export function rgba(color: string, alpha: number) {
	const { r, g, b } = hexToRgb(color)
	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
	let result = text

	while (result.length > 0 && ctx.measureText(result).width > maxWidth) {
		result = result.slice(0, -1)
	}

	if (result !== text) {
		return `${result.trim()}…`
	}

	return result
}

export async function copyCanvasToClipboard(
	canvas: HTMLCanvasElement | null
): Promise<boolean> {
	if (!canvas) return false

	return new Promise((resolve) => {
		canvas.toBlob(
			async (blob) => {
				if (!blob) {
					showToast(t('widgets.canvas.imageBuildFailed'), 'error')
					resolve(false)
					return
				}

				try {
					await navigator.clipboard.write([
						new ClipboardItem({
							'image/png': blob,
						}),
					])
					showToast(t('widgets.canvas.imageCopied'), 'success')
					resolve(true)
				} catch {
					showToast(t('widgets.canvas.imageCopyDenied'), 'warning')
					resolve(false)
				}
			},
			'image/png',
			1
		)
	})
}

export function downloadCanvasAsImage(
	canvas: HTMLCanvasElement | null,
	filename: string
): boolean {
	if (!canvas) return false

	try {
		const dataUrl = canvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.download = filename.endsWith('.png') ? filename : `${filename}.png`
		link.href = dataUrl
		link.click()
		showToast(t('widgets.canvas.imageDownloaded'), 'success')
		return true
	} catch {
		showToast(t('widgets.canvas.imageDownloadFailed'), 'error')
		return false
	}
}

export function mixColor(from: string, to: string, amount: number) {
	const start = hexToRgb(from)
	const end = hexToRgb(to)

	const channel = (first: number, second: number) =>
		Math.round(first + (second - first) * amount)
			.toString(16)
			.padStart(2, '0')

	return `#${channel(start.r, end.r)}${channel(start.g, end.g)}${channel(start.b, end.b)}`
}

function hueChannel(p: number, q: number, hue: number) {
	const wrapped = ((hue % 1) + 1) % 1

	if (wrapped < 1 / 6) return p + (q - p) * 6 * wrapped
	if (wrapped < 1 / 2) return q
	if (wrapped < 2 / 3) return p + (q - p) * (2 / 3 - wrapped) * 6

	return p
}

export function tintColor(
	hex: string,
	hueShift: number,
	lightnessShift: number,
	saturationScale: number
) {
	const { r, g, b } = hexToRgb(hex)
	const red = r / 255
	const green = g / 255
	const blue = b / 255
	const max = Math.max(red, green, blue)
	const min = Math.min(red, green, blue)
	const delta = max - min
	let hue = 0

	if (delta !== 0) {
		if (max === red) hue = ((green - blue) / delta) % 6
		else if (max === green) hue = (blue - red) / delta + 2
		else hue = (red - green) / delta + 4
	}

	const baseLightness = (max + min) / 2
	const baseSaturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * baseLightness - 1))
	const lightness = Math.min(Math.max(baseLightness + lightnessShift, 0), 1)
	const saturation = Math.min(Math.max(baseSaturation * saturationScale, 0), 1)
	const newHue = (hue * 60 + hueShift) / 360

	const q =
		lightness < 0.5
			? lightness * (1 + saturation)
			: lightness + saturation - lightness * saturation

	const p = 2 * lightness - q

	const channel = (offset: number) =>
		Math.round(hueChannel(p, q, newHue + offset) * 255)
			.toString(16)
			.padStart(2, '0')

	return `#${channel(1 / 3)}${channel(0)}${channel(-1 / 3)}`
}

export function isLightColor(hex: string) {
	const { r, g, b } = hexToRgb(hex)

	return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62
}

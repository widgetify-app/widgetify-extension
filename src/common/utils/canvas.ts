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

export function hexToRgb(hex: string) {
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
					showToast('خطا در ایجاد تصویر', 'error')
					resolve(false)
					return
				}

				try {
					await navigator.clipboard.write([
						new ClipboardItem({
							'image/png': blob,
						}),
					])
					showToast('تصویر در کلیپ‌بورد کپی شد', 'success')
					resolve(true)
				} catch {
					showToast(
						'امکان کپی خودکار در مرورگر وجود ندارد، تصویر را ذخیره کن',
						'warning'
					)
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
		showToast('تصویر با موفقیت ذخیره شد', 'success')
		return true
	} catch {
		showToast('خطا در دانلود تصویر', 'error')
		return false
	}
}

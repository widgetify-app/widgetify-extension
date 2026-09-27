import type { MoodStatsResponse } from '@/services/hooks/mood-log/get-mood-stats.hook'
import { drawRoundedRect, fitText } from '@/common/utils/canvas'

const W = 1080
const H = 1350
const BG_BASE = '#05050a'
const TEXT_LIGHT = '#f8fafc'
const FONT_STACK = 'Vazir, Tahoma, Arial, sans-serif'

const moodConfig: Record<string, { label: string; emoji: string; colors: string[] }> = {
	excited: {
		label: 'سرحال',
		emoji: '😄',
		colors: ['#00ff87', '#60efff'],
	},
	happy: {
		label: 'اوکی',
		emoji: '🙂',
		colors: ['#00f2fe', '#4facfe'],
	},
	normal: {
		label: 'خسته',
		emoji: '😴',
		colors: ['#ffb020', '#e69500'],
	},
	tired: {
		label: 'خسته',
		emoji: '😴',
		colors: ['#ffb020', '#e69500'],
	},
	sad: {
		label: 'ناراحت',
		emoji: '😔',
		colors: ['#ff4a5a', '#ff1f36'],
	},
}

function getPersianDate(date: Date): { year: number; month: number; day: number } {
	const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
		timeZone: 'Asia/Tehran',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	}).formatToParts(date)

	const pMap = Object.fromEntries(parts.map((p) => [p.type, p.value]))
	return {
		year: Number.parseInt(pMap.year, 10),
		month: Number.parseInt(pMap.month, 10),
		day: Number.parseInt(pMap.day, 10),
	}
}

function getPersianMonthName(date: Date): string {
	return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
		timeZone: 'Asia/Tehran',
		month: 'long',
	}).format(date)
}

function wrapText(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number
): string[] {
	const words = text.split(' ')
	const lines: string[] = []
	let currentLine = words[0] || ''

	for (let i = 1; i < words.length; i++) {
		const word = words[i]
		const testLine = `${currentLine} ${word}`
		const width = ctx.measureText(testLine).width
		if (width < maxWidth) {
			currentLine = testLine
		} else {
			lines.push(currentLine)
			currentLine = word
		}
	}
	if (currentLine) {
		lines.push(currentLine)
	}
	return lines
}

function loadImageAsync(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => resolve(img)
		img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
		img.src = src
	})
}

export async function renderMoodShareCanvas(
	canvas: HTMLCanvasElement | null,
	data: MoodStatsResponse,
	userNameDefault?: string
) {
	if (!canvas) return

	const ctx = canvas.getContext('2d')
	if (!ctx) return

	canvas.width = W
	canvas.height = H

	const logs = data.logs || []
	const counts: Record<string, number> = {
		excited: 0,
		happy: 0,
		normal: 0,
		sad: 0,
	}

	for (const log of logs) {
		const key = log.mood === 'tired' ? 'normal' : log.mood
		if (counts[key] !== undefined) {
			counts[key]++
		}
	}

	const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'happy'

	const dominantMoodConfig = moodConfig[dominant] || moodConfig.happy
	const dominantColor = dominantMoodConfig.colors[0]

	const now = new Date()
	const currentPersian = getPersianDate(now)
	const monthNumber = data.currentJalaliMonth || currentPersian.month
	const monthName = data.currentJalaliMonthName || getPersianMonthName(now)
	const daysInMonth = monthNumber <= 6 ? 31 : monthNumber <= 11 ? 30 : 29
	const total = logs.length
	const progress = Math.min(total / daysInMonth, 1)

	ctx.fillStyle = BG_BASE
	ctx.fillRect(0, 0, W, H)

	ctx.save()
	const glow = ctx.createRadialGradient(W / 2, H / 3, 20, W / 2, H / 3, 520)
	glow.addColorStop(0, `${dominantColor}24`)
	glow.addColorStop(1, 'rgba(0,0,0,0)')
	ctx.fillStyle = glow
	ctx.fillRect(0, 0, W, H)
	ctx.restore()

	ctx.save()
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font = `bold 280px ${FONT_STACK}`
	ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
	ctx.fillText(monthName, W / 2, 400)
	ctx.restore()

	const avatarX = W - 185
	const centerX = avatarX + 45
	const centerY = 140

	ctx.save()
	ctx.beginPath()
	ctx.arc(centerX, centerY, 46, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress)
	ctx.strokeStyle = `${dominantColor}B3`
	ctx.lineWidth = 4
	ctx.shadowColor = dominantColor
	ctx.shadowBlur = 6
	ctx.stroke()
	ctx.restore()

	if (data.userAvatar) {
		try {
			const avatarImg = await loadImageAsync(data.userAvatar)
			ctx.save()
			ctx.beginPath()
			ctx.arc(centerX, centerY, 45, 0, Math.PI * 2)
			ctx.clip()
			ctx.drawImage(avatarImg, avatarX, 95, 90, 90)
			ctx.restore()
		} catch {
			drawDefaultAvatar(ctx, centerX, centerY, dominantColor)
		}
	} else {
		drawDefaultAvatar(ctx, centerX, centerY, dominantColor)
	}

	const userName =
		(data.userName || userNameDefault || 'کاربر عزیز').trim() || 'کاربر عزیز'

	ctx.save()
	ctx.textAlign = 'right'
	ctx.fillStyle = TEXT_LIGHT
	ctx.font = `bold 38px ${FONT_STACK}`
	ctx.fillText(fitText(ctx, userName, 450), avatarX - 25, 135)
	ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
	ctx.font = `24px ${FONT_STACK}`
	ctx.fillText(`حس و حال ثبت شده در ماه ${monthName}`, avatarX - 25, 175)
	ctx.restore()

	ctx.save()
	ctx.textAlign = 'center'
	ctx.font = '140px sans-serif'
	ctx.fillText(dominantMoodConfig.emoji, W / 2, 430)
	ctx.restore()

	ctx.save()
	ctx.textAlign = 'center'
	ctx.font = `bold 54px ${FONT_STACK}`
	ctx.fillStyle = TEXT_LIGHT
	ctx.fillText(dominantMoodConfig.label, W / 2, 530)
	ctx.restore()

	const badge = data.badge || {
		label: dominant === 'excited' ? 'روی موج بودم 🌊' : 'آروم بودم، خوب بودم 🌿',
		color: dominant === 'excited' ? '#00ff87' : '#00f2fe',
	}

	ctx.save()
	ctx.strokeStyle = `${badge.color}30`
	ctx.lineWidth = 2
	const badgeX = 120
	const badgeY = 115
	const badgeW = 280
	const badgeH = 50
	drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 25)
	ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
	ctx.fill()
	ctx.stroke()
	ctx.fillStyle = `${badge.color}CC`
	ctx.textAlign = 'center'
	ctx.font = `20px ${FONT_STACK}`
	ctx.fillText(badge.label, badgeX + badgeW / 2, badgeY + 32)
	ctx.restore()

	const chartX = 160
	const chartY = 640
	const chartW = W - 320

	ctx.save()
	ctx.textAlign = 'center'
	ctx.font = `20px ${FONT_STACK}`
	const legendEntries = [
		moodConfig.excited,
		moodConfig.happy,
		moodConfig.normal,
		moodConfig.sad,
	]
	const itemW = 150
	const totalW = legendEntries.length * itemW
	const startLegendX = (W - totalW) / 2

	legendEntries.forEach((value, idx) => {
		const x = startLegendX + idx * itemW + 75
		ctx.fillStyle = `${value.colors[0]}CC`
		ctx.beginPath()
		ctx.arc(x - 10, chartY - 38, 6, 0, Math.PI * 2)
		ctx.fill()
		ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
		ctx.fillText(value.label, x - 50, chartY - 33)
	})
	ctx.restore()

	const dayMoodMap = new Map<number, string>()
	for (const log of logs) {
		const logDate = log.date instanceof Date ? log.date : new Date(log.date)
		const p = getPersianDate(logDate)
		if (p.month === monthNumber) {
			dayMoodMap.set(p.day, log.mood === 'tired' ? 'normal' : log.mood)
		}
	}

	const gridCols = 7
	const gridRows = Math.ceil(daysInMonth / gridCols)
	const gridGap = 14
	const maxGridHeight = 360

	const cellByWidth = (chartW - gridGap * (gridCols - 1)) / gridCols
	const cellByHeight = (maxGridHeight - gridGap * (gridRows - 1)) / gridRows
	const cellSize = Math.min(cellByWidth, cellByHeight)
	const gridWidthUsed = gridCols * cellSize + gridGap * (gridCols - 1)
	const gridStartX = chartX + (chartW - gridWidthUsed) / 2
	const gridStartY = chartY

	ctx.save()
	for (let day = 1; day <= daysInMonth; day++) {
		const idx = day - 1
		const col = idx % gridCols
		const row = Math.floor(idx / gridCols)

		const x = gridStartX + (gridCols - 1 - col) * (cellSize + gridGap)
		const y = gridStartY + row * (cellSize + gridGap)

		const mood = dayMoodMap.get(day)
		drawRoundedRect(ctx, x, y, cellSize, cellSize, 18)

		if (mood) {
			const color = (moodConfig[mood] || moodConfig.happy).colors[0]
			ctx.shadowColor = `${color}80`
			ctx.shadowBlur = 12
			ctx.fillStyle = `${color}CC`
			ctx.fill()
			ctx.shadowBlur = 0
		} else {
			ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
			ctx.fill()
		}
	}
	ctx.restore()

	const insightText =
		data.insightText && data.insightText.trim().length > 0
			? data.insightText.trim()
			: `${userName} جان این آرامشی که داشتی واقعیه! نه ساختگی نه اجباری، از دل میومد`

	ctx.save()
	ctx.textAlign = 'center'
	ctx.font = `italic 32px ${FONT_STACK}`
	ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
	wrapText(ctx, insightText, W - 260).forEach((line, i) =>
		ctx.fillText(line, W / 2, 1120 + i * 48)
	)
	ctx.restore()

	ctx.save()
	ctx.textAlign = 'center'
	ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
	ctx.font = `22px ${FONT_STACK}`
	ctx.fillText('افزونه مرورگر ویجتیفای - widgetify.ir', W / 2, H - 45)
	ctx.restore()
}

function drawDefaultAvatar(
	ctx: CanvasRenderingContext2D,
	cx: number,
	cy: number,
	accentColor: string
) {
	ctx.save()
	ctx.beginPath()
	ctx.arc(cx, cy, 45, 0, Math.PI * 2)
	ctx.fillStyle = `${accentColor}30`
	ctx.fill()
	ctx.fillStyle = '#ffffff'
	ctx.font = '28px sans-serif'
	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.fillText('👤', cx, cy)
	ctx.restore()
}

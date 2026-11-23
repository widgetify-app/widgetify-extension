import excitedMascot from '@/assets/images/share/mascot-excited.webp'
import happyMascot from '@/assets/images/share/mascot-happy.webp'
import sleepMascot from '@/assets/images/share/mascot-sleep.webp'
import tiredMascot from '@/assets/images/share/mascot-tired.webp'
import { type MessageKey, t } from '@/common/i18n'
import { nowDate } from '@/common/utils/trusted-time'
import { drawRoundedRect, fitText, mixColor } from '@/features/widgets/utils/canvas'
import {
	drawShareBackground,
	drawShareFooter,
	drawShareGlow,
	drawShareText,
	loadShareAvatar,
	loadShareFonts,
	prepareShareCanvas,
	SHARE_CENTER_X,
	SHARE_DARK_INK,
	SHARE_LIGHT_INK,
	shareFont,
	loadImage,
	toPersianDigits,
} from '@/features/widgets/utils/share-card'
import type { MoodStatsResponse } from '@/services/mood-log/get-mood-stats.hook'
import {
	MOOD_ORDER,
	type Mood,
	type MonthDay,
	moodShareMonth,
	tehranDay,
} from './mood-share-month'
import { JALALI_MONTH_KEYS } from './share-month'

const MOOD_LOOKS: Record<Mood, { mascot: string; color: string }> = {
	excited: { mascot: excitedMascot, color: '#00d390' },
	happy: { mascot: happyMascot, color: '#7c8df0' },
	normal: { mascot: sleepMascot, color: '#fcb700' },
	sad: { mascot: tiredMascot, color: '#ff627d' },
}

const SOFT_INK = '#6b6b76'
const HINT_INK = '#a6a6b0'
const MISSED_DAY = '#f0f0f4'
const FUTURE_DAY = '#e3e3ea'
const CARD = { left: 48, top: 64, width: 336, height: 420, radius: 26 }
const AVATAR = { centerY: 64, ring: 26.4, white: 23.2, picture: 20 }
const NAME_CENTER_Y = 109
const MAP = { top: 134, square: 36.8, gap: 5.6, radius: 12.8, columns: 7 }
const LEGEND = { centerY: 354, dot: 3.2, dotGap: 4, itemGap: 24, size: 10.4 }
const MASCOT = { left: 64, centerY: 390, width: 64 }
const TEXT_RIGHT = 360
const LABEL_WIDTH = 224
const LABEL_LARGEST = 32
const LABEL_SMALLEST = 22
const EYEBROW_CENTER_Y = 388
const LABEL_CENTER_Y = 419
const LINE_CENTER_Y = 453

const LABELS: Record<Mood, MessageKey> = {
	excited: 'widgets.moodTracker.share.canvas.label.excited',
	happy: 'widgets.moodTracker.share.canvas.label.happy',
	normal: 'widgets.moodTracker.share.canvas.label.normal',
	sad: 'widgets.moodTracker.share.canvas.label.sad',
}

const WORDS: Record<Mood, MessageKey> = {
	excited: 'widgets.moodTracker.share.canvas.word.excited',
	happy: 'widgets.moodTracker.share.canvas.word.happy',
	normal: 'widgets.moodTracker.share.canvas.word.normal',
	sad: 'widgets.moodTracker.share.canvas.word.sad',
}

interface RenderMoodShareCanvasOptions {
	stats: MoodStatsResponse
	year: number
	month: number
	userName: string | undefined
	userAvatar: string | undefined
}

function deviceScale(ctx: CanvasRenderingContext2D): number {
	return ctx.getTransform().a
}

function fillCircle(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	radius: number,
	color: string
) {
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
	ctx.fill()
}

function drawCard(ctx: CanvasRenderingContext2D) {
	const scale = deviceScale(ctx)

	ctx.save()
	ctx.shadowColor = '#00000033'
	ctx.shadowBlur = 20 * scale
	ctx.shadowOffsetY = 12 * scale
	ctx.fillStyle = SHARE_LIGHT_INK
	drawRoundedRect(ctx, CARD.left, CARD.top, CARD.width, CARD.height, CARD.radius)
	ctx.fill()
	ctx.restore()
}

async function drawPerson(
	ctx: CanvasRenderingContext2D,
	name: string,
	avatar: string,
	accent: string
) {
	const person = name.trim() || t('widgets.canvas.userFallback')
	const picture = await loadShareAvatar(avatar, person)

	fillCircle(ctx, SHARE_CENTER_X, AVATAR.centerY, AVATAR.ring, accent)
	fillCircle(ctx, SHARE_CENTER_X, AVATAR.centerY, AVATAR.white, SHARE_LIGHT_INK)

	ctx.save()
	ctx.beginPath()
	ctx.arc(SHARE_CENTER_X, AVATAR.centerY, AVATAR.picture, 0, Math.PI * 2)
	ctx.clip()

	ctx.drawImage(
		picture,
		SHARE_CENTER_X - AVATAR.picture,
		AVATAR.centerY - AVATAR.picture,
		AVATAR.picture * 2,
		AVATAR.picture * 2
	)

	ctx.restore()

	ctx.font = shareFont(700, 14.4)

	drawShareText(
		ctx,
		fitText(ctx, person, CARD.width - 48),
		SHARE_CENTER_X,
		NAME_CENTER_Y,
		{
			weight: 700,
			size: 14.4,
			color: SOFT_INK,
			align: 'center',
		}
	)
}

function drawLoggedTile(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	color: string
) {
	const { square, radius } = MAP
	const scale = deviceScale(ctx)
	const shade = ctx.createLinearGradient(0, y, 0, y + square)

	shade.addColorStop(0, mixColor(color, SHARE_LIGHT_INK, 0.22))
	shade.addColorStop(1, color)

	ctx.save()
	ctx.shadowColor = `${color}73`
	ctx.shadowBlur = 8 * scale
	ctx.shadowOffsetY = 3 * scale
	ctx.fillStyle = shade
	drawRoundedRect(ctx, x, y, square, square, radius)
	ctx.fill()
	ctx.restore()

	ctx.save()
	ctx.globalAlpha = 0.35
	ctx.fillStyle = SHARE_LIGHT_INK
	drawRoundedRect(ctx, x + 6.4, y + 4, square - 12.8, 5.6, 2.8)
	ctx.fill()
	ctx.restore()
}

function drawTile(ctx: CanvasRenderingContext2D, day: MonthDay, x: number, y: number) {
	const { square, radius } = MAP

	if (day.mood) {
		drawLoggedTile(ctx, x, y, MOOD_LOOKS[day.mood].color)

		return
	}

	if (day.state === 'future') {
		ctx.strokeStyle = FUTURE_DAY
		ctx.lineWidth = 1.2
		ctx.setLineDash([3.6, 2.4])
		drawRoundedRect(ctx, x + 0.6, y + 0.6, square - 1.2, square - 1.2, radius - 0.6)
		ctx.stroke()
		ctx.setLineDash([])

		return
	}

	ctx.fillStyle = MISSED_DAY
	drawRoundedRect(ctx, x, y, square, square, radius)
	ctx.fill()
}

function drawMap(ctx: CanvasRenderingContext2D, days: MonthDay[]) {
	const { square, gap, columns, top } = MAP
	const width = columns * square + (columns - 1) * gap
	const right = SHARE_CENTER_X + width / 2

	days.forEach((day, index) => {
		const column = index % columns
		const row = Math.floor(index / columns)
		const x = right - column * (square + gap) - square
		const y = top + row * (square + gap)

		drawTile(ctx, day, x, y)
	})
}

function drawLegend(ctx: CanvasRenderingContext2D) {
	ctx.font = shareFont(700, LEGEND.size)

	const items = MOOD_ORDER.map((mood) => {
		const word = t(WORDS[mood])
		const width = LEGEND.dot * 2 + LEGEND.dotGap + ctx.measureText(word).width

		return { mood, word, width }
	})

	const total =
		items.reduce((sum, item) => sum + item.width, 0) +
		(items.length - 1) * LEGEND.itemGap

	let right = SHARE_CENTER_X + total / 2

	for (const item of items) {
		fillCircle(
			ctx,
			right - LEGEND.dot,
			LEGEND.centerY,
			LEGEND.dot,
			MOOD_LOOKS[item.mood].color
		)

		drawShareText(
			ctx,
			item.word,
			right - LEGEND.dot * 2 - LEGEND.dotGap,
			LEGEND.centerY,
			{ weight: 700, size: LEGEND.size, color: HINT_INK, align: 'right' }
		)

		right -= item.width + LEGEND.itemGap
	}
}

async function drawMascot(ctx: CanvasRenderingContext2D, mood: Mood) {
	const mascot = await loadImage(MOOD_LOOKS[mood].mascot)
	const height = (MASCOT.width * mascot.height) / mascot.width

	ctx.drawImage(mascot, MASCOT.left, MASCOT.centerY - height / 2, MASCOT.width, height)
}

function fittingSize(ctx: CanvasRenderingContext2D, label: string): number {
	let size = LABEL_LARGEST

	ctx.font = shareFont(900, size)

	while (size > LABEL_SMALLEST && ctx.measureText(label).width > LABEL_WIDTH) {
		size -= 1
		ctx.font = shareFont(900, size)
	}

	return size
}

function drawWords(
	ctx: CanvasRenderingContext2D,
	monthNumber: number,
	accent: Mood,
	count: number,
	logged: number
) {
	const eyebrow = t('widgets.moodTracker.share.canvas.heading', {
		month: t(JALALI_MONTH_KEYS[monthNumber - 1]),
	})

	drawShareText(ctx, eyebrow, TEXT_RIGHT, EYEBROW_CENTER_Y, {
		weight: 700,
		size: 12.8,
		color: SOFT_INK,
		align: 'right',
	})

	const label =
		logged > 0 ? t(LABELS[accent]) : t('widgets.moodTracker.share.canvas.empty')

	const labelSize = fittingSize(ctx, label)

	ctx.font = shareFont(900, labelSize)

	drawShareText(ctx, fitText(ctx, label, LABEL_WIDTH), TEXT_RIGHT, LABEL_CENTER_Y, {
		weight: 900,
		size: labelSize,
		color: SHARE_DARK_INK,
		align: 'right',
	})

	if (logged === 0) return

	const line = t('widgets.moodTracker.share.canvas.line', {
		count: toPersianDigits(count),
		total: toPersianDigits(logged),
		mood: t(WORDS[accent]),
	})

	drawShareText(ctx, line, TEXT_RIGHT, LINE_CENTER_Y, {
		weight: 700,
		size: 13.6,
		color: mixColor(MOOD_LOOKS[accent].color, SHARE_DARK_INK, 0.4),
		align: 'right',
	})
}

export async function renderMoodShareCanvas(
	canvas: HTMLCanvasElement,
	options: RenderMoodShareCanvasOptions
) {
	const ctx = prepareShareCanvas(canvas)

	if (!ctx) throw new Error('Canvas is unavailable')

	const { stats, year, month: monthNumber } = options
	const summary = moodShareMonth(
		stats.logs,
		{ year, month: monthNumber },
		tehranDay(nowDate())
	)
	const accent = MOOD_LOOKS[summary.accent].color

	await loadShareFonts()

	drawShareBackground(ctx, accent)
	await drawShareGlow(ctx)
	drawCard(ctx)

	await drawPerson(
		ctx,
		options.userName || stats.userName || '',
		options.userAvatar || stats.userAvatar || '',
		accent
	)

	drawMap(ctx, summary.days)
	drawLegend(ctx)
	await drawMascot(ctx, summary.accent)

	drawWords(
		ctx,
		monthNumber,
		summary.accent,
		summary.counts[summary.accent],
		summary.logged
	)

	await drawShareFooter(ctx, SHARE_LIGHT_INK)
}

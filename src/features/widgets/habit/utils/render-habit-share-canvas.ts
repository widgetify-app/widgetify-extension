import { t } from '@/common/i18n'
import {
	drawRoundedRect,
	fitText,
	isLightColor,
	mixColor,
	rgba,
	tintColor,
} from '@/features/widgets/utils/canvas'
import { DEFAULT_HABIT_COLOR } from '../constants'
import type { HabitShareData } from './habit-share'

const WIDTH = 540
const HEIGHT = 960
const OUTPUT_SCALE = 2
const MARGIN = 40
const LIGHT_INK = '#ffffff'
const DARK_INK = '#1b1e3b'
const FONT_STACK = 'Vazir, Tahoma, Arial, sans-serif'
const EMOJI_STACK =
	'"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
const CELL_SIZE = 12
const CELL_STEP = 15.2
const EMPTY_CELL = 0.16
const CELL_LEVELS = [0.35, 0.55, 0.78, 1]
const SOFT_TEXT = 0.82
const GRID_RIGHT = 476
const GRID_TOP = 690
const FLAME_OUTER =
	'M50 4 C54 20 64 28 66 38 C70 30 72 24 70 18 C84 30 90 50 90 70 C90 96 72 114 50 114 C28 114 10 96 10 70 C10 52 20 38 30 28 C30 38 34 44 40 46 C36 32 40 16 50 4 Z'
const FLAME_INNER =
	'M50 64 C54 74 64 78 64 91 C64 102 58 108 50 108 C42 108 36 102 36 91 C36 80 44 76 50 64 Z'
const FLAME_SCALE = 1.8
const FLAME_LEFT = 180
const FLAME_TOP = 190

interface Palette {
	ink: string
	top: string
	bottom: string
	flameTop: string
	flameBottom: string
}

interface RenderHabitShareCanvasOptions {
	title: string
	emoji: string | null
	goal: string
	color: string | undefined
	data: HabitShareData
}

function paletteFor(accent: string): Palette {
	const isLight = isLightColor(accent)

	return {
		ink: isLight ? DARK_INK : LIGHT_INK,
		top: tintColor(accent, 24, 0, 0.95),
		bottom: tintColor(accent, -5, -0.1, 0.87),
		flameTop: isLight
			? accent
			: mixColor(tintColor(accent, 24, 0, 0.95), '#ffffff', 0.7),
		flameBottom: isLight ? mixColor(accent, '#000000', 0.4) : accent,
	}
}

function drawGlow(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number,
	alpha: number
) {
	const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)

	glow.addColorStop(0, rgba(LIGHT_INK, alpha))
	glow.addColorStop(1, rgba(LIGHT_INK, 0))
	ctx.fillStyle = glow
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2)
	ctx.fill()
}

function drawBackground(ctx: CanvasRenderingContext2D, palette: Palette) {
	const base = ctx.createLinearGradient(WIDTH * 0.2, 0, WIDTH * 0.8, HEIGHT)

	base.addColorStop(0, palette.top)
	base.addColorStop(1, palette.bottom)
	ctx.fillStyle = base
	ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

function drawChip(
	ctx: CanvasRenderingContext2D,
	palette: Palette,
	options: RenderHabitShareCanvasOptions
) {
	const emojiWidth = 32
	const gap = 10
	const padding = 24

	ctx.font = `bold 22px ${FONT_STACK}`

	const title = fitText(
		ctx,
		options.title || t('widgets.habit.share.canvas.myHabit'),
		WIDTH - 2 * MARGIN - emojiWidth - gap - 2 * padding
	)

	const titleWidth = ctx.measureText(title).width
	const chipWidth = padding + titleWidth + gap + emojiWidth + padding
	const chipLeft = (WIDTH - chipWidth) / 2

	ctx.fillStyle = rgba(palette.ink, 0.18)
	drawRoundedRect(ctx, chipLeft, 52, chipWidth, 52, 26)
	ctx.fill()

	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'
	ctx.font = `28px ${EMOJI_STACK}`
	ctx.fillStyle = LIGHT_INK

	ctx.fillText(
		options.emoji || '🎯',
		chipLeft + chipWidth - padding - emojiWidth / 2,
		80
	)

	ctx.textAlign = 'right'
	ctx.font = `bold 22px ${FONT_STACK}`
	ctx.fillStyle = palette.ink
	ctx.fillText(title, chipLeft + chipWidth - padding - emojiWidth - gap, 80)

	ctx.textAlign = 'center'
	ctx.font = `15px ${FONT_STACK}`
	ctx.fillStyle = rgba(palette.ink, SOFT_TEXT)
	ctx.fillText(fitText(ctx, options.goal, WIDTH - 2 * MARGIN), 270, 134)
}

function drawFlame(ctx: CanvasRenderingContext2D, palette: Palette, alpha: number) {
	ctx.save()
	ctx.globalAlpha = alpha

	drawGlow(ctx, 270, 300, 190, 0.3)

	ctx.translate(FLAME_LEFT, FLAME_TOP)
	ctx.scale(FLAME_SCALE, FLAME_SCALE)

	const body = ctx.createLinearGradient(0, 4, 0, 114)

	body.addColorStop(0, palette.flameTop)
	body.addColorStop(1, palette.flameBottom)
	ctx.fillStyle = body
	ctx.fill(new Path2D(FLAME_OUTER))

	ctx.fillStyle = LIGHT_INK
	ctx.fill(new Path2D(FLAME_INNER))
	ctx.restore()
}

function drawStreak(ctx: CanvasRenderingContext2D, palette: Palette, streak: number) {
	ctx.textAlign = 'center'
	ctx.textBaseline = 'alphabetic'

	if (streak <= 0) {
		drawFlame(ctx, palette, 0.45)
		ctx.font = `bold 34px ${FONT_STACK}`
		ctx.fillStyle = palette.ink
		ctx.fillText(t('widgets.habit.share.canvas.streakZero'), 270, 520)

		return
	}

	drawFlame(ctx, palette, 1)

	const text = String(streak)
	const maxWidth = WIDTH - 2 * MARGIN

	ctx.font = `bold 150px ${FONT_STACK}`

	const fontSize = Math.min(150, (150 * maxWidth) / ctx.measureText(text).width)

	ctx.font = `bold ${fontSize}px ${FONT_STACK}`
	ctx.fillStyle = palette.ink
	ctx.fillText(text, 270, 520)

	ctx.font = `bold 26px ${FONT_STACK}`
	ctx.fillStyle = rgba(palette.ink, SOFT_TEXT)
	ctx.fillText(t('widgets.habit.share.canvas.streakDays'), 270, 566)
}

function drawHeatmap(
	ctx: CanvasRenderingContext2D,
	palette: Palette,
	data: HabitShareData
) {
	ctx.fillStyle = rgba(palette.ink, 0.14)
	drawRoundedRect(ctx, MARGIN, 640, WIDTH - 2 * MARGIN, 168, 24)
	ctx.fill()

	ctx.textBaseline = 'middle'
	ctx.font = `bold 14px ${FONT_STACK}`
	ctx.textAlign = 'right'
	ctx.fillStyle = palette.ink
	ctx.fillText(t('widgets.habit.share.canvas.recentActivity'), WIDTH - MARGIN - 20, 672)

	ctx.font = `13px ${FONT_STACK}`
	ctx.textAlign = 'left'
	ctx.fillStyle = rgba(palette.ink, SOFT_TEXT)

	ctx.fillText(
		t('widgets.habit.share.canvas.successDays', { p0: data.doneDays }),
		MARGIN + 20,
		672
	)

	data.weeks.forEach((week, weekIndex) => {
		const x = GRID_RIGHT - weekIndex * CELL_STEP - CELL_SIZE

		week.forEach((day, row) => {
			if (day.isFuture) return

			const alpha = day.level === 0 ? EMPTY_CELL : CELL_LEVELS[day.level - 1]

			ctx.fillStyle = rgba(palette.ink, alpha)
			drawRoundedRect(ctx, x, GRID_TOP + row * CELL_STEP, CELL_SIZE, CELL_SIZE, 3.5)
			ctx.fill()
		})
	})
}

function drawFooter(ctx: CanvasRenderingContext2D, palette: Palette) {
	ctx.textAlign = 'center'
	ctx.textBaseline = 'alphabetic'
	ctx.font = `15px ${FONT_STACK}`
	ctx.fillStyle = rgba(palette.ink, SOFT_TEXT)
	ctx.fillText(t('widgets.habit.share.canvas.tagline'), 270, 880)

	ctx.font = `bold 20px ${FONT_STACK}`
	ctx.fillStyle = palette.ink
	ctx.fillText(t('widgets.habit.share.canvas.brand'), 270, 912)
}

export function renderHabitShareCanvas(
	canvas: HTMLCanvasElement | null,
	options: RenderHabitShareCanvasOptions
) {
	if (!canvas) return

	const ctx = canvas.getContext('2d')

	if (!ctx) return

	canvas.width = WIDTH * OUTPUT_SCALE
	canvas.height = HEIGHT * OUTPUT_SCALE
	ctx.scale(OUTPUT_SCALE, OUTPUT_SCALE)

	const palette = paletteFor(options.color || DEFAULT_HABIT_COLOR)

	drawBackground(ctx, palette)
	drawChip(ctx, palette, options)
	drawStreak(ctx, palette, options.data.streak)
	drawHeatmap(ctx, palette, options.data)
	drawFooter(ctx, palette)
}

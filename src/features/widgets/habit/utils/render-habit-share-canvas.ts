import flameImage from '@/assets/images/share/flame.webp'
import { t } from '@/common/i18n'
import { drawRoundedRect, fitText, mixColor } from '@/features/widgets/utils/canvas'
import {
	drawShareBackground,
	drawShareFooter,
	drawShareGloss,
	drawShareGlow,
	drawShareText,
	loadImage,
	loadShareAvatar,
	loadShareFonts,
	loadShareGloss,
	prepareShareCanvas,
	SHARE_CENTER_X,
	SHARE_LIGHT_INK,
	shareEmojiFont,
	shareFont,
	toPersianDigits,
} from '@/features/widgets/utils/share-card'
import { DEFAULT_HABIT_COLOR } from '../constants'
import type { HabitShareData, ShareDayState } from './habit-share'

const NIGHT = '#15151c'
const QUIET_INK = '#9a9aa5'
const OPEN_DAY = '#24242e'
const FUTURE_DAY = '#2e2e3a'
const GLOW_STRENGTH = 0.55
const NUMBER_LIGHTNESS = 0.25
const CARD = { left: 48, top: 48, width: 336, height: 448, radius: 26 }
const CARD_GLOW = { centerY: 180, radius: 180 }
const HEADER_CENTER_Y = 84.2
const PERSON = {
	avatarCenterX: 84.2,
	ring: 15.2,
	white: 13.2,
	picture: 11,
	nameLeft: 107.4,
}
const TITLE_RIGHT = 356
const HEADER_SIZE = 13.6
const FLAME = { top: 128, size: 80, faded: 0.4 }
const STREAK = { centerY: 258, size: 80 }
const LABEL = { centerY: 316, size: 21.6 }
const BEADS = { top: 351, right: 329.2, radius: 8.8, step: 23.2, perRow: 10 }
const MONTH_LINE_CENTER_Y = 464
const DEFAULT_EMOJI = '🎯'

interface RenderHabitShareCanvasOptions {
	title: string
	emoji: string | null
	color: string | undefined
	userName: string | undefined
	userAvatar: string | undefined
	data: HabitShareData
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

function drawCard(ctx: CanvasRenderingContext2D, accent: string) {
	const scale = deviceScale(ctx)

	ctx.save()
	ctx.shadowColor = '#00000040'
	ctx.shadowBlur = 20 * scale
	ctx.shadowOffsetY = 12 * scale
	ctx.fillStyle = NIGHT
	drawRoundedRect(ctx, CARD.left, CARD.top, CARD.width, CARD.height, CARD.radius)
	ctx.fill()
	ctx.restore()

	const glow = ctx.createRadialGradient(
		SHARE_CENTER_X,
		CARD_GLOW.centerY,
		0,
		SHARE_CENTER_X,
		CARD_GLOW.centerY,
		CARD_GLOW.radius
	)

	glow.addColorStop(0, `${mixColor(accent, NIGHT, GLOW_STRENGTH)}cc`)
	glow.addColorStop(0.7, `${NIGHT}00`)

	ctx.save()
	drawRoundedRect(ctx, CARD.left, CARD.top, CARD.width, CARD.height, CARD.radius)
	ctx.clip()
	ctx.fillStyle = glow
	ctx.fillRect(CARD.left, CARD.top, CARD.width, CARD.height)
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
	const centerX = PERSON.avatarCenterX

	fillCircle(ctx, centerX, HEADER_CENTER_Y, PERSON.ring, accent)
	fillCircle(ctx, centerX, HEADER_CENTER_Y, PERSON.white, SHARE_LIGHT_INK)

	ctx.save()
	ctx.beginPath()
	ctx.arc(centerX, HEADER_CENTER_Y, PERSON.picture, 0, Math.PI * 2)
	ctx.clip()

	ctx.drawImage(
		picture,
		centerX - PERSON.picture,
		HEADER_CENTER_Y - PERSON.picture,
		PERSON.picture * 2,
		PERSON.picture * 2
	)

	ctx.restore()

	ctx.font = shareFont(700, HEADER_SIZE)

	drawShareText(
		ctx,
		fitText(ctx, person, SHARE_CENTER_X - PERSON.nameLeft - 8),
		PERSON.nameLeft,
		HEADER_CENTER_Y,
		{ weight: 700, size: HEADER_SIZE, color: SHARE_LIGHT_INK, align: 'left' }
	)
}

function drawTitle(ctx: CanvasRenderingContext2D, title: string, emoji: string) {
	ctx.font = shareFont(700, HEADER_SIZE)

	const name = fitText(ctx, title, TITLE_RIGHT - SHARE_CENTER_X - 28)

	drawShareText(ctx, name, TITLE_RIGHT, HEADER_CENTER_Y, {
		weight: 700,
		size: HEADER_SIZE,
		color: QUIET_INK,
		align: 'right',
	})

	const nameWidth = ctx.measureText(name).width

	ctx.font = shareEmojiFont(HEADER_SIZE)
	ctx.textAlign = 'right'
	ctx.textBaseline = 'middle'
	ctx.fillText(emoji, TITLE_RIGHT - nameWidth - 5, HEADER_CENTER_Y)
}

function drawStreak(
	ctx: CanvasRenderingContext2D,
	accent: string,
	flame: HTMLImageElement,
	streak: number
) {
	const hasStreak = streak > 0

	ctx.save()
	ctx.globalAlpha = hasStreak ? 1 : FLAME.faded

	ctx.drawImage(
		flame,
		SHARE_CENTER_X - FLAME.size / 2,
		FLAME.top,
		FLAME.size,
		FLAME.size
	)

	ctx.restore()

	drawShareText(ctx, toPersianDigits(streak), SHARE_CENTER_X, STREAK.centerY, {
		weight: 900,
		size: STREAK.size,
		color: mixColor(accent, SHARE_LIGHT_INK, NUMBER_LIGHTNESS),
		align: 'center',
	})

	const label = hasStreak
		? t('widgets.habit.share.canvas.streakLine')
		: t('widgets.habit.share.canvas.startToday')

	drawShareText(ctx, label, SHARE_CENTER_X, LABEL.centerY, {
		weight: 900,
		size: LABEL.size,
		color: SHARE_LIGHT_INK,
		align: 'center',
	})
}

function drawDoneBead(
	ctx: CanvasRenderingContext2D,
	centerX: number,
	centerY: number,
	accent: string,
	gloss: HTMLImageElement
) {
	const scale = deviceScale(ctx)

	ctx.save()
	ctx.shadowColor = `${accent}73`
	ctx.shadowBlur = 8 * scale
	ctx.shadowOffsetY = 2 * scale
	fillCircle(ctx, centerX, centerY, BEADS.radius, accent)
	ctx.restore()

	drawShareGloss(ctx, gloss, centerX, centerY, BEADS.radius)
}

function drawBead(
	ctx: CanvasRenderingContext2D,
	state: ShareDayState,
	centerX: number,
	centerY: number,
	accent: string,
	gloss: HTMLImageElement
) {
	if (state === 'done') {
		drawDoneBead(ctx, centerX, centerY, accent, gloss)

		return
	}

	if (state === 'future') {
		ctx.strokeStyle = FUTURE_DAY
		ctx.lineWidth = 1.2
		ctx.setLineDash([2.4, 2.4])
		ctx.beginPath()
		ctx.arc(centerX, centerY, BEADS.radius - 0.6, 0, Math.PI * 2)
		ctx.stroke()
		ctx.setLineDash([])

		return
	}

	fillCircle(ctx, centerX, centerY, BEADS.radius, OPEN_DAY)
}

function drawMonth(
	ctx: CanvasRenderingContext2D,
	data: HabitShareData,
	accent: string,
	gloss: HTMLImageElement
) {
	data.month.forEach((state, index) => {
		const column = index % BEADS.perRow
		const row = Math.floor(index / BEADS.perRow)
		const centerX = BEADS.right - column * BEADS.step - BEADS.radius
		const centerY = BEADS.top + row * BEADS.step + BEADS.radius

		drawBead(ctx, state, centerX, centerY, accent, gloss)
	})

	const line = t('widgets.habit.share.canvas.monthLine', {
		count: toPersianDigits(data.doneThisMonth),
		total: toPersianDigits(data.daysSoFar),
	})

	drawShareText(ctx, line, SHARE_CENTER_X, MONTH_LINE_CENTER_Y, {
		weight: 700,
		size: 12,
		color: QUIET_INK,
		align: 'center',
	})
}

export async function renderHabitShareCanvas(
	canvas: HTMLCanvasElement,
	options: RenderHabitShareCanvasOptions
) {
	const ctx = prepareShareCanvas(canvas)

	if (!ctx) throw new Error('Canvas is unavailable')

	const accent = options.color || DEFAULT_HABIT_COLOR
	const title = options.title || t('widgets.habit.share.canvas.myHabit')
	const emoji = options.emoji || DEFAULT_EMOJI

	const [flame, gloss] = await Promise.all([
		loadImage(flameImage),
		loadShareGloss(),
		loadShareFonts(),
	])

	drawShareBackground(ctx, accent)
	await drawShareGlow(ctx)
	drawCard(ctx, accent)
	await drawPerson(ctx, options.userName ?? '', options.userAvatar ?? '', accent)
	drawTitle(ctx, title, emoji)
	drawStreak(ctx, accent, flame, options.data.streak)
	drawMonth(ctx, options.data, accent, gloss)
	await drawShareFooter(ctx, SHARE_LIGHT_INK)
}

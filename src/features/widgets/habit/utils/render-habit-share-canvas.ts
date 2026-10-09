import { t } from '@/common/i18n'
import jalaliMoment from 'jalali-moment'
import moment from 'moment'
import type { Habit } from '@/services/habit/habit.interface'
import { drawRoundedRect, fitText, rgba } from '@/features/widgets/utils/canvas'
import { formatHabitGoal } from './habit-goal'
import { DEFAULT_HABIT_COLOR } from '../constants'

const W = 1080
const H = 1350
const BG_BASE = '#05050a'
const TEXT_LIGHT = '#f8fafc'
const TEXT_MUTED = 'rgba(255, 255, 255, 0.55)'
const TEXT_FAINT = 'rgba(255, 255, 255, 0.35)'
const EMPTY_CELL = 'rgba(255, 255, 255, 0.07)'
const FONT_STACK = 'Vazir, Tahoma, Arial, sans-serif'
const DIGIT_STACK = 'Arad, Vazir, Tahoma, sans-serif'
const EMOJI_STACK =
	'"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
const MARGIN = 80
const CELL_SIZE = 28
const CELL_GAP = 6

interface RenderHabitShareCanvasOptions {
	habit: Habit
	color: string
}

export function renderHabitShareCanvas(
	canvas: HTMLCanvasElement | null,
	options: RenderHabitShareCanvasOptions
) {
	if (!canvas) return

	const { habit, color } = options
	const ctx = canvas.getContext('2d')
	if (!ctx) return

	canvas.width = W
	canvas.height = H

	const accent = color || DEFAULT_HABIT_COLOR

	const today = jalaliMoment().locale('fa').startOf('day')
	const numWeeks = 26
	const start = today
		.clone()
		.subtract(numWeeks - 1, 'weeks')
		.startOf('week')

	const current = start.clone()

	let currentStreak = 0
	let longestStreak = 0
	let tempStreak = 0
	let totalCompleted = 0

	const allDaysChronological: {
		gregorianDate: string
		isDone: boolean
		level: number
		jalaliDate: jalaliMoment.Moment
	}[] = []

	const weeksGrid: {
		days: {
			level: number
			isFuture: boolean
		}[]
	}[] = []

	const monthMarkers: {
		name: string
		weekIndex: number
	}[] = []

	let currentMonth = ''

	for (let w = 0; w < numWeeks; w++) {
		const daysInWeek: {
			level: number
			isFuture: boolean
		}[] = []

		for (let d = 0; d < 7; d++) {
			const dayDate = current.clone()
			const gregorianDate = moment(dayDate.toDate()).format('YYYY-MM-DD')
			const [year, month] = gregorianDate.split('-')
			const monthData = habit.calendarData?.[`${year}-${month}`] || {}
			const dayData = monthData[gregorianDate] || {
				value: 0,
				isDone: false,
			}

			const isFuture = dayDate.isAfter(today, 'day')
			const value = dayData.value
			const isDone = dayData.isDone || (habit.target > 0 && value >= habit.target)

			let level = 0
			if (value > 0) {
				if (habit.target > 0) {
					const ratio = value / habit.target
					if (ratio >= 1.5) {
						level = 4
					} else if (ratio >= 1) {
						level = 3
					} else if (ratio >= 0.5) {
						level = 2
					} else {
						level = 1
					}
				} else {
					level = 3
				}
			}

			daysInWeek.push({
				level,
				isFuture,
			})

			if (!isFuture) {
				allDaysChronological.push({
					gregorianDate,
					isDone,
					level,
					jalaliDate: dayDate,
				})

				if (isDone) {
					totalCompleted++
				}
			}

			const monthName = dayDate.format('jMMMM')
			if (monthName !== currentMonth) {
				currentMonth = monthName
				monthMarkers.push({
					name: monthName,
					weekIndex: w,
				})
			}

			current.add(1, 'day')
		}

		weeksGrid.push({
			days: daysInWeek,
		})
	}

	for (const day of allDaysChronological) {
		if (day.isDone) {
			tempStreak++
			if (tempStreak > longestStreak) {
				longestStreak = tempStreak
			}
		} else {
			tempStreak = 0
		}
	}

	const lastIdx = allDaysChronological.length - 1
	if (lastIdx >= 0) {
		let checkIdx = lastIdx
		if (
			!allDaysChronological[checkIdx].isDone &&
			checkIdx > 0 &&
			allDaysChronological[checkIdx - 1].isDone
		) {
			checkIdx--
		}

		while (checkIdx >= 0 && allDaysChronological[checkIdx].isDone) {
			currentStreak++
			checkIdx--
		}
	}

	ctx.fillStyle = BG_BASE
	ctx.fillRect(0, 0, W, H)

	const glow = ctx.createRadialGradient(W / 2, 360, 20, W / 2, 360, 640)
	glow.addColorStop(0, rgba(accent, 0.18))
	glow.addColorStop(1, rgba(accent, 0))
	ctx.fillStyle = glow
	ctx.fillRect(0, 0, W, H)

	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font = `600 26px ${FONT_STACK}`
	ctx.fillStyle = TEXT_FAINT
	const brand = t('widgets.habit.share.canvas.brand')
	ctx.fillText(brand, W / 2, 84)
	ctx.fillStyle = accent
	ctx.beginPath()
	ctx.arc(W / 2 + ctx.measureText(brand).width / 2 + 22, 84, 5, 0, Math.PI * 2)
	ctx.fill()

	ctx.font = `190px ${EMOJI_STACK}`
	ctx.fillStyle = TEXT_LIGHT
	ctx.fillText(habit.emoji || '🎯', W / 2, 250)

	ctx.fillStyle = accent
	drawRoundedRect(ctx, W / 2 - 36, 366, 72, 8, 4)
	ctx.fill()

	ctx.font = `bold 64px ${FONT_STACK}`
	ctx.fillStyle = TEXT_LIGHT
	ctx.fillText(
		fitText(
			ctx,
			habit.title || t('widgets.habit.share.canvas.myHabit'),
			W - 2 * MARGIN
		),
		W / 2,
		440
	)

	ctx.font = `32px ${FONT_STACK}`
	ctx.fillStyle = TEXT_MUTED
	ctx.fillText(fitText(ctx, formatHabitGoal(habit), W - 2 * MARGIN), W / 2, 500)

	drawRoundedRect(ctx, MARGIN, 560, W - 2 * MARGIN, 220, 36)
	ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
	ctx.fill()
	ctx.strokeStyle = rgba(accent, 0.28)
	ctx.lineWidth = 2
	ctx.stroke()

	const streakText = String(currentStreak)
	ctx.font = `bold 150px ${FONT_STACK}`
	const numberWidth = ctx.measureText(streakText).width
	const fireWidth = currentStreak > 0 ? 96 : 0
	const fireGap = currentStreak > 0 ? 24 : 0
	const rowStart = W / 2 - (fireWidth + fireGap + numberWidth) / 2
	const numberCenter = rowStart + fireWidth + fireGap + numberWidth / 2

	ctx.textBaseline = 'alphabetic'
	ctx.fillStyle = TEXT_LIGHT
	ctx.fillText(streakText, numberCenter, 694)

	ctx.fillStyle = accent
	drawRoundedRect(ctx, numberCenter - numberWidth / 2, 710, numberWidth, 6, 3)
	ctx.fill()

	if (currentStreak > 0) {
		ctx.textBaseline = 'middle'
		ctx.font = `84px ${EMOJI_STACK}`
		ctx.fillText('🔥', rowStart + fireWidth / 2, 640)
	}

	ctx.textBaseline = 'middle'
	ctx.font = `30px ${FONT_STACK}`
	ctx.fillStyle = TEXT_MUTED
	ctx.fillText(t('widgets.habit.share.canvas.streakDays'), W / 2, 748)

	ctx.textBaseline = 'middle'
	ctx.textAlign = 'right'
	ctx.font = `bold 30px ${FONT_STACK}`
	ctx.fillStyle = TEXT_LIGHT
	ctx.fillText(t('widgets.habit.share.canvas.recentActivity'), W - MARGIN, 846)

	ctx.textAlign = 'left'
	ctx.font = `24px ${FONT_STACK}`
	ctx.fillStyle = TEXT_MUTED
	ctx.fillText(
		t('widgets.habit.share.canvas.successDays', { p0: totalCompleted }),
		MARGIN,
		848
	)

	const gridTop = 930
	const gridRight = W - MARGIN - 36
	const dayLabels = [
		t('ui.date.weekday.sat'),
		t('ui.date.weekday.sun'),
		t('ui.date.weekday.mon'),
		t('ui.date.weekday.tue'),
		t('ui.date.weekday.wed'),
		t('ui.date.weekday.thu'),
		t('ui.date.weekday.fri'),
	]

	ctx.font = `20px ${DIGIT_STACK}`
	ctx.fillStyle = TEXT_FAINT
	ctx.textBaseline = 'middle'

	const visibleMarkers = monthMarkers.filter(
		(marker, index) =>
			!(marker.weekIndex === 0 && (monthMarkers[index + 1]?.weekIndex ?? 99) < 3)
	)

	for (const marker of visibleMarkers) {
		const colX = gridRight - marker.weekIndex * (CELL_SIZE + CELL_GAP) - CELL_SIZE
		let textX = colX + CELL_SIZE / 2
		let align: CanvasTextAlign = 'center'

		if (marker.weekIndex === 0) {
			align = 'right'
			textX = colX + CELL_SIZE
		}

		if (marker.weekIndex >= numWeeks - 2) {
			align = 'left'
			textX = colX
		}

		ctx.textAlign = align
		ctx.fillText(marker.name, textX, gridTop - 24)
	}

	ctx.textAlign = 'center'
	for (let d = 0; d < 7; d++) {
		const y = gridTop + d * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2
		ctx.fillText(dayLabels[d], gridRight + 36, y)
	}

	const levelColors = [
		EMPTY_CELL,
		rgba(accent, 0.22),
		rgba(accent, 0.43),
		rgba(accent, 0.7),
		accent,
	]

	weeksGrid.forEach((week, w) => {
		const colX = gridRight - w * (CELL_SIZE + CELL_GAP) - CELL_SIZE

		week.days.forEach((day, d) => {
			if (day.isFuture) return

			ctx.fillStyle = levelColors[day.level]
			drawRoundedRect(
				ctx,
				colX,
				gridTop + d * (CELL_SIZE + CELL_GAP),
				CELL_SIZE,
				CELL_SIZE,
				7
			)
			ctx.fill()
		})
	})

	const bottomY = 1200

	ctx.textAlign = 'left'
	ctx.textBaseline = 'middle'
	ctx.font = `24px ${FONT_STACK}`
	ctx.fillStyle = TEXT_MUTED
	ctx.fillText(
		t('widgets.habit.share.canvas.bestRecord', { p0: longestStreak }),
		MARGIN,
		bottomY
	)

	const legendSize = 22
	const legendGap = 8
	let legendX = W - MARGIN - (legendSize * 5 + legendGap * 4)
	for (const legendColor of levelColors) {
		ctx.fillStyle = legendColor
		drawRoundedRect(ctx, legendX, bottomY - legendSize / 2, legendSize, legendSize, 6)
		ctx.fill()
		legendX += legendSize + legendGap
	}

	ctx.textAlign = 'center'
	ctx.font = `22px ${FONT_STACK}`
	ctx.fillStyle = TEXT_FAINT
	ctx.fillText(t('widgets.habit.share.canvas.tagline'), W / 2, H - 45)
}

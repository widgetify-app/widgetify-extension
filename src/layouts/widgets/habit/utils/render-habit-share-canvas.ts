import jalaliMoment from 'jalali-moment'
import moment from 'moment'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { drawRoundedRect, fitText, rgba } from '@/common/utils/canvas'
import { formatHabitGoal } from '../utils'

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

	const dpr = 2
	const width = 800
	const height = 520

	canvas.width = width * dpr
	canvas.height = height * dpr
	canvas.style.width = `${width}px`
	canvas.style.height = `${height}px`

	ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	ctx.clearRect(0, 0, width, height)

	const accent = color || '#536dfe'
	const background = '#0f1014'
	const primary = '#f7f7f8'
	const secondary = '#a7a7b0'
	const muted = '#62636d'

	ctx.fillStyle = background
	ctx.fillRect(0, 0, width, height)

	ctx.fillStyle = rgba(accent, 0.045)
	ctx.beginPath()
	ctx.arc(118, 86, 170, 0, Math.PI * 2)
	ctx.fill()

	ctx.fillStyle = rgba(accent, 0.025)
	ctx.beginPath()
	ctx.arc(700, 385, 210, 0, Math.PI * 2)
	ctx.fill()

	ctx.strokeStyle = '#24252b'
	ctx.lineWidth = 1
	drawRoundedRect(ctx, 0.5, 0.5, width - 1, height - 1, 30)
	ctx.stroke()

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

	ctx.textAlign = 'left'
	ctx.textBaseline = 'middle'
	ctx.font = '600 11px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = muted
	ctx.fillText('افزونه نیوتب مرورگر ویجتیفای', 36, 35)

	ctx.fillStyle = accent
	ctx.beginPath()
	ctx.arc(175, 35, 3, 0, Math.PI * 2)
	ctx.fill()

	ctx.textAlign = 'right'
	ctx.textBaseline = 'alphabetic'
	ctx.font = '800 96px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = primary
	ctx.fillText(String(currentStreak), width - 36, 108)

	const numberWidth = ctx.measureText(String(currentStreak)).width
	ctx.fillStyle = accent
	drawRoundedRect(ctx, width - 36 - numberWidth, 119, numberWidth, 4, 2)
	ctx.fill()

	ctx.font = '500 13px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = secondary
	ctx.fillText('روز متوالی', width - 36, 145)

	if (currentStreak > 0) {
		ctx.font =
			'28px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
		ctx.fillText('🔥', width - 110, 104)
	}

	const identityCenterX = 190
	const identityTop = 87

	ctx.textAlign = 'center'
	ctx.textBaseline = 'middle'
	ctx.font =
		'78px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
	ctx.fillText(habit.emoji || '🎯', identityCenterX, identityTop + 22)

	ctx.fillStyle = accent
	drawRoundedRect(ctx, identityCenterX - 20, identityTop + 72, 40, 4, 2)
	ctx.fill()

	ctx.textBaseline = 'top'
	ctx.font = '700 25px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = primary
	const title = fitText(ctx, habit.title || 'عادت من', 270)
	ctx.fillText(title, identityCenterX, identityTop + 88)

	ctx.font = '400 12px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = secondary
	const goal = fitText(ctx, formatHabitGoal(habit), 270)
	ctx.fillText(goal, identityCenterX, identityTop + 124)

	const chartX = 36
	const chartY = 225
	const chartWidth = width - 72

	ctx.textAlign = 'right'
	ctx.textBaseline = 'top'
	ctx.font = '600 12px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = secondary
	ctx.fillText('فعالیت ۶ ماه اخیر', chartX + chartWidth, chartY)

	ctx.font = '400 10px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = muted
	ctx.fillText(`${totalCompleted} روز موفق`, chartX + chartWidth - 105, chartY + 2)

	const cellSize = 17
	const gap = 4
	const gridTop = chartY + 38
	const gridRight = chartX + chartWidth - 27
	const dayLabels = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']

	ctx.font = '500 9px Arad, Vazir, sans-serif'
	ctx.fillStyle = muted
	ctx.textBaseline = 'middle'

	for (const marker of monthMarkers) {
		const colX = gridRight - marker.weekIndex * (cellSize + gap) - cellSize
		let textX = colX + cellSize / 2
		let align: CanvasTextAlign = 'center'

		if (marker.weekIndex === 0) {
			align = 'right'
			textX = colX + cellSize
		}

		if (marker.weekIndex >= numWeeks - 2) {
			align = 'left'
			textX = colX
		}

		ctx.textAlign = align
		ctx.fillText(marker.name, textX, chartY + 29)
	}

	ctx.font = '500 9px Arad, Vazir, sans-serif'
	ctx.textAlign = 'center'
	ctx.fillStyle = muted

	for (let d = 0; d < 7; d++) {
		const y = gridTop + d * (cellSize + gap) + cellSize / 2
		ctx.fillText(dayLabels[d], gridRight + 18, y)
	}

	weeksGrid.forEach((week, w) => {
		const colX = gridRight - w * (cellSize + gap) - cellSize

		week.days.forEach((day, d) => {
			if (day.isFuture) {
				return
			}

			const cellY = gridTop + d * (cellSize + gap)
			let bg = '#24252a'

			if (day.level === 1) {
				bg = rgba(accent, 0.22)
			} else if (day.level === 2) {
				bg = rgba(accent, 0.43)
			} else if (day.level === 3) {
				bg = rgba(accent, 0.7)
			} else if (day.level === 4) {
				bg = accent
			}

			ctx.fillStyle = bg
			drawRoundedRect(ctx, colX, cellY, cellSize, cellSize, 4)
			ctx.fill()
		})
	})

	const bottomY = 454

	ctx.textAlign = 'left'
	ctx.textBaseline = 'middle'
	ctx.font = '400 10px Vazir, "Segoe UI", sans-serif'
	ctx.fillStyle = muted
	ctx.fillText(`بهترین رکورد ${longestStreak} روز`, 36, bottomY)

	ctx.textAlign = 'right'
	ctx.fillText('یک قدم کوچک، هر روز', width - 36, bottomY)

	const legendY = 454
	let legendX = width / 2 - 38
	const legendColors = [
		'#24252a',
		rgba(accent, 0.22),
		rgba(accent, 0.43),
		rgba(accent, 0.7),
		accent,
	]

	for (let i = 0; i < legendColors.length; i++) {
		ctx.fillStyle = legendColors[i]
		drawRoundedRect(ctx, legendX, legendY - 5, 11, 11, 3)
		ctx.fill()
		legendX += 15
	}
}

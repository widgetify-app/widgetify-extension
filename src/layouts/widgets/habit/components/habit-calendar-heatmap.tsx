import { useState } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import type { Habit } from '@/services/hooks/habit/habit.interface'

const PERSIAN_MONTHS = [
	'فروردین',
	'اردیبهشت',
	'خرداد',
	'تیر',
	'مرداد',
	'شهریور',
	'مهر',
	'آبان',
	'آذر',
	'دی',
	'بهمن',
	'اسفند',
]

const DAYS = ['ش', 'ی', 'د', 'س', 'چ', 'ج', 'ج']

interface HeatmapProps {
	habit: Habit
	color: string
}

export function HabitCalendarHeatmap({ habit, color }: HeatmapProps) {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const currentYear = today.getFullYear()
	const currentMonth = today.getMonth()

	const [month, setMonth] = useState(currentMonth)

	const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`
	const monthData = habit.calendarData[monthKey] || {}
	const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
	const firstDay = new Date(currentYear, month, 1).getDay()

	const weeks: (string | null)[][] = [[]]
	const offset = firstDay === 0 ? 6 : firstDay - 1

	for (let i = 0; i < offset; i++) weeks[0].push(null)
	for (let day = 1; day <= daysInMonth; day++) {
		const dateStr = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		if (weeks[weeks.length - 1].length === 7) weeks.push([])
		weeks[weeks.length - 1].push(dateStr)
	}

	const canNext = month < currentMonth
	const canPrev = month > 0

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={() => setMonth((m) => m - 1)}
					disabled={!canPrev}
					className="p-1 disabled:opacity-30"
				>
					<IoChevronBack size={14} />
				</button>
				<span className="text-xs font-bold text-content">
					{PERSIAN_MONTHS[month]}
				</span>
				<button
					type="button"
					onClick={() => setMonth((m) => m + 1)}
					disabled={!canNext}
					className="p-1 disabled:opacity-30"
				>
					<IoChevronForward size={14} />
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1">
				{DAYS.map((d) => (
					<div
						key={d}
						className="h-4 text-[8px] text-muted flex items-center justify-center font-bold"
					>
						{d}
					</div>
				))}
			</div>

			<div className="space-y-0.5">
				{weeks.map((week, i) => (
					<div key={i} className="grid grid-cols-7 gap-1">
						{week.map((date, j) => {
							if (!date) return <div key={j} />
							const data = monthData[date]
							const isDone = data?.isDone ?? false
							return (
								<div
									key={date}
									className="h-4 rounded-[2px] border border-base-300/30 transition-all hover:border-base-300"
									style={{
										backgroundColor: isDone ? color : 'transparent',
										opacity: isDone ? 1 : 0.2,
									}}
									title={`${date}: ${data?.value ?? 0}/${habit.target}`}
								/>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}

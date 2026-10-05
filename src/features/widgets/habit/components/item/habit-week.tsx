import moment from 'jalali-moment'
import { getContrastingTextColor } from '@/common/utils/color'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { Habit } from '@/services/habit/habit.interface'
import { DEFAULT_HABIT_COLOR } from '../../constants'
import { getHabitUnitLabel } from '../../utils/habit-goal'
import { dayKey, weekdayInitial } from '../../utils/habit-week'

interface HabitWeekProps {
	habit: Habit
}

export function HabitWeek({ habit }: HabitWeekProps) {
	const color = habit.color || DEFAULT_HABIT_COLOR
	const target = habit.target || 1
	const unit = getHabitUnitLabel(habit)

	return (
		<ul
			dir="ltr"
			aria-label={`${habit.history.length} روز گذشته`}
			className="flex gap-1 shrink-0"
		>
			{habit.history.map((day) => {
				const progress = Math.min(day.value / target, 1)
				const isDone = day.isDone || day.value >= target
				const label = `${moment(dayKey(day.date), 'YYYY-MM-DD').locale('fa').format('dddd jD jMMMM')}: ${
					isDone
						? 'انجام شد'
						: day.value > 0
							? `${day.value} از ${target} ${unit}`.trim()
							: 'ثبت نشده'
				}`

				return (
					<li
						key={day.date}
						title={label}
						className="overflow-hidden rounded-sm size-4 bg-fill-2"
					>
						<span className="sr-only">{label}</span>
						{progress > 0 && (
							<span
								aria-hidden="true"
								className="grid size-full place-items-center"
								style={{
									backgroundColor: color,
									color: getContrastingTextColor(color),
									opacity: isDone ? 1 : 0.35 + progress * 0.65,
								}}
							>
								{isDone && (
									<Icon name="check" size={10} strokeWidth={3} />
								)}
							</span>
						)}
					</li>
				)
			})}
		</ul>
	)
}

interface HabitWeekHeaderProps {
	days: Habit['history']
	todayKey: string
}

export function HabitWeekHeader({ days, todayKey }: HabitWeekHeaderProps) {
	return (
		<div aria-hidden="true" className="flex items-center flex-none h-5 gap-2.5 px-2">
			<span className="flex-1" />
			<span dir="ltr" className="flex gap-1 shrink-0">
				{days.map((day) => (
					<span
						key={day.date}
						className={cn(
							'w-4 text-center text-3xs',
							dayKey(day.date) === todayKey
								? 'font-bold text-brand'
								: 'font-medium text-fg-faint'
						)}
					>
						{weekdayInitial(day.date)}
					</span>
				))}
			</span>
		</div>
	)
}

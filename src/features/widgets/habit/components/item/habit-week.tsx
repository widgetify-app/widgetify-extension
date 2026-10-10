import { t } from '@/common/i18n'
import moment from 'jalali-moment'
import { getContrastingTextColor } from '@/common/utils/color'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import type { Habit } from '@/services/habit/habit.interface'
import { DEFAULT_HABIT_COLOR } from '../../constants'
import { getHabitUnitLabel } from '../../utils/habit-goal'
import { habitWeek, weekdayInitial } from '../../utils/habit-week'

interface HabitWeekProps {
	habit: Habit
	week: string[]
	todayKey: string
	isStretched?: boolean
}

export function HabitWeek({
	habit,
	week,
	todayKey,
	isStretched = false,
}: HabitWeekProps) {
	const color = habit.color || DEFAULT_HABIT_COLOR
	const target = habit.target || 1
	const unit = getHabitUnitLabel(habit)

	return (
		<ul
			aria-label={t('widgets.habit.item.thisWeek')}
			className={cn('flex gap-1', isStretched ? 'w-full' : 'shrink-0')}
		>
			{habitWeek(habit, week, todayKey).map((day) => {
				const progress = Math.min(day.value / target, 1)
				const label = `${moment(day.key, 'YYYY-MM-DD').locale('fa').format('dddd jD jMMMM')}: ${
					day.isFuture
						? t('widgets.habit.item.notYet')
						: day.isDone
							? t('widgets.habit.detail.chart.done')
							: day.value > 0
								? t('widgets.habit.item.progressOf', {
										p0: day.value,
										p1: target,
										p2: unit,
									}).trim()
								: t('widgets.habit.item.unlogged')
				}`

				return (
					<li
						key={day.key}
						title={label}
						className={cn(
							'overflow-hidden rounded-sm',
							isStretched ? 'flex-1 h-4' : 'size-4',
							day.isFuture ? 'bg-fill' : 'bg-fill-2'
						)}
					>
						<span className="sr-only">{label}</span>
						{progress > 0 && (
							<span
								aria-hidden="true"
								className="grid size-full place-items-center"
								style={{
									backgroundColor: color,
									color: getContrastingTextColor(color),
									opacity: day.isDone ? 1 : 0.35 + progress * 0.65,
								}}
							>
								{day.isDone && (
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
	week: string[]
	todayKey: string
	isStretched?: boolean
}

export function HabitWeekHeader({
	week,
	todayKey,
	isStretched = false,
}: HabitWeekHeaderProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				'flex items-center flex-none h-5',
				isStretched ? 'ps-12.5 pe-2' : 'gap-2.5 px-2'
			)}
		>
			{!isStretched && <span className="flex-1" />}
			<span className={cn('flex gap-1', isStretched ? 'flex-1' : 'shrink-0')}>
				{week.map((key) => (
					<span
						key={key}
						className={cn(
							'text-center text-3xs',
							isStretched ? 'flex-1' : 'w-4',
							key === todayKey
								? 'font-bold text-brand'
								: 'font-medium text-fg-faint'
						)}
					>
						{weekdayInitial(key)}
					</span>
				))}
			</span>
		</div>
	)
}

import { t } from '@/common/i18n'
import type { ReactNode } from 'react'
import Analytics from '@/analytics'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useKeyboardFocusWithin } from '@/features/widgets/hooks/use-keyboard-focus-within'
import type { Habit } from '@/services/habit/habit.interface'
import { DEFAULT_HABIT_COLOR } from '../../constants'
import { formatHabitToday } from '../../utils/habit-goal'
import { HabitLogButton } from './habit-log-button'

interface HabitItemProps {
	habit: Habit
	today: WidgetifyDate
	onChanged: () => void
	onViewDetails: () => void
	trailing?: ReactNode
}

export function HabitItem({
	habit,
	today,
	onChanged,
	onViewDetails,
	trailing,
}: HabitItemProps) {
	const keyboardFocus = useKeyboardFocusWithin()
	const color = habit.color || DEFAULT_HABIT_COLOR
	const target = habit.target || 1

	return (
		<article
			{...keyboardFocus}
			className="flex items-center gap-2.5 px-2 rounded-xl min-h-11.5 transition-ui hover:bg-fill data-[keyboard-focus]:bg-fill"
		>
			<HabitLogButton
				habit={habit}
				today={today}
				onLogged={() => {
					Analytics.event('habit_quick_log')
					onChanged()
				}}
			/>

			<button
				type="button"
				onClick={onViewDetails}
				aria-label={t('widgets.habit.item.detailsAria', {
					p0: habit.title,
				})}
				className="flex flex-col flex-1 min-w-0 py-1 cursor-pointer text-start leading-control focus-visible:focus-ring"
			>
				<span className="text-xs font-semibold truncate text-fg">
					{habit.title}
				</span>
				<span className="truncate text-3xs text-fg-faint">
					{formatHabitToday(habit)}
				</span>
			</button>

			{trailing ?? (
				<ul
					dir="ltr"
					aria-label={t('widgets.habit.item.pastDays', {
						p0: habit.history.length,
					})}
					className="flex gap-0.75 shrink-0"
				>
					{habit.history.map((day) => {
						const dayProgress = Math.min(day.value / target, 1)
						return (
							<li
								key={day.date}
								className="overflow-hidden size-1.5 rounded-xs bg-fill-2"
							>
								{dayProgress > 0 && (
									<span
										className="block size-full"
										style={{
											backgroundColor: color,
											opacity: 0.35 + dayProgress * 0.65,
										}}
									/>
								)}
							</li>
						)
					})}
				</ul>
			)}
		</article>
	)
}

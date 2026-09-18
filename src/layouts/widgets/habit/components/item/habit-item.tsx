import Analytics from '@/analytics'
import { playAlarm } from '@/common/play-alarm'
import { showToast } from '@/common/toast'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { safeAwait } from '@/services/api'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { translateError } from '@/common/utils/translate-error'
import { formatHabitGoal } from '../../utils/habit-goal'
import { resolveHabitStep } from '../../utils/habit-step'
import { SegmentedProgressRing } from './button-progress-ring'
import { SimpleProgressRing } from './button-simple-progress-ring'
import { Icon } from '@/icons'
import { IconLoading } from '@/components/ui'

interface HabitItemProps {
	habit: Habit
	today: WidgetifyDate
	onChanged: () => void

	onViewDetails: (e: React.MouseEvent<HTMLElement>) => void
}
export function HabitItem({ habit, today, onChanged, onViewDetails }: HabitItemProps) {
	const { mutateAsync: logProgress, isPending } = useLogHabitProgress()

	const color = habit.color || '#536dfe'
	const target = habit.target || 1
	const value = habit.today.value
	const isSimpleHabit = target === 1
	const isDone = habit.today.isDone || value >= target

	const handleQuickLog = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return

		const { amount, blockedMessage } = resolveHabitStep(habit, value)
		if (blockedMessage) {
			showToast(blockedMessage, 'error')
			return
		}

		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		const [error] = await safeAwait(
			logProgress({ id: habit.id, input: { date, amount } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}
		playAlarm('info')
		Analytics.event('habit_quick_log')
		onChanged()
	}

	return (
		<article className="w-full p-2 text-right transition-ui border rounded-2xl border-subtle bg-raised hover:border-content hover:bg-raised">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onViewDetails}
					aria-label={`جزئیات ${habit.title}`}
					className="flex items-center flex-1 min-w-0 gap-2 cursor-pointer text-start active:scale-[0.99] focus-visible:focus-ring"
				>
					<span
						className="flex items-center justify-center w-8 h-8 text-sm rounded-lg shrink-0"
						style={{ backgroundColor: `${color}22`, color }}
					>
						{isPending ? (
							<IconLoading className="text-muted" />
						) : (
							habit.emoji || '🎯'
						)}
					</span>

					<span className="flex-1 min-w-0">
						<span className="block text-xs font-bold truncate text-content">
							{habit.title}
						</span>
						<span className="mt-0.5 block text-[9px] truncate text-muted">
							{formatHabitGoal(habit)}
						</span>
					</span>
				</button>

				<button
					type="button"
					onClick={handleQuickLog}
					disabled={isPending}
					aria-label={`ثبت پیشرفت ${habit.title}`}
					className="relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-ui active:scale-95 disabled:opacity-70 focus-visible:focus-ring"
					style={{ backgroundColor: `${color}22`, color }}
				>
					{!isSimpleHabit && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							{target > 6 ? (
								<SimpleProgressRing
									value={value}
									target={target}
									color={color}
									size={28}
									strokeWidth={3}
								/>
							) : (
								<SegmentedProgressRing
									value={value}
									target={target}
									color={color}
									size={28}
									strokeWidth={3}
									gap={6}
								/>
							)}
						</div>
					)}

					<div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full">
						{isDone || isSimpleHabit ? (
							<Icon
								name="check"
								size={12}
								strokeWidth={2.5}
								aria-hidden="true"
							/>
						) : (
							<Icon
								name="plus"
								size={12}
								strokeWidth={3}
								aria-hidden="true"
							/>
						)}
					</div>
				</button>
			</div>

			<ul
				aria-label={`تاریخچه ${habit.history.length} روز گذشته`}
				className="flex gap-1 mt-2"
			>
				{habit.history.map((day) => {
					const dayProgress = Math.min(day.value / target, 1)
					return (
						<li
							key={day.date}
							className="flex-1 h-1.5 rounded-full bg-raised overflow-hidden"
						>
							<div
								className="w-full h-full rounded-full"
								style={{
									backgroundColor: color,
									opacity:
										dayProgress === 0 ? 0 : 0.25 + dayProgress * 0.75,
								}}
							/>
						</li>
					)
				})}
			</ul>
		</article>
	)
}

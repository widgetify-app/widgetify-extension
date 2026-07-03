import { FiCheck, FiPlus } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { HABIT_UNIT_STEP } from '@/common/constant/habit-options'
import { playAlarm } from '@/common/playAlarm'
import { showToast } from '@/common/toast'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import { safeAwait } from '@/services/api'
import { HabitComparison, type Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { translateError } from '@/utils/translate-error'
import { formatHabitGoal } from '../../utils'
import { SegmentedProgressRing } from './button.progress-ring'
import { SimpleProgressRing } from './button.simple-progress-ring'

interface HabitItemProps {
	habit: Habit
	today: WidgetifyDate
	onChanged: () => void

	onViewDetails: (e: React.MouseEvent<HTMLElement>) => void
}
export function HabitItem({ habit, today, onChanged, onViewDetails }: HabitItemProps) {
	const { mutateAsync: logProgress, isPending } = useLogHabitProgress()

	const color = habit.color || '#3b82f6'
	const target = habit.target || 1
	const value = habit.today.value
	const isSimpleHabit = target === 1

	const handleQuickLog = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return
		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		let step = HABIT_UNIT_STEP[habit.unit] || 1
		if (habit.comparison === HabitComparison.EXACT && value + step > target) step = 0
		if (habit.comparison === HabitComparison.AT_MOST && value + step > target) {
			return showToast(`مقدار فعلی به حداکثر هدف (${target}) رسیده است.`, 'error')
		}
		const [error] = await safeAwait(
			logProgress({ id: habit.id, input: { date, amount: step } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}
		playAlarm('success')
		Analytics.event('habit_quick_log')
		onChanged()
	}

	return (
		<div
			onClick={onViewDetails}
			className="w-full p-2 transition-all border cursor-pointer rounded-xl border-base-300/40 bg-base-300/30 hover:border-base-300/70 hover:bg-base-300/50 text-right active:scale-[0.99]"
		>
			<div className="flex items-center gap-2">
				<div
					className="flex items-center justify-center w-8 h-8 text-sm rounded-lg shrink-0"
					style={{
						backgroundColor: `${color}22`,
						color: getContrastingTextColor(color),
					}}
				>
					{habit.emoji || '🎯'}
				</div>

				<div className="flex-1 min-w-0">
					<p className="text-xs font-semibold truncate text-content">
						{habit.title}
					</p>
					<p className="mt-0.5 text-[10px] truncate text-muted">
						{formatHabitGoal(habit)}
					</p>
				</div>

				<button
					type="button"
					onClick={handleQuickLog}
					disabled={isPending}
					className="relative flex items-center justify-center w-8 h-8 transition-all duration-200 rounded-lg cursor-pointer bg-base-300 active:scale-95 disabled:opacity-70"
					style={{
						backgroundColor: `${color}22`,
						color: color,
					}}
				>
					{!isSimpleHabit && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							{target > 6 ? (
								<SimpleProgressRing
									value={value}
									target={target}
									color={color}
									size={28}
									strokeWidth={3.5}
								/>
							) : (
								<SegmentedProgressRing
									value={value}
									target={target}
									color={color}
									size={28}
									strokeWidth={3.5}
									gap={6}
								/>
							)}
						</div>
					)}

					<div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full">
						{habit.today.isDone ? (
							<FiCheck size={18} strokeWidth={3} />
						) : isSimpleHabit ? (
							<FiCheck size={18} strokeWidth={3} />
						) : (
							<FiPlus size={18} strokeWidth={3} />
						)}
					</div>
				</button>
			</div>

			<div className="flex gap-1 mt-2">
				{habit.history.map((day) => {
					const dayProgress = Math.min(day.value / target, 1)
					return (
						<div
							key={day.date}
							className="flex-1 h-1.5 rounded-full bg-base-300 overflow-hidden"
						>
							<div
								className="w-full h-full rounded-full"
								style={{
									backgroundColor: color,
									opacity:
										dayProgress === 0 ? 0 : 0.25 + dayProgress * 0.75,
								}}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

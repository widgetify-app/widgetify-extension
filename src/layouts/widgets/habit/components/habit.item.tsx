import { FiArchive, FiCheck, FiEdit3 } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { playAlarm } from '@/common/playAlarm'
import { showToast } from '@/common/toast'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import { safeAwait } from '@/services/api'
import { HabitComparison, type Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { translateError } from '@/utils/translate-error'
import { HABIT_UNIT_STEP } from '../../../../common/constant/habit-options'
import { formatHabitGoal } from '../utils/habit.utils'

interface HabitItemProps {
	habit: Habit
	today: WidgetifyDate
	onChanged: () => void
	onEdit: () => void
	onArchive: () => void
}

export function HabitItem({
	habit,
	today,
	onChanged,
	onEdit,
	onArchive,
}: HabitItemProps) {
	const { mutateAsync: logProgress, isPending } = useLogHabitProgress()
	const isDone = habit.today.isDone
	const color = habit.color || '#3b82f6'
	const target = habit.target || 1

	const handleQuickLog = async () => {
		if (isPending) return
		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		let step = HABIT_UNIT_STEP[habit.unit] || 1

		if (
			habit.comparison === HabitComparison.EXACT &&
			habit.today.value + 1 > habit.target
		) {
			step = 0
		}

		if (
			habit.comparison === HabitComparison.AT_MOST &&
			habit.today.value + 1 > habit.target
		) {
			return showToast(
				`مقدار فعلی به حداکثرِ هدفِ شما (یعنی ${habit.target}) رسیده.`,
				'error'
			)
		}

		const [error] = await safeAwait(
			logProgress({ id: habit.id, input: { date, amount: step } })
		)

		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		if (!isDone) playAlarm('success')
		Analytics.event('habit_quick_log')
		onChanged()
	}

	return (
		<div className="p-1.5 transition-all border rounded-xl group border-base-300/40 bg-base-300/30">
			<div className="flex items-center gap-2">
				<div
					className="flex items-center justify-center text-sm transition-transform rounded-lg w-7 h-7 shrink-0 active:scale-90 disabled:opacity-60"
					style={{
						backgroundColor: `${color}22`,
						color: isDone ? getContrastingTextColor(color) : color,
					}}
				>
					{habit.emoji || '🎯'}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-medium truncate text-content">
						{habit.title}
					</p>
					<p className="text-[10px] truncate text-muted">
						{formatHabitGoal(habit)}
					</p>
				</div>
				<div className="items-center hidden gap-1 group-hover:flex">
					<button
						type="button"
						onClick={handleQuickLog}
						disabled={isPending}
						className="p-1 rounded-md cursor-pointer text-base-content/40 hover:text-success hover:bg-success/10"
					>
						<FiCheck size={12} />
					</button>
					<button
						type="button"
						onClick={onEdit}
						className="p-1 rounded-md cursor-pointer text-base-content/40 hover:text-primary hover:bg-primary/10"
					>
						<FiEdit3 size={12} />
					</button>
					<button
						type="button"
						onClick={onArchive}
						className="p-1 rounded-md cursor-pointer text-base-content/40 hover:text-error hover:bg-error/10"
					>
						<FiArchive size={12} />
					</button>
				</div>
				<span className="text-[10px] shrink-0 text-muted">
					{habit.today.value}/{habit.target}
				</span>
			</div>
			<div className="flex gap-0.5 mt-1.5">
				{habit.history.map((day) => {
					const dayProgress = Math.min(day.value / target, 1)
					return (
						<span
							key={day.date}
							className={`flex-1 h-1.5 rounded-full ${day.isDone ? '' : 'bg-base-300'}`}
							style={
								dayProgress
									? {
											backgroundColor: color,
											opacity:
												dayProgress === 0
													? 0
													: 0.25 + dayProgress * 0.75,
										}
									: undefined
							}
						/>
					)
				})}
			</div>
		</div>
	)
}

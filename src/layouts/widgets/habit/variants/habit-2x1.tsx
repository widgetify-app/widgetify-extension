import type { Habit } from '@/services/hooks/habit/habit.interface'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { SimpleProgressRing } from '../components/item/button.simple-progress-ring'
import { Icon } from '@/src/icons'

function getHabitStreak(h: Habit): number {
	let streak = h.today?.isDone ? 1 : 0
	if (!h.history) return streak
	for (let i = h.history.length - 1; i >= 0; i--) {
		if (h.history[i]?.isDone) {
			streak++
		} else {
			break
		}
	}
	return streak
}

interface HabitCompactRowProps {
	habits: Habit[]
	isLoading: boolean
}

export function HabitCompactRow({ habits, isLoading }: HabitCompactRowProps) {
	const displayHabits = habits.slice(0, 2)

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-1.5 h-full w-full select-none">
				<div className="p-2 rounded-xl bg-base-200/40 skeleton" />
				<div className="p-2 rounded-xl bg-base-200/40 skeleton" />
			</div>
		)
	}

	if (habits.length === 0) {
		return (
			<div className="flex items-center justify-center gap-2 h-full w-full text-xs text-muted select-none">
				<Icon name="strike" className="w-4 h-4 text-primary" />
				<span>عادتی ثبت نشده است</span>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-2 gap-1.5 h-full w-full select-none overflow-hidden">
			{displayHabits.map((habit) => {
				const color = habit.color || '#536dfe'
				const target = habit.target || 1
				const value = habit.today.value
				const isCompleted = value >= target
				const streak = getHabitStreak(habit)

				return (
					<div
						key={habit.id}
						className="flex flex-col justify-between p-2 rounded-xl bg-base-200/40 border border-base-content/10 min-w-0 h-full overflow-hidden"
					>
						<div className="flex items-center justify-between gap-1">
							<div className="flex items-center gap-1.5 min-w-0">
								<div className="relative flex items-center justify-center shrink-0">
									<SimpleProgressRing
										value={value}
										target={target}
										color={color}
										size={22}
										strokeWidth={2.5}
									/>
									{isCompleted && (
										<span className="absolute text-[8px] text-success font-bold">
											✓
										</span>
									)}
								</div>
								<span className="text-xs font-bold text-content truncate">
									{habit.title}
								</span>
							</div>
						</div>

						<div className="flex items-center justify-between gap-1 text-[10px] mt-1 text-base-content/60">
							<span>
								{toPersianDigits(value)} / {toPersianDigits(target)}
							</span>
							{streak > 0 ? (
								<span className="flex items-center gap-0.5 text-warning">
									<span>🔥</span>
									<span>{toPersianDigits(streak)}</span>
								</span>
							) : null}
						</div>
					</div>
				)
			})}
		</div>
	)
}

import type { Habit } from '@/services/hooks/habit/habit.interface'
import { toPersianDigits } from '@/common/utils/persian-digits'
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

interface HabitCompactSquareProps {
	habits: Habit[]
	isLoading: boolean
}

export function HabitCompactSquare({
	habits,
	isLoading,
}: HabitCompactSquareProps) {
	const total = habits.length
	const completed = habits.filter(
		(h) => h.today.value >= (h.target || 1)
	).length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0
	const maxStreak = Math.max(...habits.map((h) => getHabitStreak(h)), 0)

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-between h-full w-full p-2.5 select-none">
				<div className="w-12 h-3 rounded skeleton" />
				<div className="w-14 h-8 rounded skeleton my-auto" />
				<div className="w-16 h-3 rounded skeleton" />
			</div>
		)
	}

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<div className="flex items-center gap-1.5 text-content">
				<Icon name="strike" className="w-3.5 h-3.5 text-primary" />
				<span className="text-xs font-bold">عادت‌ها</span>
			</div>

			<div className="flex flex-col items-center my-auto">
				<span className="text-2xl font-black text-content leading-none">
					{toPersianDigits(percent)}٪
				</span>
				<span className="text-[10px] text-base-content/70 font-medium mt-1">
					{toPersianDigits(completed)} از {toPersianDigits(total)} انجام شد
				</span>
			</div>

			<div className="flex items-center gap-1 text-[10px] text-base-content/60 font-medium">
				{maxStreak > 0 ? (
					<>
						<span>🔥</span>
						<span>بیشترین استریک: {toPersianDigits(maxStreak)} روز</span>
					</>
				) : (
					<span>امروز رو ثبت کن!</span>
				)}
			</div>
		</div>
	)
}

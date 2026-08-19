import type { Habit } from '@/services/hooks/habit/habit.interface'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { HabitItem } from '../components/item/habit.item'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
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

interface HabitWideFullProps {
	habits: Habit[]
	today: WidgetifyDate
	isLoading: boolean
	onChanged: () => void
	onViewDetails: (habitId: string) => void
}

export function HabitWideFull({
	habits,
	today,
	isLoading,
	onChanged,
	onViewDetails,
}: HabitWideFullProps) {
	const total = habits.length
	const completed = habits.filter((h) => h.today.value >= (h.target || 1)).length
	const percent = total > 0 ? Math.round((completed / total) * 100) : 0
	const maxStreak = Math.max(...habits.map((h) => getHabitStreak(h)), 0)

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-full w-full p-1 select-none">
			<div className="flex flex-col justify-between p-3 rounded-2xl bg-base-200/40 border border-base-content/10">
				<div className="flex items-center gap-2 font-bold text-sm text-content">
					<Icon name="strike" className="w-4 h-4 text-primary" />
					<span>آمار عادات</span>
				</div>

				<div className="flex flex-col gap-2 my-auto">
					<div className="flex items-center justify-between text-xs">
						<span className="text-base-content/70">انجام‌شده:</span>
						<span className="font-bold text-success">
							{toPersianDigits(completed)} از {toPersianDigits(total)}
						</span>
					</div>
					<div className="flex items-center justify-between text-xs">
						<span className="text-base-content/70">درصد پیشرفت:</span>
						<span className="font-bold text-content">
							{toPersianDigits(percent)}٪
						</span>
					</div>
					{maxStreak > 0 && (
						<div className="flex items-center justify-between text-xs">
							<span className="text-warning font-medium">
								بیشترین استریک:
							</span>
							<span className="font-bold text-warning flex items-center gap-0.5">
								<span>🔥</span>
								<span>{toPersianDigits(maxStreak)} روز</span>
							</span>
						</div>
					)}
				</div>

				<div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
					<div
						className="bg-success h-full transition-all duration-300"
						style={{ width: `${percent}%` }}
					/>
				</div>
			</div>

			<div className="md:col-span-2 flex flex-col h-full overflow-hidden p-2 rounded-2xl bg-base-200/40 border border-base-content/10">
				<div className="flex items-center justify-between pb-1.5 border-b border-base-content/10 text-xs font-bold text-content">
					<span>عادت‌های امروز</span>
					<span className="text-[11px] text-base-content/60">
						{toPersianDigits(total)} مورد
					</span>
				</div>

				<div className="grow overflow-y-auto space-y-1 mt-1.5 scrollbar-none">
					{isLoading ? (
						<div className="space-y-1">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="w-full h-9 rounded-xl skeleton" />
							))}
						</div>
					) : habits.length === 0 ? (
						<div className="flex items-center justify-center h-full text-xs text-muted">
							عادتی برای نمایش وجود ندارد
						</div>
					) : (
						habits.map((habit) => (
							<HabitItem
								key={habit.id}
								habit={habit}
								today={today}
								onChanged={onChanged}
								onViewDetails={() => onViewDetails(habit.id)}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}

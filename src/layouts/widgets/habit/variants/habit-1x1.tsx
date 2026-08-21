import type { Habit } from '@/services/hooks/habit/habit.interface'
import { toPersianDigits } from '@/common/utils/persian-digits'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'

interface HabitCompactSquareProps {
	habits: Habit[]
	isLoading: boolean
}

export function HabitCompactSquare({
	habits,
	isLoading,
}: HabitCompactSquareProps) {
	const total = habits.length

	const totalProgressSum = habits.reduce((acc, h) => {
		const target = h.target || 1
		return acc + Math.min(h.today.value / target, 1)
	}, 0)

	const percent = total > 0 ? Math.round((totalProgressSum / total) * 100) : 0
	const completedHabitsCount = habits.filter(
		(h) => h.today.isDone || h.today.value >= (h.target || 1)
	).length
	const isAllCompleted = total > 0 && percent === 100

	if (isLoading) {
		return (
			<div className="flex flex-col justify-between items-center h-full w-full select-none">
				<div className="flex items-center justify-between w-full">
					<div className="w-12 h-3.5 rounded-full skeleton" />
					<div className="w-6 h-3.5 rounded-full skeleton" />
				</div>
				<div className="w-12 h-12 rounded-full skeleton my-auto" />
				<div className="w-14 h-3 rounded skeleton" />
			</div>
		)
	}

	const singleHabit = total === 1 ? habits[0] : null
	const displayRatio = singleHabit
		? `${toPersianDigits(singleHabit.today.value)}/${toPersianDigits(singleHabit.target || 1)}`
		: `${toPersianDigits(completedHabitsCount)}/${toPersianDigits(total)}`

	const footerText =
		total === 0
			? 'افزودن عادت +'
			: isAllCompleted
				? 'تکمیل شد ✨'
				: singleHabit
					? `${toPersianDigits(singleHabit.today.value)} از ${toPersianDigits(singleHabit.target || 1)} انجام شد`
					: completedHabitsCount > 0
						? `${toPersianDigits(completedHabitsCount)} از ${toPersianDigits(total)} عادت انجام شد`
						: `${toPersianDigits(percent)}٪ از اهداف امروز`

	return (
		<div className="relative flex flex-col justify-between items-center h-full w-full select-none text-center">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-1 text-content min-w-0">
					<Icon name="target" className="w-3.5 h-3.5 text-primary shrink-0" />
					<span className="text-[11px] font-bold truncate">
						{singleHabit?.title || 'عادت‌ها'}
					</span>
				</div>

				{total > 0 && (
					<span className="text-[9px] font-bold text-muted tabular-nums shrink-0">
						{displayRatio}
					</span>
				)}
			</div>

			<div className="relative flex items-center justify-center my-auto">
				{total === 0 ? (
					<div className="flex flex-col items-center justify-center">
						<span className="text-2xl leading-none mb-1">🌱</span>
						<span className="text-[10px] font-medium text-muted">
							عادت‌های خوب
						</span>
					</div>
				) : (
					<>
						<svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
							<path
								className="text-base-300/50"
								stroke="currentColor"
								strokeWidth="3.5"
								fill="none"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							/>
							<path
								className={cn(
									'transition-all duration-700 ease-out',
									isAllCompleted ? 'text-success' : 'text-primary'
								)}
								stroke="currentColor"
								strokeWidth="3.5"
								strokeDasharray={`${percent}, 100`}
								strokeLinecap="round"
								fill="none"
								d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span
								className={cn(
									'text-xs font-black tracking-tight tabular-nums leading-none',
									isAllCompleted ? 'text-success' : 'text-content'
								)}
							>
								{toPersianDigits(percent)}٪
							</span>
						</div>
					</>
				)}
			</div>

			<div className="w-full flex items-center justify-center text-center">
				<span
					className={cn(
						'text-[10px] font-medium truncate max-w-full',
						total === 0
							? 'text-primary font-bold'
							: isAllCompleted
								? 'text-success font-bold'
								: 'text-muted'
					)}
				>
					{footerText}
				</span>
			</div>
		</div>
	)
}

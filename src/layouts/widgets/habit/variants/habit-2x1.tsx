import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { HABIT_UNIT_STEP } from '@/common/constant/habit-options'
import { playAlarm } from '@/common/play-alarm'
import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { IconLoading } from '@/components/ui'
import type { WidgetifyDate } from '@/layouts/widgets/calendar/utils'
import { safeAwait } from '@/services/api'
import { HabitComparison, type Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { Icon } from '@/src/icons'
import { SegmentedProgressRing } from '../components/item/button.progress-ring'
import { SimpleProgressRing } from '../components/item/button.simple-progress-ring'

interface HabitCompactWideProps {
	habits: Habit[]
	isLoading: boolean
	today: WidgetifyDate
	onChanged: () => void
	onAddHabit?: () => void
	onViewDetails?: (habitId: string) => void
}

export function HabitCompactWide({
	habits,
	isLoading,
	today,
	onChanged,
	onAddHabit,
	onViewDetails,
}: HabitCompactWideProps) {
	const { mutateAsync: logProgress, isPending } = useLogHabitProgress()
	const [selectedId, setSelectedId] = useState<string | null>(habits[0]?.id ?? null)

	useEffect(() => {
		if (habits.length === 0) {
			setSelectedId(null)
			return
		}
		if (!habits.some((h) => h.id === selectedId)) {
			setSelectedId(habits[0].id)
		}
	}, [habits, selectedId])

	if (isLoading) {
		return (
			<div className="flex flex-col justify-center w-full h-full gap-2 select-none">
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 rounded-full shrink-0 skeleton" />
					<div className="flex flex-col flex-1 min-w-0 gap-1.5">
						<div className="w-20 h-3 rounded-full skeleton" />
						<div className="w-14 h-2.5 rounded-full skeleton" />
					</div>
				</div>
				<div className="flex items-center gap-1">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="w-5 h-5 rounded-full skeleton" />
					))}
				</div>
			</div>
		)
	}

	const selectedHabit = habits.find((h) => h.id === selectedId) || null

	if (habits.length === 0 || !selectedHabit) {
		return (
			<div
				onClick={onAddHabit}
				className="flex items-center w-full h-full gap-2.5 text-right transition-transform cursor-pointer select-none active:scale-[0.98]"
			>
				<div className="flex items-center justify-center w-10 h-10 text-xl rounded-full shrink-0 bg-primary/10">
					🌱
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-xs font-bold truncate text-content">عادت‌های خوب</p>
					<p className="text-[10px] font-medium truncate text-primary">
						افزودن عادت +
					</p>
				</div>
			</div>
		)
	}

	const color = selectedHabit.color || '#536dfe'
	const target = selectedHabit.target || 1
	const value = selectedHabit.today.value
	const isSimpleHabit = target === 1
	const isDone = selectedHabit.today.isDone || value >= target

	const handleQuickLog = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return

		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		let step = HABIT_UNIT_STEP[selectedHabit.unit] || 1
		if (selectedHabit.comparison === HabitComparison.EXACT && value + step > target) {
			step = 0
		}
		if (
			selectedHabit.comparison === HabitComparison.AT_MOST &&
			value + step > target
		) {
			showToast(`مقدار فعلی به حداکثر هدف (${target}) رسیده است`, 'error')
			return
		}

		const [error] = await safeAwait(
			logProgress({ id: selectedHabit.id, input: { date, amount: step } })
		)
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}
		playAlarm('info')
		Analytics.event('habit_quick_log_wide')
		onChanged()
	}

	return (
		<div className="flex items-stretch w-full h-full gap-2 select-none" dir="rtl">
			<div className="flex items-center flex-1 min-w-0 gap-2">
				<button
					type="button"
					onClick={handleQuickLog}
					disabled={isPending}
					className="relative flex items-center justify-center w-10 h-10 transition-all duration-200 rounded-full cursor-pointer shrink-0 active:scale-95 disabled:opacity-70"
					style={{ backgroundColor: `${color}22`, color }}
				>
					{!isSimpleHabit && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							{target > 6 ? (
								<SimpleProgressRing
									value={value}
									target={target}
									color={color}
									size={40}
									strokeWidth={3}
								/>
							) : (
								<SegmentedProgressRing
									value={value}
									target={target}
									color={color}
									size={40}
									strokeWidth={3}
									gap={6}
								/>
							)}
						</div>
					)}

					<div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full">
						{isPending ? (
							<IconLoading className="text-current" />
						) : isDone || isSimpleHabit ? (
							<Icon name="check" size={13} strokeWidth={2.5} />
						) : (
							<Icon name="plus" size={13} strokeWidth={3} />
						)}
					</div>
				</button>

				<div
					onClick={() => onViewDetails?.(selectedHabit.id)}
					className="flex-1 min-w-0 cursor-pointer group/title"
					title="مشاهده جزئیات عادت"
				>
					<p className="text-xs font-bold truncate text-content group-hover/title:text-primary transition-colors">
						{selectedHabit.title}
					</p>
					<p className="text-[9px] font-medium truncate text-muted">
						{value} از {target} امروز
					</p>
				</div>

				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						onViewDetails?.(selectedHabit.id)
					}}
					className="flex items-center justify-center w-6 h-6 rounded-lg text-base-content/40 hover:text-content hover:bg-base-content/10 transition-colors cursor-pointer shrink-0"
					title="جزئیات عادت"
				>
					<Icon name="chevronLeft" size={13} />
				</button>
			</div>

			{habits.length > 1 && (
				<div className="flex flex-col items-center justify-center gap-2 py-2 pl-2 pr-2 overflow-y-auto border-r shrink-0 scrollbar-none border-base-content/10">
					{habits.map((habit) => {
						const habitTarget = habit.target || 1
						const habitProgress = Math.min(habit.today.value / habitTarget, 1)
						const habitColor = habit.color || '#536dfe'
						const habitDone =
							habit.today.isDone || habit.today.value >= habitTarget
						const isSelected = habit.id === selectedId

						return (
							<button
								key={habit.id}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									setSelectedId(habit.id)
								}}
								className={cn(
									'flex items-center justify-center text-[9px] rounded-full w-[18px] h-[18px] shrink-0 transition-all duration-200 cursor-pointer',
									isSelected && 'scale-125'
								)}
								style={{
									backgroundColor: habitDone
										? habitColor
										: `${habitColor}22`,
									color: habitDone
										? getContrastingTextColor(habitColor)
										: habitColor,
									opacity: habitDone ? 1 : 0.45 + habitProgress * 0.55,
									boxShadow: isSelected
										? `0 0 0 2px ${habitColor}`
										: 'none',
								}}
								title={habit.title}
							>
								{habit.emoji || '🎯'}
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}

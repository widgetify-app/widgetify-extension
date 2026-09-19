import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getContrastingTextColor } from '@/common/color'
import { playAlarm } from '@/common/play-alarm'
import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { IconLoading } from '@/components/ui'
import type { WidgetifyDate } from '@widget/calendar/utils/date-events'
import { Icon } from '@/icons'
import { safeAwait } from '@/services/api'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { useLogHabitProgress } from '@/services/hooks/habit/log-habit-progress.hook'
import { HabitError } from '../components/habit-error'
import { SegmentedProgressRing } from '../components/item/button-progress-ring'
import { SimpleProgressRing } from '../components/item/button-simple-progress-ring'
import { resolveHabitStep } from '../utils/habit-step'

const DEFAULT_HABIT_COLOR = '#536dfe'

interface HabitCompactWideProps {
	habits: Habit[]
	isLoading: boolean
	isError: boolean
	isAuthenticated: boolean
	today: WidgetifyDate
	onChanged: () => void
	onRefresh: () => void
	onAddHabit?: () => void
	onViewDetails?: (habitId: string) => void
}

export function HabitCompactWide({
	habits,
	isLoading,
	isError,
	isAuthenticated,
	today,
	onChanged,
	onRefresh,
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
					{Array.from({ length: 4 }, (_, i) => (
						<div
							key={`habit-dot-skeleton-${i}`}
							className="w-5 h-5 rounded-full skeleton"
						/>
					))}
				</div>
			</div>
		)
	}

	if (isError && isAuthenticated) {
		return <HabitError compact onRetry={onRefresh} />
	}

	const selectedHabit = habits.find((h) => h.id === selectedId) || null

	if (habits.length === 0 || !selectedHabit) {
		return (
			<button
				type="button"
				onClick={onAddHabit}
				className="flex items-center w-full h-full gap-2.5 text-right transition-transform cursor-pointer select-none active:scale-[0.98] focus-visible:focus-ring"
			>
				<span className="flex items-center justify-center w-10 h-10 text-xl rounded-full shrink-0 bg-brand-subtle">
					🌱
				</span>
				<span className="flex-1 min-w-0">
					<span className="block text-xs font-bold truncate text-content">
						عادت‌های خوب
					</span>
					<span className="block text-[10px] font-medium truncate text-primary">
						افزودن عادت +
					</span>
				</span>
			</button>
		)
	}

	const color = selectedHabit.color || DEFAULT_HABIT_COLOR
	const target = selectedHabit.target || 1
	const value = selectedHabit.today.value
	const isSimpleHabit = target === 1
	const isDone = selectedHabit.today.isDone || value >= target

	const handleQuickLog = async (e: React.MouseEvent) => {
		e.stopPropagation()
		if (isPending) return

		const { amount, blockedMessage } = resolveHabitStep(selectedHabit, value)
		if (blockedMessage) {
			showToast(blockedMessage, 'error')
			return
		}

		const date = today.clone().doAsGregorian().format('YYYY-MM-DD')
		const [error] = await safeAwait(
			logProgress({ id: selectedHabit.id, input: { date, amount } })
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
					aria-label={`ثبت پیشرفت ${selectedHabit.title}`}
					className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-ui shrink-0 active:scale-95 disabled:opacity-70 focus-visible:focus-ring"
					style={{ backgroundColor: `${color}22`, color }}
				>
					{!isSimpleHabit && (
						<span className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
						</span>
					)}

					<span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full">
						{isPending ? (
							<IconLoading className="text-current" />
						) : isDone || isSimpleHabit ? (
							<Icon
								name="check"
								size={13}
								strokeWidth={2.5}
								aria-hidden="true"
							/>
						) : (
							<Icon
								name="plus"
								size={13}
								strokeWidth={3}
								aria-hidden="true"
							/>
						)}
					</span>
				</button>

				<button
					type="button"
					onClick={() => onViewDetails?.(selectedHabit.id)}
					aria-label={`جزئیات ${selectedHabit.title}`}
					className="flex-1 min-w-0 text-right cursor-pointer group/title focus-visible:focus-ring"
				>
					<span className="block text-xs font-bold truncate transition-colors text-content group-hover/title:text-primary">
						{selectedHabit.title}
					</span>
					<span className="block text-[9px] font-medium truncate text-muted">
						{value} از {target} امروز
					</span>
				</button>

				<span
					onClick={() => onViewDetails?.(selectedHabit.id)}
					aria-hidden="true"
					className="flex items-center justify-center cursor-pointer w-6 h-6 rounded-lg text-muted shrink-0"
				>
					<Icon name="chevronLeft" size={13} />
				</span>
			</div>

			<div className="flex flex-col items-center justify-center-safe gap-2 py-2 pl-2 pr-2 overflow-y-auto border-r shrink-0 scrollbar-none border-subtle">
				{habits.map((habit) => {
					const habitTarget = habit.target || 1
					const habitProgress = Math.min(habit.today.value / habitTarget, 1)
					const habitColor = habit.color || DEFAULT_HABIT_COLOR
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
							aria-pressed={isSelected}
							aria-label={habit.title}
							title={habit.title}
							className={cn(
								'flex items-center justify-center text-[9px] rounded-full w-[18px] h-[18px] shrink-0 transition-ui cursor-pointer',
								'focus-visible:focus-ring',
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
						>
							{habit.emoji || '🎯'}
						</button>
					)
				})}

				{onAddHabit && (
					<button
						type="button"
						onClick={onAddHabit}
						aria-label="عادت جدید"
						title="عادت جدید"
						className="flex items-center justify-center w-[18px] h-[18px] rounded-full shrink-0 cursor-pointer text-muted bg-hovered transition-ui hover:text-strong hover:bg-strong focus-visible:focus-ring"
					>
						<Icon name="plus" size={11} aria-hidden="true" />
					</button>
				)}
			</div>
		</div>
	)
}

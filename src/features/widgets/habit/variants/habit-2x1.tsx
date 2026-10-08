import { useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useGeneralSetting } from '@/context/general-setting.context'
import { CompactPager } from '@/features/widgets/components/compact-pager'
import { WidgetCompactEmpty } from '@/features/widgets/components/widget-compact-empty'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { HabitLogButton } from '../components/item/habit-log-button'
import type { useHabitActions } from '../hooks/use-habit-actions'
import { formatHabitToday } from '../utils/habit-goal'

interface Habit2x1Props {
	actions: ReturnType<typeof useHabitActions>
	today: WidgetifyDate
}

export function Habit2x1(props: Habit2x1Props) {
	return (
		<div className="flex-1 min-h-0">
			<HabitCompactContent {...props} />
		</div>
	)
}

function HabitCompactContent({ actions, today }: Habit2x1Props) {
	const { blurMode } = useGeneralSetting()
	const [currentId, setCurrentId] = useState<string | null>(null)
	const {
		habits,
		isLoading,
		isError,
		refetch,
		onRefresh,
		openAddHabit,
		openHabitDetail,
	} = actions

	if (isLoading) {
		return (
			<div aria-hidden="true" className="flex items-center h-full gap-2.5 px-2">
				<div className="rounded-full size-8 skeleton shrink-0" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-3/4 h-3 rounded-sm skeleton" />
					<div className="w-1/2 h-2 rounded-sm skeleton" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<WidgetError
				message="نتونستیم عادت‌ها رو بیاریم"
				compact
				onRetry={onRefresh}
			/>
		)
	}

	if (habits.length === 0) {
		return (
			<WidgetCompactEmpty
				icon="strike"
				title="یه عادت خوب شروع کن"
				description="مثلاً روزی ۸ لیوان آب"
				action={{ label: 'عادت جدید', onClick: openAddHabit }}
			/>
		)
	}

	const index = Math.max(
		0,
		habits.findIndex((habit) => habit.id === currentId)
	)
	const habit = habits[index]
	const isLast = index === habits.length - 1

	return (
		<div className="flex items-center h-full gap-1">
			<div
				className={cn(
					'flex items-center flex-1 h-full min-w-0 gap-2.5 px-2 rounded-xl transition-ui hover:bg-fill',
					blurMode ? 'blur-mode' : 'disabled-blur-mode'
				)}
			>
				<HabitLogButton
					habit={habit}
					today={today}
					onLogged={() => {
						Analytics.event('habit_quick_log_wide')
						refetch()
					}}
				/>
				<button
					type="button"
					onClick={() => openHabitDetail(habit.id)}
					aria-label={`جزئیات ${habit.title}`}
					className="flex flex-col flex-1 min-w-0 py-1 rounded-lg cursor-pointer text-start leading-control focus-visible:focus-ring"
				>
					<span className="text-xs font-semibold truncate text-fg">
						{habit.title}
					</span>
					<span className="truncate text-3xs text-fg-faint">
						{formatHabitToday(habit)} · {index + 1} از {habits.length}
					</span>
				</button>
			</div>

			<CompactPager
				previousLabel="عادت قبلی"
				nextLabel="عادت بعدی"
				onPrevious={() => setCurrentId(habits[index - 1].id)}
				onNext={() => setCurrentId(habits[index + 1].id)}
				isPreviousDisabled={index === 0}
				isNextDisabled={isLast}
			/>
		</div>
	)
}

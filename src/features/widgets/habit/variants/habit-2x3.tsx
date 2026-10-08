import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { HabitEmpty } from '../components/habit-empty'
import { HabitItem } from '../components/item/habit-item'
import { HabitItemSkeleton } from '../components/item/habit-item-skeleton'
import type { useHabitActions } from '../hooks/use-habit-actions'

const SKELETON_COUNT = 4

interface Habit2x3Props {
	actions: ReturnType<typeof useHabitActions>
	today: WidgetifyDate
}

export function Habit2x3({ actions, today }: Habit2x3Props) {
	const { blurMode } = useGeneralSetting()
	const {
		habits,
		isLoading,
		isError,
		refetch,
		openAddHabit,
		openHabitDetail,
		onRefresh,
	} = actions

	const body = isLoading ? (
		<div className="flex flex-col gap-0.5">
			{Array.from({ length: SKELETON_COUNT }, (_, i) => (
				<HabitItemSkeleton key={`habit-skeleton-${i}`} />
			))}
		</div>
	) : isError ? (
		<WidgetError message="نتونستیم عادت‌ها رو بیاریم" onRetry={onRefresh} />
	) : habits.length === 0 ? (
		<HabitEmpty onAdd={openAddHabit} />
	) : (
		<ul
			className={cn(
				'flex flex-col gap-0.5',
				blurMode ? 'blur-mode' : 'disabled-blur-mode'
			)}
		>
			{habits.map((habit) => (
				<li key={habit.id}>
					<HabitItem
						habit={habit}
						today={today}
						onChanged={refetch}
						onViewDetails={() => openHabitDetail(habit.id)}
					/>
				</li>
			))}
		</ul>
	)

	return (
		<section
			aria-label="عادت‌ها"
			aria-busy={isLoading}
			className="flex-1 min-h-0 overflow-y-auto scrollbar-none"
		>
			{body}
		</section>
	)
}

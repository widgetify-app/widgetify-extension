import { cn } from '@/common/utils/cn'
import type { WidgetifyDate } from '@/common/utils/date-events'
import { useGeneralSetting } from '@/context/general-setting.context'
import { BoardSummary } from '@/features/widgets/components/board-summary'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { HabitEmpty, HabitSignedOut } from '../components/habit-empty'
import { HabitItem } from '../components/item/habit-item'
import { HabitItemSkeleton } from '../components/item/habit-item-skeleton'
import { HabitWeek, HabitWeekHeader } from '../components/item/habit-week'
import type { useHabitActions } from '../hooks/use-habit-actions'
import { isHabitDoneToday } from '../utils/habit-goal'

const SKELETON_COUNT = 4

interface Habit4x3Props {
	actions: ReturnType<typeof useHabitActions>
	today: WidgetifyDate
}

export function Habit4x3({ actions, today }: Habit4x3Props) {
	const { blurMode } = useGeneralSetting()
	const {
		isAuthenticated,
		habits,
		isLoading,
		isError,
		refetch,
		openAddHabit,
		openHabitDetail,
		onRefresh,
	} = actions

	const todayKey = today.clone().doAsGregorian().format('YYYY-MM-DD')
	const total = habits.length
	const done = habits.filter(isHabitDoneToday).length
	const percent = total > 0 ? Math.round((done / total) * 100) : 0
	const showStats = isAuthenticated && !isLoading && !isError && total > 0

	const content = !isAuthenticated ? (
		<HabitSignedOut />
	) : isLoading ? (
		<div className="flex flex-col gap-0.5 pt-5">
			{Array.from({ length: SKELETON_COUNT }, (_, i) => (
				<HabitItemSkeleton key={`habit-board-skeleton-${i}`} />
			))}
		</div>
	) : isError ? (
		<WidgetError message="نتونستیم عادت‌ها رو بیاریم" onRetry={onRefresh} />
	) : total === 0 ? (
		<HabitEmpty onAdd={openAddHabit} />
	) : (
		<>
			<HabitWeekHeader days={habits[0].history} todayKey={todayKey} />
			<ul
				className={cn(
					'flex flex-col flex-1 min-h-0 gap-0.5 overflow-y-auto scrollbar-none',
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
							trailing={<HabitWeek habit={habit} />}
						/>
					</li>
				))}
			</ul>
		</>
	)

	return (
		<div className="flex flex-1 min-h-0 gap-3">
			<section
				aria-label="عادت‌ها"
				aria-busy={isLoading}
				className="flex flex-col flex-1 min-w-0 min-h-0"
			>
				{content}
			</section>

			{showStats && (
				<BoardSummary
					label="خلاصه‌ی عادت‌های امروز"
					percent={percent}
					percentLabel={`${percent} درصد عادت‌های امروز انجام شده`}
					caption="امروز"
					stats={[
						{ label: 'انجام‌شده', value: done },
						{ label: 'انجام‌نشده', value: total - done },
					]}
				/>
			)}
		</div>
	)
}

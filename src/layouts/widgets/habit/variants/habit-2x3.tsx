import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Button, Tooltip } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@widget/calendar/utils/date-events'
import { Icon } from '@/icons'
import { HabitEmpty } from '../components/habit-empty'
import { HabitError } from '../components/habit-error'
import { HabitItemSkeleton } from '../components/item/habit-item-skeleton'
import { HabitItem } from '../components/item/habit-item'
import type { useHabitActions } from '../hooks/use-habit-actions'

const SKELETON_COUNT = 3

interface Habit2x3Props {
	actions: ReturnType<typeof useHabitActions>
}

export const Habit2x3: React.FC<Habit2x3Props> = ({ actions }) => {
	const { selected_timezone: timezone, blurMode } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)

	const {
		isAuthenticated,
		habits,
		isLoading,
		isError,
		isRefetching,
		refetch,
		openAddHabit,
		openHabitDetail,
		onRefresh,
	} = actions

	const isWaiting = isLoading || isRefetching
	const isEmpty = (!isLoading && habits.length === 0) || !isAuthenticated

	return (
		<section className="flex flex-col h-full" aria-label="عادت‌ها">
			<header className="flex items-center justify-between flex-none pb-1">
				<Tooltip content="عادت جدید">
					<Button
						variant="ghost"
						size="sm"
						aria-label="عادت جدید"
						className="w-7 h-7 p-0! border-none! hover:text-primary rounded-xl shrink-0 active:scale-95 transition-colors"
						onClick={openAddHabit}
					>
						<Icon name="plus" size={16} aria-hidden="true" />
					</Button>
				</Tooltip>

				<Tooltip content="بارگذاری مجدد">
					<Button
						variant="ghost"
						size="sm"
						aria-label="بارگذاری مجدد"
						className="w-7 h-7 p-0! border-none! rounded-xl shrink-0 active:scale-95 transition-colors"
						onClick={onRefresh}
					>
						<Icon
							name="refresh"
							size={15}
							aria-hidden="true"
							className={cn(
								'opacity-60 hover:opacity-100',
								isWaiting && 'animate-spin'
							)}
						/>
					</Button>
				</Tooltip>
			</header>

			<div className="mt-1 overflow-hidden grow">
				<div
					aria-busy={isLoading}
					className="h-full space-y-1.5 overflow-y-auto scrollbar-none"
				>
					{isLoading ? (
						<div className="flex flex-col gap-1.5">
							{Array.from({ length: SKELETON_COUNT }, (_, i) => (
								<HabitItemSkeleton key={`habit-skeleton-${i}`} />
							))}
						</div>
					) : isError && isAuthenticated ? (
						<HabitError onRetry={onRefresh} />
					) : isEmpty ? (
						<HabitEmpty />
					) : (
						<ul
							className={cn(
								'flex flex-col gap-1.5',
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
					)}
				</div>
			</div>
		</section>
	)
}

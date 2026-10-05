import { lazy, Suspense, useEffect, useState } from 'react'
import { getCurrentDate } from '@/common/utils/date-events'
import { Button, Modal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { WidgetError } from '@/features/widgets/components/widget-error'
import { Icon } from '@/icons'
import { useGetHabitDetail } from '@/services/habit/get-habit-detail.hook'
import type { Habit } from '@/services/habit/habit.interface'
import { DEFAULT_HABIT_COLOR } from '../../constants'
import { formatHabitGoal, formatHabitToday } from '../../utils/habit-goal'
import { HabitContributionChart } from './habit-contribution-chart'
import { HabitStatsCards } from './habit-stats-cards'

const HabitShareModal = lazy(() =>
	import('../habit-share-modal').then((module) => ({
		default: module.HabitShareModal,
	}))
)

interface HabitDetailModalProps {
	isOpen: boolean
	habitId: string | null
	onClose: () => void
	onEdit: (habit: Habit) => void
	onDelete: () => void
	isDeleting: boolean
}

export function HabitDetailModal({
	isOpen,
	habitId,
	onClose,
	onEdit,
	onDelete,
	isDeleting,
}: HabitDetailModalProps) {
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const [isShareOpen, setIsShareOpen] = useState(false)
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

	const {
		data: habit,
		isLoading,
		isError,
		refetch,
	} = useGetHabitDetail(habitId ?? '', isOpen && isAuthenticated)

	useEffect(() => {
		if (isOpen) setIsConfirmingDelete(false)
	}, [isOpen, habitId])

	const color = habit?.color || DEFAULT_HABIT_COLOR

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} size="lg" title={habit?.title}>
				{isLoading ? (
					<HabitDetailSkeleton />
				) : isError ? (
					<div className="h-60">
						<WidgetError
							message="نتونستیم جزئیات این عادت رو بیاریم"
							onRetry={() => refetch()}
						/>
					</div>
				) : !habit ? (
					<p className="py-16 text-xs text-center text-fg-muted">
						این عادت پیدا نشد
					</p>
				) : (
					<div className="flex flex-col gap-3.5">
						<div className="flex items-center gap-3">
							<span
								aria-hidden="true"
								className="grid text-xl rounded-xl place-items-center size-11 shrink-0"
								style={{ backgroundColor: `${color}22` }}
							>
								{habit.emoji || '🎯'}
							</span>
							<div className="flex flex-col min-w-0 gap-0.5 leading-control">
								<span className="text-xs font-semibold truncate text-fg">
									{formatHabitGoal(habit)}
								</span>
								<span className="truncate text-2xs text-fg-muted">
									{formatHabitToday(habit)}
								</span>
							</div>
						</div>

						<HabitStatsCards habit={habit} today={today} />

						<HabitContributionChart
							habit={habit}
							color={color}
							today={today}
						/>

						{isConfirmingDelete ? (
							<div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-danger-fill">
								<span className="flex-1 text-xs text-fg">
									این عادت و سابقه‌اش برای همیشه حذف بشه؟
								</span>
								<Button
									size="sm"
									variant="ghost"
									rounded="lg"
									onClick={() => setIsConfirmingDelete(false)}
									disabled={isDeleting}
								>
									نه
								</Button>
								<Button
									size="sm"
									color="danger"
									rounded="lg"
									onClick={onDelete}
									disabled={isDeleting}
								>
									{isDeleting ? 'در حال حذف…' : 'حذف'}
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-1.5 pt-1">
								<Button
									size="md"
									variant="ghost"
									color="danger"
									rounded="xl"
									onClick={() => setIsConfirmingDelete(true)}
									icon={<Icon name="trash" size={14} />}
								>
									حذف
								</Button>
								<Button
									size="md"
									rounded="xl"
									onClick={() => onEdit(habit)}
									icon={<Icon name="pen" size={14} />}
									className="w-1/4 ms-auto"
								>
									ویرایش
								</Button>
								<Button
									color="brand"
									size="md"
									rounded="xl"
									onClick={() => setIsShareOpen(true)}
									icon={<Icon name="camera" size={14} />}
									className="flex-1"
								>
									اشتراک‌گذاری تصویر
								</Button>
							</div>
						)}
					</div>
				)}
			</Modal>

			{habit && (
				<Suspense fallback={null}>
					<HabitShareModal
						isOpen={isShareOpen}
						onClose={() => setIsShareOpen(false)}
						habit={habit}
						color={color}
					/>
				</Suspense>
			)}
		</>
	)
}

function HabitDetailSkeleton() {
	return (
		<div aria-hidden="true" className="flex flex-col gap-3.5">
			<div className="flex items-center gap-3">
				<div className="rounded-xl size-11 shrink-0 skeleton" />
				<div className="flex flex-col flex-1 gap-1.5">
					<div className="w-1/2 h-3 rounded-sm skeleton" />
					<div className="w-1/3 h-2.5 rounded-sm skeleton" />
				</div>
			</div>
			<div className="h-14 rounded-2xl skeleton" />
			<div className="h-52 rounded-2xl skeleton" />
			<div className="h-10 rounded-xl skeleton" />
		</div>
	)
}

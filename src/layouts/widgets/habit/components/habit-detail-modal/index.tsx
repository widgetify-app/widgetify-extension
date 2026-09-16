import { lazy, Suspense, useState } from 'react'
import { Button, Modal } from '@/components/ui'
import { useGetHabitDetail } from '@/services/hooks/habit/get-habit-detail.hook'
import { HabitCalendar } from './habit-calendar-heatmap'
import { HabitContributionChart } from './habit-contribution-chart'
import { HabitStatsCards } from './habit-stats-cards'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { getCurrentDate } from '@widget/calendar/utils/date-events'
import { formatHabitGoal } from '../../utils/habit-goal'
import { Dropdown } from '@/components/ui'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'
import { DEFAULT_HABIT_COLOR } from '../../constants'

const HabitShareModal = lazy(() =>
	import('../habit-share-modal').then((module) => ({
		default: module.HabitShareModal,
	}))
)

interface ModalProps {
	isOpen: boolean
	habitId: string | null
	onClose: () => void
	onEdit: (habit: Habit) => void
	onArchive: () => void
}

export function HabitDetailModal({
	isOpen,
	habitId,
	onClose,
	onArchive,
	onEdit,
}: ModalProps) {
	const { isAuthenticated } = useAuth()
	const { selected_timezone: timezone } = useGeneralSetting()
	const today = getCurrentDate(timezone.value)
	const [activeView, setActiveView] = useState<'contribution' | 'calendar'>(
		'contribution'
	)
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)

	const onClickEdit = () => {
		if (habit) {
			callEvent('closeAllDropdowns')
			onEdit(habit)
		}
	}

	const onClickArchive = () => {
		if (habit) {
			callEvent('closeAllDropdowns')
			onArchive()
		}
	}

	const {
		data: habit,
		isLoading,
		error,
	} = useGetHabitDetail(habitId || '', isOpen && isAuthenticated)

	const color = habit?.color || DEFAULT_HABIT_COLOR

	const title =
		isLoading || !habit ? (
			<div className="flex items-center gap-2">
				<div className="rounded-lg w-7 h-7 skeleton" />
				<div className="flex flex-col flex-1 gap-2">
					<div className="h-4 rounded w-28 skeleton" />
					<div className="w-16 h-3 rounded skeleton" />
				</div>
			</div>
		) : (
			<div className="flex items-center gap-2">
				<div
					className="flex items-center justify-center rounded-lg w-7 h-7 shrink-0"
					style={{
						backgroundColor: `${color}22`,
					}}
				>
					{habit.emoji || '🎯'}
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center text-xs text-content gap-x-1">
						<p className="font-medium truncate ">{habit.title}</p>
						<Dropdown
							trigger={
								<Button
									size="xs"
									aria-label="گزینه‌های عادت"
									rounded={'xl'}
									className="w-7 h-7 p-0! text-muted hover:text-strong border-subtle"
								>
									<Icon
										name="menuOption"
										size={15}
										aria-hidden="true"
									/>
								</Button>
							}
						>
							<div className="flex flex-col p-2 border bg-content bg-glass border-subtle rounded-2xl">
								<button
									type="button"
									className="w-full px-3 py-1.5 flex items-center gap-x-2 cursor-pointer rounded-lg transition-ui text-content hover:bg-muted focus-visible:focus-ring"
									onClick={onClickEdit}
								>
									<Icon name="pen" size={13} aria-hidden="true" />
									<span className="font-medium">ویرایش</span>
								</button>

								<button
									type="button"
									className="w-full px-3 py-1.5 flex items-center gap-x-2 cursor-pointer rounded-lg transition-ui text-error hover:bg-error/10 focus-visible:focus-ring"
									onClick={onClickArchive}
								>
									<Icon name="trash" size={14} aria-hidden="true" />
									<span className="font-medium">حذف عادت</span>
								</button>
							</div>
						</Dropdown>
					</div>
					<p className="text-[10px] truncate text-muted">
						{formatHabitGoal(habit)}
					</p>
				</div>
			</div>
		)

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				direction="rtl"
				size="lg"
				title={title}
			>
				{isLoading ? (
					<div className="p-2">
						<div className="w-full h-85 rounded-2xl skeleton" />
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-sm font-medium text-content">
							خطا در دریافت اطلاعات
						</p>
						<p className="mt-1 text-xs text-muted">
							لطفا چند لحظه دیگر دوباره تلاش کنید
						</p>
					</div>
				) : !habit ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<div className="mb-2 text-3xl">📭</div>
						<p className="text-sm text-muted">اطلاعات این عادت پیدا نشد</p>
					</div>
				) : (
					<div className="flex flex-col gap-3 p-2">
						<HabitStatsCards habit={habit} today={today} />

						<div className="flex flex-col gap-3 p-3 overflow-hidden border rounded-2xl bg-subtle border-subtle">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center p-1 border bg-subtle rounded-2xl border-subtle">
									<button
										type="button"
										onClick={() => setActiveView('contribution')}
										className={cn(
											'flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-ui cursor-pointer select-none',
											activeView === 'contribution'
												? 'bg-muted text-content elevation-sm'
												: 'text-muted hover:text-strong'
										)}
									>
										<Icon name="squares2X2" size={13} />
										<span>نمودار فعالیت</span>
									</button>
									<button
										type="button"
										onClick={() => setActiveView('calendar')}
										className={cn(
											'flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl transition-ui cursor-pointer select-none',
											activeView === 'calendar'
												? 'bg-muted text-content elevation-sm'
												: 'text-muted hover:text-strong'
										)}
									>
										<Icon name="calendar" size={13} />
										<span>تقویم ماهانه</span>
									</button>
								</div>
							</div>

							{activeView === 'contribution' ? (
								<HabitContributionChart
									habit={habit}
									color={color}
									today={today}
								/>
							) : (
								<HabitCalendar
									habit={habit}
									color={color}
									today={today}
								/>
							)}
						</div>
					</div>
				)}

				<div className="flex flex-row w-full gap-2 px-2">
					<Button
						size="md"
						className="flex-1 text-xs"
						rounded="xl"
						onClick={() => setIsShareModalOpen(true)}
					>
						<Icon name="cameraPlus" size={15} />
						اشتراک گذاری
					</Button>
					<Button
						className="flex-1 text-xs"
						size="md"
						rounded="xl"
						onClick={onClickEdit}
					>
						<Icon name="pen" size={14} />
						ویرایش
					</Button>
				</div>
			</Modal>

			{habit && isShareModalOpen && (
				<Suspense fallback={null}>
					<HabitShareModal
						isOpen={isShareModalOpen}
						onClose={() => setIsShareModalOpen(false)}
						habit={habit}
						color={color}
					/>
				</Suspense>
			)}
		</>
	)
}

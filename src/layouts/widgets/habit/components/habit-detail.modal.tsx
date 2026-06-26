import Modal from '@/components/modal'
import { IconLoading } from '@/components/loading/icon-loading'
import { useGetHabitDetail } from '@/services/hooks/habit/get-habit-detail.hook'
import { HabitCalendar } from './habit-calendar-heatmap'
import { useAuth } from '@/context/auth.context'
import { formatHabitGoal } from '../utils'

interface ModalProps {
	isOpen: boolean
	habitId: string | null
	onClose: () => void
}

export function HabitDetailModal({ isOpen, habitId, onClose }: ModalProps) {
	const { isAuthenticated } = useAuth()
	const { data: habit, isLoading } = useGetHabitDetail(
		habitId || '',
		isOpen && isAuthenticated
	)

	if (!habit) return null

	const color = habit.color || '#3b82f6'
	const weekDone = habit.history.filter((h) => h.isDone).length

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			direction="rtl"
			size="md"
			title={
				<div className="flex items-center gap-2">
					<div
						className="flex items-center justify-center text-sm transition-transform rounded-lg w-7 h-7 shrink-0 active:scale-90 disabled:opacity-60"
						style={{
							backgroundColor: `${color}22`,
						}}
					>
						{habit.emoji || '🎯'}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-medium truncate text-content">
							{habit.title}
						</p>
						<p className="text-[10px] truncate text-muted">
							{formatHabitGoal(habit)}
						</p>
					</div>
				</div>
			}
		>
			{isLoading ? (
				<div className="flex items-center justify-center py-8">
					<IconLoading />
				</div>
			) : (
				<div className="space-y-3">
					<div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-content">
						<div className="text-center">
							<p className="text-[10px] text-muted">امروز</p>
							<p className="text-xs font-bold text-content">
								{habit.today.value}/{habit.target}
							</p>
						</div>
						<div className="text-center">
							<p className="text-[10px] text-muted">7 روز</p>
							<p className="text-xs font-bold text-content">{weekDone}/7</p>
						</div>
						<div className="text-center">
							<p className="text-[10px] text-muted">این دوره</p>
							<p className="text-xs font-bold text-content">
								{habit.progressThisPeriod.done}/
								{habit.progressThisPeriod.required}
							</p>
						</div>
					</div>

					<div className="p-2 space-y-1">
						<HabitCalendar habit={habit} color={color} />
					</div>
				</div>
			)}
		</Modal>
	)
}

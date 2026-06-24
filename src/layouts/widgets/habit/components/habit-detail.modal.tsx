import { FiX } from 'react-icons/fi'
import Modal from '@/components/modal'
import type { Habit } from '@/services/hooks/habit/habit.interface'
import { HabitCalendarHeatmap } from './habit-calendar-heatmap'

interface ModalProps {
	isOpen: boolean
	habit: Habit | null
	onClose: () => void
}

export function HabitDetailModal({ isOpen, habit, onClose }: ModalProps) {
	if (!habit) return null

	const color = habit.color || '#3b82f6'
	const weekDone = habit.history.filter((h) => h.isDone).length

	return (
		<Modal isOpen={isOpen} onClose={onClose} direction="rtl" size="sm">
			<div className="space-y-3">
				<div className="flex items-start justify-between">
					<div className="text-2xl">{habit.emoji || '🎯'}</div>
					<button type="button" onClick={onClose} className="p-1">
						<FiX size={16} />
					</button>
				</div>

				<div>
					<h3 className="text-sm font-bold text-content">{habit.title}</h3>
					<p className="mt-1 text-xs text-muted">
						هدف: {habit.target} {habit.customUnit || ''}
					</p>
				</div>

				<div
					className="grid grid-cols-3 gap-2 p-2 rounded-lg"
					style={{ backgroundColor: `${color}08` }}
				>
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

				<div className="p-2 space-y-1 rounded-lg bg-base-300/20">
					<HabitCalendarHeatmap habit={habit} color={color} />
				</div>
			</div>
		</Modal>
	)
}

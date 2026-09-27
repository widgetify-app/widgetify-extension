import type React from 'react'
import { Icon } from '@/icons'

interface HabitErrorProps {
	compact?: boolean
	onRetry: () => void
}

export const HabitError: React.FC<HabitErrorProps> = ({ compact, onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-2 p-2 text-center select-none">
			<Icon name="alert" size={16} className="text-fg-muted" aria-hidden="true" />

			<p className="text-2xs leading-tight text-fg-muted">
				{compact ? 'دریافت نشد' : 'عادت‌ها دریافت نشدند'}
			</p>

			{!compact && (
				<button
					type="button"
					onClick={onRetry}
					className="px-2.5 py-1 text-2xs font-bold rounded-lg cursor-pointer text-fg bg-fill-2 transition-ui hover:bg-fill-3 focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			)}
		</div>
	)
}

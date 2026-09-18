import type React from 'react'
import { Icon } from '@/icons'

interface TodosErrorProps {
	compact?: boolean
	onRetry: () => void
}

export const TodosError: React.FC<TodosErrorProps> = ({ compact, onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-2 p-2 text-center select-none">
			<Icon name="alert" size={16} className="text-muted" aria-hidden="true" />

			<p className="text-[11px] leading-tight text-muted">
				{compact ? 'دریافت نشد' : 'تسک‌ها دریافت نشدند'}
			</p>

			{!compact && (
				<button
					type="button"
					onClick={onRetry}
					className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-content bg-raised transition-ui hover:bg-hovered focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			)}
		</div>
	)
}

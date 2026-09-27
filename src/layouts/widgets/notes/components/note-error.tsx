import type React from 'react'
import { Icon } from '@/icons'

interface NoteErrorProps {
	compact?: boolean
	onRetry: () => void
}

export const NoteError: React.FC<NoteErrorProps> = ({ compact, onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-2 p-2 text-center select-none">
			<Icon name="alert" size={16} className="text-fg-muted" aria-hidden="true" />

			<p className="text-[11px] leading-tight text-fg-muted">
				{compact ? 'دریافت نشد' : 'یادداشت‌ها دریافت نشدند'}
			</p>

			{!compact && (
				<button
					type="button"
					onClick={onRetry}
					className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-fg bg-fill-2 transition-ui hover:bg-fill-3 focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			)}
		</div>
	)
}

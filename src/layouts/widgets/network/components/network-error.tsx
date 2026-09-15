import type React from 'react'
import { Icon } from '@/icons'

interface NetworkErrorProps {
	compact?: boolean
	onRetry: () => void
}

export const NetworkError: React.FC<NetworkErrorProps> = ({ compact, onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full gap-2 p-2 text-center select-none">
			<Icon name="alert" size={16} className="text-muted" aria-hidden="true" />

			<p className="text-[11px] leading-tight text-muted">
				{compact ? 'دریافت نشد' : 'اطلاعات شبکه دریافت نشد'}
			</p>

			{!compact && (
				<button
					type="button"
					onClick={onRetry}
					className="px-2.5 py-1 text-[11px] font-bold rounded-lg cursor-pointer text-content bg-base-content/10 transition-ui hover:bg-base-content/20 focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			)}
		</div>
	)
}

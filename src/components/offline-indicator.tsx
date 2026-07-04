import { Icon } from '../icons'

type OfflineIndicatorMode = 'badge' | 'status' | 'notification'

interface OfflineIndicatorProps {
	mode: OfflineIndicatorMode
	message?: string
}

export const OfflineIndicator = ({ mode, message }: OfflineIndicatorProps) => {
	if (mode === 'badge') {
		return (
			<div className="absolute flex items-center justify-center w-5 h-5 border-2 rounded-full -top-2 -right-2 offline-indicator-badge">
				<Icon name="offline" className="text-xs text-white" />
			</div>
		)
	}

	if (mode === 'status') {
		return (
			<div className="text-xs mt-1 py-0.5 px-2 rounded border offline-indicator-status inline-flex items-center gap-1">
				<Icon name="offline" className="text-xs" />
				<span className="font-light">{message || 'حالت آفلاین'}</span>
			</div>
		)
	}

	return (
		<div className="flex items-center gap-2 p-3 text-sm font-bold border rounded-lg bg-error/20 text-error border-error/20">
			<Icon name="offline" className="text-lg shrink-0" />
			<p>
				{message ||
					'اطلاعات کاربری از حافظه محلی بارگذاری شده‌اند. اتصال اینترنت خود را بررسی کنید.'}
			</p>
		</div>
	)
}

interface Notification {
	id: string
	title: string
	message: string
	type: 'info' | 'warning' | 'success' | 'error'
	timestamp: Date
}

interface NotificationItemProps {
	notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'info':
				return '💡'
			case 'warning':
				return '⚠️'
			case 'success':
				return '✅'
			case 'error':
				return '❌'
			default:
				return '📢'
		}
	}

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'info':
				return 'border-l-info'
			case 'warning':
				return 'border-l-warning'
			case 'success':
				return 'border-l-success'
			case 'error':
				return 'border-l-error'
			default:
				return 'border-l-base-300'
		}
	}

	return (
		<div
			className={`p-2 bg-base-200 rounded-lg border-l-4 ${getTypeColor(notification.type)} hover:bg-base-300 transition-colors`}
		>
			<div className="flex items-start gap-2">
				<span className="text-sm">{getTypeIcon(notification.type)}</span>
				<div className="flex-1 min-w-0">
					<h4 className="text-sm font-medium text-base-content">{notification.title}</h4>
					<p className="mt-1 text-xs text-base-content opacity-70">
						{notification.message}
					</p>
					<p className="mt-1 text-xs opacity-50 text-base-content">
						{notification.timestamp.toLocaleTimeString('fa-IR', {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
				</div>
			</div>
		</div>
	)
}

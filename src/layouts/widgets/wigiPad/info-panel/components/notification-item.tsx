interface Notification {
	content: string // can be HTML
	timestamp: Date | null
}

interface NotificationItemProps {
	notification: Notification
}

export function NotificationItem({ notification }: NotificationItemProps) {
	// Simple check if content contains HTML tags
	const isHtmlContent = /<[^>]*>/g.test(notification.content)

	return (
		<div className="p-3 transition-colors rounded-lg bg-base-200 hover:bg-base-300">
			<div className="flex items-start gap-2">
				<div className="flex-1 min-w-0">
					{isHtmlContent ? (
						<div
							className="text-sm text-base-content"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Content from server can contain HTML
							dangerouslySetInnerHTML={{ __html: notification.content }}
						/>
					) : (
						<p className="text-sm text-base-content">{notification.content}</p>
					)}
					{notification.timestamp && (
						<p className="mt-2 text-xs opacity-50 text-base-content">
							{notification.timestamp.toLocaleTimeString('fa-IR', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

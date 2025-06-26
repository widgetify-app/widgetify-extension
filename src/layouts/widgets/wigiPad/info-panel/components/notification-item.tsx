import type { InfoPanelData } from '../hooks/useInfoPanelData'

interface NotificationItemProps {
	notification: InfoPanelData['notifications'][number]
}

export function NotificationItem({ notification }: NotificationItemProps) {
	return (
		<div className="flex items-start gap-2">
			<div className="flex-1 min-w-0">
				<div
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Content from server can contain HTML
					dangerouslySetInnerHTML={{ __html: notification.content }}
				/>
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
	)
}

import DOMPurify from 'dompurify'
import type { InfoPanelData } from '../hooks/useInfoPanelData'

interface NotificationItemProps {
	notification: InfoPanelData['notifications'][number]
}

export function NotificationItem({ notification }: NotificationItemProps) {
	const safeHTML = DOMPurify.sanitize(notification.content, {
		ALLOWED_TAGS: [
			'div',
			'b',
			'i',
			'em',
			'strong',
			'a',
			'p',
			'br',
			'span',
			'ul',
			'li',
			'img',
		],
		ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt'],
	})

	// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
	return <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
}

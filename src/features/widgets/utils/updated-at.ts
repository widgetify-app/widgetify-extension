import { t } from '@/common/i18n'

export function formatUpdatedAt(timestamp: number): string | null {
	if (!timestamp) return null

	const time = new Date(timestamp).toLocaleTimeString('fa-IR', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	})
	return t('widgets.updatedAt', { time })
}

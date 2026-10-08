import { showToast } from '@/common/toast'
import { t } from '@/common/i18n'

export async function copyIpToClipboard(ip: string | null) {
	if (!ip || !navigator?.clipboard) return

	try {
		await navigator.clipboard.writeText(ip)
		showToast(t('widgets.network.toast.copied'), 'success')
	} catch {
		showToast(t('widgets.network.toast.copyFailed'), 'error')
	}
}

import { showToast } from '@/common/toast'

export async function copyIpToClipboard(ip: string | null) {
	if (!ip || !navigator?.clipboard) return

	try {
		await navigator.clipboard.writeText(ip)
		showToast('آدرس IP کپی شد', 'success')
	} catch {
		showToast('کپی آدرس IP انجام نشد', 'error')
	}
}

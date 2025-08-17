import { getFromStorage } from './storage'

export async function isSyncActive(): Promise<boolean> {
	const syncEnabled = await getFromStorage('enable_sync')
	if (syncEnabled === null) return true

	return syncEnabled === true
}

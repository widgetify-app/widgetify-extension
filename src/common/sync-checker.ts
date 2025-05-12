import { getFromStorage } from './storage'

export async function isSyncActive(): Promise<boolean> {
	const syncEnabled = await getFromStorage('enable_sync')
	return syncEnabled === true || syncEnabled === undefined
}

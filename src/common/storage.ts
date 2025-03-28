import browser from 'webextension-polyfill'
import type { StorageKV } from './constant/store.key'

export async function setToStorage<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K],
) {
	browser.storage.local.set({ [key]: value })
}

export async function getFromStorage<K extends keyof StorageKV>(
	key: K,
): Promise<StorageKV[K] | null> {
	const value = await browser.storage.local.get(key)
	if (!value) return null
	return value[key] as StorageKV[K]
}

export async function removeFromStorage<K extends keyof StorageKV>(key: K) {
	await browser.storage.local.remove(key)
}

import { storage } from 'wxt/utils/storage'
import type { StorageKV } from './constant/store.key'

export async function setToStorage<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K]
) {
	await storage.setItem(`local:${key}`, value)
}

export async function getFromStorage<K extends keyof StorageKV>(
	key: K
): Promise<StorageKV[K] | null> {
	const value = await storage.getItem(`local:${key}`)
	if (!value) return null
	return value as StorageKV[K]
}

export async function removeFromStorage<K extends keyof StorageKV>(key: K) {
	await storage.removeItem(`local:${key}`)
}

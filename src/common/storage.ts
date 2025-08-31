import { storage } from 'wxt/utils/storage'
import type { StorageKV } from './constant/store.key'

export async function setToStorage<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K]
) {
	if (import.meta.env.FIREFOX) {
		await storage.setItem(`local:${key}`, JSON.stringify(value))
	} else await storage.setItem(`local:${key}`, value)
}

export async function getFromStorage<K extends keyof StorageKV>(
	key: K
): Promise<StorageKV[K] | null> {
	const value = await storage.getItem(`local:${key}`)
	if (typeof value === 'boolean') return value as StorageKV[K]
	if (!value) return null
	if (import.meta.env.FIREFOX) {
		return JSON.parse(value as StorageKV[K])
	}

	return value as StorageKV[K]
}

export async function removeFromStorage<K extends keyof StorageKV>(key: K) {
	await storage.removeItem(`local:${key}`)
}

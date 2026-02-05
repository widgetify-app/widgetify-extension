import { storage } from 'wxt/utils/storage'
import type { StorageKV } from './constant/store.key'

export async function setToStorage<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K]
) {
	if (import.meta.env.FIREFOX) {
		try {
			await storage.setItem(`local:${key}`, JSON.stringify(value))
		} catch {
			await storage.setItem(`local:${key}`, value)
		}
	} else await storage.setItem(`local:${key}`, value)
}

export async function getFromStorage<K extends keyof StorageKV>(
	key: K
): Promise<StorageKV[K] | null> {
	const value = await storage.getItem(`local:${key}`)
	if (typeof value === 'boolean') return value as StorageKV[K]
	if (!value) return null

	if (import.meta.env.FIREFOX) {
		try {
			return JSON.parse(value as StorageKV[K])
		} catch {
			return value as StorageKV[K]
		}
	}

	return value as StorageKV[K]
}

export async function getMultipleFromStorage<K extends keyof StorageKV>(
	keys: K[]
): Promise<Partial<Pick<StorageKV, K>>> {
	try {
		const storageKeys = keys.map((key) => `local:${key}`)
		const result = await storage.getItems(storageKeys as any)
		const output: Partial<Pick<StorageKV, K>> = {}
		for (const item of result) {
			const key = item.key.replace('local:', '') as K
			output[key] = item.value
		}

		return output
	} catch {
		return {}
	}
}

export async function clearStorage() {
	await storage.clear('local')
}

export async function removeFromStorage<K extends keyof StorageKV>(key: K) {
	await storage.removeItem(`local:${key}`)
}

export async function setWithExpiry<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K],
	minutes: number
) {
	const safeMinutes = Math.max(1, minutes)
	const expiry = Date.now() + safeMinutes * 60_000
	const data = { value, expiry }

	await setToStorage(key, data as any)
}

export async function getWithExpiry<K extends keyof StorageKV>(
	key: K
): Promise<StorageKV[K] | null> {
	const data = (await getFromStorage(key)) as any

	if (!data || typeof data !== 'object' || !('expiry' in data)) {
		return data
	}

	if (Date.now() > data.expiry) {
		await removeFromStorage(key)
		return null
	}

	return data.value as StorageKV[K]
}

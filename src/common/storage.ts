import { storage } from 'wxt/utils/storage'
import type { StorageKV } from './constants/store.key'

export function sanitizeFirefoxStorageValue<T>(key: string, value: any): T {
	if (typeof value === 'boolean' || typeof value === 'number') {
		return value as T
	}
	if (!value) return value as T

	let parsed = value
	if (typeof parsed === 'string') {
		const trimmed = parsed.trim()
		if (
			(trimmed.startsWith('{') && trimmed.endsWith('}')) ||
			(trimmed.startsWith('[') && trimmed.endsWith(']')) ||
			(trimmed.startsWith('"') && trimmed.endsWith('"'))
		) {
			try {
				parsed = JSON.parse(trimmed)
				if (typeof parsed === 'string') {
					const innerTrimmed = parsed.trim()
					if (
						(innerTrimmed.startsWith('{') && innerTrimmed.endsWith('}')) ||
						(innerTrimmed.startsWith('[') && innerTrimmed.endsWith(']'))
					) {
						try {
							parsed = JSON.parse(innerTrimmed)
						} catch {}
					}
				}
			} catch {}
		}
	}

	if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
		const keys = Object.keys(parsed)
		if (keys.some((k) => /^\d+$/.test(k))) {
			const clean: Record<string, any> = {}
			for (const [k, v] of Object.entries(parsed)) {
				if (!/^\d+$/.test(k)) {
					clean[k] = v
				}
			}
			storage.setItem(`local:${key}`, clean).catch(() => {})
			return clean as T
		}
	}

	return parsed as T
}

export async function setToStorage<K extends keyof StorageKV>(
	key: K,
	value: StorageKV[K]
) {
	if (import.meta.env.FIREFOX) {
		let cleanValue = value
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			const keys = Object.keys(value)
			if (keys.some((k) => /^\d+$/.test(k))) {
				const clean: Record<string, any> = {}
				for (const [k, v] of Object.entries(value)) {
					if (!/^\d+$/.test(k)) {
						clean[k] = v
					}
				}
				cleanValue = clean as StorageKV[K]
			}
		}
		await storage.setItem(`local:${key}`, cleanValue)
	} else {
		await storage.setItem(`local:${key}`, value)
	}
}

export async function getFromStorage<K extends keyof StorageKV>(
	key: K
): Promise<StorageKV[K] | null> {
	const value = await storage.getItem(`local:${key}`)
	if (typeof value === 'boolean') return value as StorageKV[K]
	if (!value) return null

	if (import.meta.env.FIREFOX) {
		return sanitizeFirefoxStorageValue<StorageKV[K]>(key, value)
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
			if (import.meta.env.FIREFOX) {
				output[key] = sanitizeFirefoxStorageValue<StorageKV[K]>(key, item.value)
			} else {
				output[key] = item.value
			}
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

export const DEPRECATED_STORAGE_KEYS = [
	'petState',
	'calendarDrawerState',
	'compact_currencies',
	'todos',
	'deletedTodos',
	'seenTodoNewViewMode',
] as const

export async function purgeDeprecatedStorageKeys() {
	await Promise.all(
		DEPRECATED_STORAGE_KEYS.map((key) => storage.removeItem(`local:${key}`))
	)
}

export function watchStorage<K extends keyof StorageKV>(
	key: K,
	callback: (newValue: StorageKV[K] | null, oldValue: StorageKV[K] | null) => void
) {
	if (import.meta.env.FIREFOX) {
		return storage.watch<any>(`local:${key}`, (newValue, oldValue) => {
			callback(
				sanitizeFirefoxStorageValue<StorageKV[K]>(key, newValue),
				sanitizeFirefoxStorageValue<StorageKV[K]>(key, oldValue)
			)
		})
	}

	return storage.watch<StorageKV[K]>(`local:${key}`, callback)
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
	const data = await getFromStorage(key as any)
	if (!data) return null

	const { value, expiry } = data as any
	if (Date.now() > expiry) {
		await removeFromStorage(key)
		return null
	}

	return value as StorageKV[K]
}

import type { StoreKeyType } from './constant/store.key'

export function setToStorage<T>(key: StoreKeyType, value: T) {
	localStorage.setItem(key, JSON.stringify(value))
}

export function getFromStorage<T>(key: StoreKeyType): T | null {
	const value = localStorage.getItem(key)
	if (!value) return null
	try {
		return JSON.parse(value) as T
	} catch {
		return value as T
	}
}

import browser from 'webextension-polyfill'
import type { StoreKeyType } from './constant/store.key'

export async function setToStorage<T>(key: StoreKeyType, value: T) {
	browser.storage.sync.set({ [key]: value })
}

export async function getFromStorage<T>(key: StoreKeyType): Promise<T | null> {
	const value = await browser.storage.sync.get(key)
	if (!value) return null
	return value[key] as T
}

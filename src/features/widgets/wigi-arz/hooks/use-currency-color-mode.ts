import { useSyncExternalStore } from 'react'
import { getFromStorage, setToStorage, watchStorage } from '@/common/storage'
import {
	type CurrencyColorMode,
	DEFAULT_CURRENCY_COLOR_MODE,
	normalizeCurrencyColorMode,
} from '../utils/currency-color-mode'

let currentMode: CurrencyColorMode = DEFAULT_CURRENCY_COLOR_MODE
let started = false
const listeners = new Set<() => void>()

function publish(next: CurrencyColorMode) {
	if (next === currentMode) return
	currentMode = next
	for (const listener of listeners) listener()
}

function start() {
	if (started) return
	started = true
	getFromStorage('currencyColorMode').then((value) =>
		publish(normalizeCurrencyColorMode(value))
	)
	watchStorage('currencyColorMode', (value) =>
		publish(normalizeCurrencyColorMode(value))
	)
}

function subscribe(listener: () => void) {
	start()
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

export function useCurrencyColorMode(): CurrencyColorMode {
	return useSyncExternalStore(subscribe, () => currentMode)
}

export function saveCurrencyColorMode(mode: CurrencyColorMode) {
	publish(mode)
	return setToStorage('currencyColorMode', mode)
}

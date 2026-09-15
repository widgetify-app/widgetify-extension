import { TEMPERATURE_UNIT_SYMBOLS } from '../constants'
import type { TemperatureUnit } from '../weather.interface'

export const FALLBACK_UNIT: TemperatureUnit = 'metric'

export interface FormattedTemperature {
	value: number
	symbol: string
}

export function formatTemperature(
	temp: number | undefined | null,
	unit?: TemperatureUnit | null
): FormattedTemperature {
	const rounded = Math.round(Number(temp))

	return {
		value: Number.isFinite(rounded) ? rounded : 0,
		symbol: TEMPERATURE_UNIT_SYMBOLS[unit || FALLBACK_UNIT],
	}
}

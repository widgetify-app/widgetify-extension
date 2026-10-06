import type { TemperatureUnit } from '../types'
import { formatTemperature } from './format-temperature'

interface TemperatureRange {
	high: string
	low: string
}

export function getTemperatureRange(
	max: number | undefined,
	min: number | undefined,
	unit: TemperatureUnit
): TemperatureRange | null {
	if (!Number.isFinite(max) || !Number.isFinite(min)) return null

	const high = formatTemperature(max, unit)
	const low = formatTemperature(min, unit)
	if (high.value === low.value) return null

	return {
		high: `${high.value}${high.symbol}`,
		low: `${low.value}${low.symbol}`,
	}
}

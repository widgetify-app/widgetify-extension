export type CurrencyColorMode = 'normal' | 'reverse'

type ChangeDirection = 'up' | 'down'

export const DEFAULT_CURRENCY_COLOR_MODE: CurrencyColorMode = 'normal'

export function normalizeCurrencyColorMode(value: unknown): CurrencyColorMode {
	return value === 'reverse' ? 'reverse' : DEFAULT_CURRENCY_COLOR_MODE
}

export function getChangeColorClass(
	direction: ChangeDirection,
	mode: CurrencyColorMode
): 'text-danger' | 'text-success' {
	const risingIsRed = mode === 'normal'
	const isRed = (direction === 'up') === risingIsRed
	return isRed ? 'text-danger' : 'text-success'
}

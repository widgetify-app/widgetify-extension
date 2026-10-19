type PriceDirection = 'up' | 'down' | 'flat'

interface PriceChange {
	direction: PriceDirection
	percent: string
}

export function getPriceChange(changePercentage: number | null | undefined): PriceChange {
	const change = Number(changePercentage)
	const rounded = Number.isFinite(change) ? Math.round(Math.abs(change) * 10) / 10 : 0

	return {
		direction: rounded === 0 ? 'flat' : change > 0 ? 'up' : 'down',
		percent: `${rounded.toLocaleString('fa-IR')}٪`,
	}
}

const WHOLE_NUMBER_FROM = 10

export function formatChangeAmount(amount: number): string {
	const size = Math.abs(amount)
	const rounded = size >= WHOLE_NUMBER_FROM ? Math.round(size) : Number(size.toFixed(2))

	return rounded.toLocaleString()
}

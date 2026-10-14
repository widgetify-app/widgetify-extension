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

export function formatChangeAmount(amount: number): string {
	return Math.abs(Number(amount.toFixed())).toLocaleString()
}

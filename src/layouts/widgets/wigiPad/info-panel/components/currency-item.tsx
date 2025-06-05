interface CurrencyRate {
	id: string
	currency: string
	rate: number
	change: number
	symbol: string
}

interface CurrencyItemProps {
	currency: CurrencyRate
}

export function CurrencyItem({ currency }: CurrencyItemProps) {
	const isPositive = currency.change > 0

	return (
		<div className="p-2 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-sm">💰</span>
					<div>
						<p className="text-sm font-medium text-base-content">{currency.currency}</p>
						<p className="text-xs text-base-content opacity-60">{currency.symbol}</p>
					</div>
				</div>
				<div className="text-right">
					<p className="text-sm font-bold text-base-content">
						{currency.rate.toLocaleString('fa-IR')} ریال
					</p>
					<div
						className={`flex items-center gap-1 text-xs ${
							isPositive ? 'text-red-500' : 'text-green-500'
						}`}
					>
						<span>{isPositive ? '📈' : '📉'}</span>
						<span>{Math.abs(currency.change).toFixed(1)}%</span>
					</div>
				</div>
			</div>
		</div>
	)
}

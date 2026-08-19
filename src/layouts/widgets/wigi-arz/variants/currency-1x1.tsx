import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'
import { GetPrice } from '../utils/get-price'

interface CurrencyCompactSquareProps {
	code: string
}

export function CurrencyCompactSquare({ code }: CurrencyCompactSquareProps) {
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)

	useEffect(() => {
		async function load() {
			const cached = await getFromStorage(`currency:${code}`)
			if (cached) {
				setCurrency(cached)
			}
		}
		load()
	}, [code])

	useEffect(() => {
		if (data) {
			setCurrency(data)
			setToStorage(`currency:${code}`, data)
		}
	}, [dataUpdatedAt])

	if (!currency) {
		return (
			<div className="flex flex-col items-center justify-between h-full w-full p-2.5 select-none">
				<div className="w-10 h-3 rounded skeleton" />
				<div className="w-14 h-8 rounded skeleton my-auto" />
				<div className="w-12 h-3 rounded skeleton" />
			</div>
		)
	}

	const priceResult = GetPrice(code, currency)
	const change = currency.changePercentage
	const isPositive = (change || 0) >= 0

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<div className="flex items-center gap-1.5">
				{currency.icon && (
					<img
						src={currency.icon}
						alt={currency.name?.en || code}
						className="w-4 h-4 rounded-full object-cover"
					/>
				)}
				<span className="text-xs font-bold text-content">
					{currency.name?.fa || code}
				</span>
			</div>

			<div className="flex flex-col items-center my-auto">
				<span className="text-lg font-black text-content leading-tight" dir="ltr">
					{priceResult.label}
				</span>
			</div>

			<div className="flex items-center gap-1">
				{change !== undefined && (
					<span
						className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
							isPositive
								? 'bg-success/15 text-success'
								: 'bg-error/15 text-error'
						}`}
						dir="ltr"
					>
						{isPositive ? '+' : ''}
						{change}%
					</span>
				)}
			</div>
		</div>
	)
}

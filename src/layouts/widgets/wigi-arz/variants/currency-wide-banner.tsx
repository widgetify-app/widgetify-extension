import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'
import { GetPrice } from '../utils/get-price'

interface CurrencyItemBannerProps {
	code: string
}

function CurrencyItemBanner({ code }: CurrencyItemBannerProps) {
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
			<div className="flex flex-col justify-between p-2 rounded-xl bg-base-200/40 min-w-0 h-full">
				<div className="flex items-center justify-between">
					<div className="w-4 h-4 rounded-full skeleton" />
					<div className="w-10 h-3 rounded skeleton" />
				</div>
				<div className="w-12 h-2 rounded skeleton" />
			</div>
		)
	}

	const priceResult = GetPrice(code, currency)
	const change = currency.changePercentage
	const isPositive = (change || 0) >= 0

	return (
		<div className="flex flex-col justify-between p-2 rounded-xl bg-base-200/40 border border-base-content/10 min-w-0 h-full select-none overflow-hidden">
			<div className="flex items-center justify-between gap-1">
				<div className="flex items-center gap-1.5 min-w-0">
					{currency.icon && (
						<img
							src={currency.icon}
							alt={currency.name?.en || code}
							className="w-4 h-4 rounded-full object-cover shrink-0"
						/>
					)}
					<span className="text-xs font-bold text-content truncate">
						{code}
					</span>
				</div>

				<span className="text-xs font-black text-content font-mono leading-none shrink-0" dir="ltr">
					{priceResult.label}
				</span>
			</div>

			<div className="flex items-center justify-between gap-1 text-[10px] mt-1">
				<span className="text-base-content/60 truncate min-w-0">
					{currency.name?.fa || currency.name?.en}
				</span>
				{change !== undefined && (
					<span
						className={`font-mono font-bold shrink-0 px-1 py-0.2 rounded text-[9px] ${
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

interface CurrencyWideBannerProps {
	currencies: string[]
}

export function CurrencyWideBanner({ currencies }: CurrencyWideBannerProps) {
	const displayCurrencies = currencies.slice(0, 4)

	return (
		<div className="grid grid-cols-4 gap-1.5 h-full w-full select-none overflow-hidden">
			{displayCurrencies.map((code) => (
				<CurrencyItemBanner key={code} code={code} />
			))}
		</div>
	)
}

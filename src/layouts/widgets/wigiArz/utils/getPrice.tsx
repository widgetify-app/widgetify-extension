import type React from 'react'
import { FaDollarSign } from 'react-icons/fa'
import type { FetchedCurrency } from '@/services/hooks/currency/getCurrencyByCode.hook'
export interface GetPriceResult {
	price: number
	label: string | React.ReactNode
}
export function GetPrice(code: string, currency: FetchedCurrency): GetPriceResult {
	if (code.toLowerCase() === 'btc') {
		return {
			price: currency.price,
			label: (
				<>
					<FaDollarSign className="inline" />
					{currency.price.toLocaleString()}
				</>
			),
		}
	} else {
		return {
			price: currency.rialPrice,
			label: currency.rialPrice.toLocaleString(),
		}
	}
}

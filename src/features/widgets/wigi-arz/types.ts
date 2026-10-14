export enum CurrenciesType {
	COIN = 'coin',
	CRYPTO = 'crypto',
	CURRENCY = 'currency',
	SERVICE = 'service',
}

export interface WigiArzMeta {
	variant?: string
	currencyCode?: string
	currencies?: string[]
}

export interface CurrencyGroup {
	label: string
	options: {
		value: string
		label: string
	}[]
}

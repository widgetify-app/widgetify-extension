export type SupportedCurrencies = {
	key: string
	type: 'coin' | 'crypto' | 'currency'
	country?: string
	label: {
		fa: string
		en: string
	}
}[]

export enum CurrenciesType {
	COIN = 'coin',
	CRYPTO = 'crypto',
	CURRENCY = 'currency',
}

export const currencyKeys = {
	byCodeAll: ['currencyByCode'] as const,
	byCode: (currency: string) => ['currencyByCode', currency] as const,
	history: (currency: string, range: string) =>
		['currencyHistory', currency, range] as const,
	supported: ['supportedCurrencies'] as const,
}

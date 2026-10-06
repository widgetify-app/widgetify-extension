export const currencyKeys = {
	byCodeAll: ['currencyByCode'] as const,
	byCode: (currency: string) => ['currencyByCode', currency] as const,
	supported: ['supportedCurrencies'] as const,
}

export const currencyKeys = {
	byCode: (currency: string) => [`currency-${currency}`] as const,
	supported: ['supportedCurrencies'] as const,
}

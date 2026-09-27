import type { SupportedCurrencies } from '@/services/hooks/currency/get-support-currencies.hook'
import { CurrenciesType, type CurrencyGroup } from '../types'

const GROUP_LABELS: { type: CurrenciesType; label: string }[] = [
	{ type: CurrenciesType.CRYPTO, label: '🪙 ارزهای دیجیتال' },
	{ type: CurrenciesType.CURRENCY, label: '💵 ارزها' },
	{ type: CurrenciesType.COIN, label: '🥇 طلا و سکه' },
]

export function getCurrencyOptions(supported: SupportedCurrencies): CurrencyGroup[] {
	return GROUP_LABELS.map(({ type, label }) => ({
		label,
		options: supported
			.filter((currency) => currency.type === type)
			.map((currency) => ({ value: currency.key, label: currency.label.fa })),
	}))
}

export function filterCurrencyGroups(
	groups: CurrencyGroup[],
	query: string
): CurrencyGroup[] {
	const normalized = query.trim().toLowerCase()

	return groups
		.map((group) => ({
			...group,
			options: group.options.filter(
				(option) =>
					option.label.toLowerCase().includes(normalized) ||
					option.value.toLowerCase().includes(normalized)
			),
		}))
		.filter((group) => group.options.length > 0)
}

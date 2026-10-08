import { t, type MessageKey } from '@/common/i18n'
import type { SupportedCurrencies } from '@/services/currency/get-support-currencies.hook'
import { CurrenciesType, type CurrencyGroup } from '../types'

const GROUP_LABELS: { type: CurrenciesType; labelKey: MessageKey }[] = [
	{ type: CurrenciesType.CRYPTO, labelKey: 'widgets.wigiArz.group.crypto' },
	{ type: CurrenciesType.CURRENCY, labelKey: 'widgets.wigiArz.group.currency' },
	{ type: CurrenciesType.COIN, labelKey: 'widgets.wigiArz.group.coin' },
]

export function getCurrencyOptions(supported: SupportedCurrencies): CurrencyGroup[] {
	return GROUP_LABELS.map(({ type, labelKey }) => ({
		label: t(labelKey),
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

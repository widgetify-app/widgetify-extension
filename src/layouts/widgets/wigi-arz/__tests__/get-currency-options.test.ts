import { describe, expect, it } from 'bun:test'
import type { SupportedCurrencies } from '@/services/hooks/currency/get-support-currencies.hook'
import { filterCurrencyGroups, getCurrencyOptions } from '../utils/get-currency-options'

const SUPPORTED = [
	{ key: 'BTC', type: 'crypto', label: { fa: 'بیت‌کوین', en: 'Bitcoin' } },
	{ key: 'ETH', type: 'crypto', label: { fa: 'اتریوم', en: 'Ethereum' } },
	{ key: 'USD', type: 'currency', label: { fa: 'دلار', en: 'Dollar' } },
	{ key: 'SEKE', type: 'coin', label: { fa: 'سکه امامی', en: 'Coin' } },
] as unknown as SupportedCurrencies

describe('getCurrencyOptions', () => {
	it('keeps the three groups in a stable order', () => {
		const groups = getCurrencyOptions(SUPPORTED)

		expect(groups).toHaveLength(3)
		expect(groups.map((g) => g.options.map((o) => o.value))).toEqual([
			['BTC', 'ETH'],
			['USD'],
			['SEKE'],
		])
	})

	it('labels each option with its persian name', () => {
		const [crypto] = getCurrencyOptions(SUPPORTED)

		expect(crypto.options[0]).toEqual({ value: 'BTC', label: 'بیت‌کوین' })
	})

	it('returns empty groups rather than throwing on an empty list', () => {
		const groups = getCurrencyOptions([] as unknown as SupportedCurrencies)

		expect(groups).toHaveLength(3)
		expect(groups.every((g) => g.options.length === 0)).toBe(true)
	})

	it('never puts a currency in more than one group', () => {
		const values = getCurrencyOptions(SUPPORTED).flatMap((g) =>
			g.options.map((o) => o.value)
		)

		expect(new Set(values).size).toBe(values.length)
	})
})

describe('filterCurrencyGroups', () => {
	const groups = getCurrencyOptions(SUPPORTED)

	it('returns everything for an empty query', () => {
		expect(filterCurrencyGroups(groups, '')).toHaveLength(3)
	})

	it('drops groups that no longer have options', () => {
		const filtered = filterCurrencyGroups(groups, 'دلار')

		expect(filtered).toHaveLength(1)
		expect(filtered[0].options.map((o) => o.value)).toEqual(['USD'])
	})

	it('matches the currency code as well as the persian label', () => {
		const filtered = filterCurrencyGroups(groups, 'eth')

		expect(filtered.flatMap((g) => g.options.map((o) => o.value))).toEqual(['ETH'])
	})

	it('ignores surrounding whitespace and case', () => {
		expect(filterCurrencyGroups(groups, '  BtC ')[0].options[0].value).toBe('BTC')
	})
})

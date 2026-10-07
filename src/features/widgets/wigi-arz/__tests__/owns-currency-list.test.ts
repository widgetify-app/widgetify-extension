import { describe, expect, it } from 'bun:test'
import { WidgetKeys } from '../../utils/layout-engine/types'
import { ownsCurrencyList } from '../utils/owns-currency-list'

describe('ownsCurrencyList', () => {
	it('gives the 2x3 wigi-arz widget its own list', () => {
		expect(ownsCurrencyList({ id: WidgetKeys.arzLive, size: { w: 2, h: 3 } })).toBe(
			true
		)
	})

	it('leaves the combo widget on the shared list, although it is 2x3 too', () => {
		expect(
			ownsCurrencyList({ id: WidgetKeys.comboWidget, size: { w: 2, h: 3 } })
		).toBe(false)
	})

	it('leaves the 1x1 model to its single code', () => {
		expect(ownsCurrencyList({ id: WidgetKeys.arzLive, size: { w: 1, h: 1 } })).toBe(
			false
		)
	})

	it('uses the shared list when no widget is given', () => {
		expect(ownsCurrencyList(null)).toBe(false)
		expect(ownsCurrencyList(undefined)).toBe(false)
	})
})

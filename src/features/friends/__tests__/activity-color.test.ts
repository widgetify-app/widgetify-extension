import { describe, expect, it } from 'bun:test'
import { ACTIVITY_COLORS, activityStyle } from '../utils/activity-color'

describe('ACTIVITY_COLORS', () => {
	it('are ready-made hex colours, each once', () => {
		const hexes = ACTIVITY_COLORS

		for (const hex of hexes) {
			expect(hex).toMatch(/^#[0-9a-f]{6}$/)
		}

		expect(new Set(hexes).size).toBe(hexes.length)
	})

	it('offer both soft and strong colours, and a pink', () => {
		const hexes = ACTIVITY_COLORS

		expect(hexes).toContain('#ff6fae')
		expect(hexes).toContain('#bfdbfe')
		expect(hexes).toContain('#ef4444')
	})
})

describe('activityStyle', () => {
	it('paints the bubble with the hex itself', () => {
		expect(activityStyle('#ef4444')?.backgroundColor).toBe('#ef4444')
	})

	it('writes dark text on a soft colour and white text on a strong one', () => {
		expect(activityStyle('#bfdbfe')?.color).toBe('#1f2937')
		expect(activityStyle('#fef08a')?.color).toBe('#1f2937')
		expect(activityStyle('#4f46e5')?.color).toBe('#ffffff')
		expect(activityStyle('#ef4444')?.color).toBe('#ffffff')
	})

	it('reads upper case hex too, so any colour the server holds works', () => {
		expect(activityStyle('#FFFFFF')?.color).toBe('#1f2937')
	})

	it('leaves the bubble plain without a colour or with something that is not a hex', () => {
		for (const value of [null, undefined, '', 'CALM', 'red', '#fff', '#12345g']) {
			expect(activityStyle(value)).toBeUndefined()
		}
	})
})

import { describe, expect, it } from 'bun:test'
import { WidgetKeys } from '../../utils/layout-engine/types'
import { PRESET_LAYOUTS } from '../constants'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'

const preset = PRESET_LAYOUTS.find((item) => item.id === 'persian-big-clock')

describe('the big Persian clock preset', () => {
	it('exists, is free, and is shown among the featured ones', () => {
		expect(preset).toBeDefined()
		expect(preset?.isVip).toBe(false)
		expect(preset?.isFeatured).toBe(true)
	})

	it('holds only one large Persian clock', () => {
		expect(preset?.widgets).toHaveLength(1)

		const [clock] = preset?.widgets ?? []

		expect(clock.id).toBe(WidgetKeys.transparentClock)
		expect(clock.size).toEqual({ w: 4, h: 2 })
		expect(clock.meta).toEqual({ variant: 'persian' })
	})

	it('sits in the middle of the page, in the middle of the columns', () => {
		const [clock] = resolvePresetWidgetsForViewport(preset!, 8)

		expect(clock.position).toEqual({ col: 2, row: 3 })
	})
})

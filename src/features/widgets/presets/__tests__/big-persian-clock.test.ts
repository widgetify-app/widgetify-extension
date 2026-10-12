import { describe, expect, it } from 'bun:test'
import { WidgetKeys } from '../../utils/layout-engine/types'
import { PRESET_LAYOUTS } from '../constants'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'

const preset = PRESET_LAYOUTS.find((item) => item.id === 'persian-big-clock')

const placed = () => resolvePresetWidgetsForViewport(preset!, 8)

const find = (id: string) => placed().find((item) => item.id === id)

describe('the big Persian clock preset', () => {
	it('exists, is free, and is shown among the featured ones', () => {
		expect(preset).toBeDefined()
		expect(preset?.isVip).toBe(false)
		expect(preset?.isFeatured).toBe(true)
	})

	it('holds only a search box and one large Persian clock', () => {
		const ids = (preset?.widgets ?? []).map((item) => item.id).sort()

		expect(ids).toEqual([WidgetKeys.search, WidgetKeys.transparentClock].sort())
		expect(find(WidgetKeys.transparentClock)?.size).toEqual({ w: 4, h: 2 })
		expect(find(WidgetKeys.transparentClock)?.meta).toEqual({ variant: 'persian' })
		expect(find(WidgetKeys.search)?.size).toEqual({ w: 4, h: 1 })
	})

	it('puts the search box right above the clock, on the same columns', () => {
		const search = find(WidgetKeys.search)
		const clock = find(WidgetKeys.transparentClock)

		expect(search?.position.col).toBe(clock?.position.col)
		expect((search?.position.row ?? 0) + 1).toBe(clock?.position.row)
	})

	it('sits in the middle of the page, in the middle of the columns', () => {
		expect(find(WidgetKeys.search)?.position).toEqual({ col: 2, row: 2 })
		expect(find(WidgetKeys.transparentClock)?.position).toEqual({ col: 2, row: 3 })
	})
})

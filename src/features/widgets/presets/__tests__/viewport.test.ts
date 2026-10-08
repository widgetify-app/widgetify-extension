import { describe, expect, it } from 'bun:test'
import { type StoredWidget, WidgetKeys } from '../../utils/layout-engine/types'
import type { PresetLayout } from '../types'
import { resolvePresetWidgetsForViewport } from '../utils/viewport'

function widget(instanceId: string, row: number, col = 0): StoredWidget {
	return {
		id: WidgetKeys.clock,
		instanceId,
		position: { col, row },
		size: { w: 1, h: 1 },
	}
}

function preset(
	verticalAlign: PresetLayout['verticalAlign'],
	widgets: StoredWidget[]
): PresetLayout {
	return {
		id: 'p',
		titleKey: 'widgets.presets.default.title',
		descriptionKey: 'widgets.presets.default.description',
		isVip: false,
		isFeatured: false,
		category: 'minimal',
		verticalAlign,
		widgets,
	}
}

function rows(widgets: StoredWidget[]) {
	return widgets.map((item) => item.position.row)
}

describe('resolvePresetWidgetsForViewport', () => {
	it('returns nothing for a preset without widgets', () => {
		expect(resolvePresetWidgetsForViewport(preset('top', []), 8)).toEqual([])
	})

	it('moves a preset to the top row when it is aligned to the top or to nothing', () => {
		const widgets = [widget('a', 2), widget('b', 3)]
		expect(rows(resolvePresetWidgetsForViewport(preset('top', widgets), 8))).toEqual([
			0, 1,
		])
		expect(
			rows(resolvePresetWidgetsForViewport(preset(undefined, widgets), 8))
		).toEqual([0, 1])
	})

	it('centres a preset in the rows the screen has', () => {
		const widgets = [widget('a', 0), widget('b', 1)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('center', widgets), 8))
		).toEqual([3, 4])
	})

	it('measures the height of a preset that does not start on the first row', () => {
		const widgets = [widget('a', 2), widget('b', 3)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('center', widgets), 8))
		).toEqual([3, 4])
	})

	it('moves a preset made of a single widget', () => {
		expect(
			rows(resolvePresetWidgetsForViewport(preset('bottom', [widget('a', 3)]), 8))
		).toEqual([7])
	})

	it('puts a preset against the bottom row', () => {
		const widgets = [widget('a', 0), widget('b', 1)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('bottom', widgets), 8))
		).toEqual([6, 7])
	})

	it('starts at the top when the preset is taller than the screen', () => {
		const widgets = [widget('a', 0), widget('b', 1), widget('c', 2), widget('d', 3)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('center', widgets), 3))
		).toEqual([0, 1, 2, 3])
		expect(
			rows(resolvePresetWidgetsForViewport(preset('bottom', widgets), 3))
		).toEqual([0, 1, 2, 3])
	})

	it('keeps the top row in place and pushes the rest to the bottom for split-bottom', () => {
		const widgets = [widget('a', 0), widget('b', 2), widget('c', 3)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('split-bottom', widgets), 8))
		).toEqual([0, 6, 7])
		expect(
			rows(resolvePresetWidgetsForViewport(preset('split-bottom', widgets), 3))
		).toEqual([0, 1, 2])
	})

	it('moves a single widget just below the top row for split-bottom', () => {
		const widgets = [widget('a', 0), widget('b', 1)]
		expect(
			rows(resolvePresetWidgetsForViewport(preset('split-bottom', widgets), 8))
		).toEqual([0, 7])
	})

	it('leaves a split-bottom preset alone when it has nothing below the top row', () => {
		const widgets = [widget('a', 0, 0), widget('b', 0, 1)]
		expect(
			resolvePresetWidgetsForViewport(preset('split-bottom', widgets), 8)
		).toEqual(widgets)
	})

	it('keeps the column of every widget and does not change the preset', () => {
		const widgets = [widget('a', 2, 4), widget('b', 3, 1)]
		const result = resolvePresetWidgetsForViewport(preset('bottom', widgets), 8)
		expect(result.map((item) => item.position.col)).toEqual([4, 1])
		expect(rows(widgets)).toEqual([2, 3])
	})
})

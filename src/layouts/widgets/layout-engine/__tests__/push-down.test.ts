import { describe, expect, it } from 'bun:test'
import {
	compactLayout,
	reconcileIdentity,
	resolveLayoutChange,
	validateLayout,
	WidgetKeys,
} from '../index'
import { pushDownward } from '../push'
import type { StoredWidget } from '../types'

function widget(
	instanceId: string,
	col: number,
	row: number,
	w: number,
	h: number,
	id: WidgetKeys = WidgetKeys.clock
): StoredWidget {
	return { id, instanceId, position: { col, row }, size: { w, h } }
}

function buildPackedLayout(count: number, cols = 8): StoredWidget[] {
	const layout: StoredWidget[] = []
	const perRow = Math.floor(cols / 2)
	for (let i = 0; i < count; i++) {
		const col = (i % perRow) * 2
		const row = Math.floor(i / perRow) * 3
		layout.push(widget(`w-${i}`, col, row, 2, 3))
	}
	return layout
}

function freezeRepro(): StoredWidget[] {
	const layout = buildPackedLayout(20)
	layout.push(widget('search', 0, 30, 4, 1, WidgetKeys.search))
	return layout
}

describe('push-down collision engine', () => {
	it('cascades downward through a chain of blockers', () => {
		const initial = [
			widget('a', 0, 0, 2, 2),
			widget('b', 0, 2, 2, 2),
			widget('c', 0, 4, 2, 2),
		]

		const result = resolveLayoutChange({
			layout: initial,
			operation: 'move',
			instanceId: 'a',
			targetPosition: { col: 0, row: 2 },
			cols: 8,
		})

		expect(result).not.toBeNull()
		expect(validateLayout(result!, 8)).toBe(true)
		expect(result!.find((w) => w.instanceId === 'a')!.position).toEqual({
			col: 0,
			row: 2,
		})
		expect(result!.find((w) => w.instanceId === 'b')!.position).toEqual({
			col: 0,
			row: 4,
		})
		expect(result!.find((w) => w.instanceId === 'c')!.position).toEqual({
			col: 0,
			row: 6,
		})
	})

	it('never moves the pinned widget and only ever pushes downward', () => {
		const initial = [widget('pinned', 2, 2, 2, 2), widget('other', 2, 2, 2, 2)]
		const { layout } = pushDownward(initial, new Set(['pinned']))

		expect(layout.find((w) => w.instanceId === 'pinned')!.position).toEqual({
			col: 2,
			row: 2,
		})
		const other = layout.find((w) => w.instanceId === 'other')!
		expect(other.position.col).toBe(2)
		expect(other.position.row).toBe(4)
	})

	it('preserves deliberate vertical gaps', () => {
		const initial = [widget('a', 0, 0, 2, 1), widget('b', 0, 8, 2, 1)]

		const result = resolveLayoutChange({
			layout: initial,
			operation: 'move',
			instanceId: 'a',
			targetPosition: { col: 4, row: 0 },
			cols: 8,
		})

		expect(result!.find((w) => w.instanceId === 'b')!.position).toEqual({
			col: 0,
			row: 8,
		})
	})

	it('never returns null for any in-bounds move', () => {
		const initial = buildPackedLayout(30)

		for (let col = 0; col <= 6; col++) {
			for (let row = 0; row < 20; row++) {
				const result = resolveLayoutChange({
					layout: initial,
					operation: 'move',
					instanceId: 'w-7',
					targetPosition: { col, row },
					cols: 8,
				})
				expect(result).not.toBeNull()
				expect(validateLayout(result!, 8)).toBe(true)
			}
		}
	})

	it('places the dragged widget exactly on target', () => {
		const initial = freezeRepro()

		for (let col = 0; col <= 4; col++) {
			for (let row = 0; row < 15; row++) {
				const result = resolveLayoutChange({
					layout: initial,
					operation: 'move',
					instanceId: 'search',
					targetPosition: { col, row },
					cols: 8,
				})
				expect(result!.find((w) => w.instanceId === 'search')!.position).toEqual({
					col,
					row,
				})
			}
		}
	})

	it('keeps a worst-case drag sweep inside the frame budget', () => {
		const initial = freezeRepro()

		let worst = 0
		const startedAt = performance.now()

		for (let col = 0; col <= 4; col++) {
			for (let row = 0; row < 15; row++) {
				const callStart = performance.now()
				const result = resolveLayoutChange({
					layout: initial,
					operation: 'move',
					instanceId: 'search',
					targetPosition: { col, row },
					cols: 8,
				})
				worst = Math.max(worst, performance.now() - callStart)
				expect(result).not.toBeNull()
			}
		}

		expect(worst).toBeLessThan(16)
		expect(performance.now() - startedAt).toBeLessThan(500)
	})

	it('resolves the reported search-widget freeze instantly', () => {
		const initial = freezeRepro()

		const startedAt = performance.now()
		const result = resolveLayoutChange({
			layout: initial,
			operation: 'move',
			instanceId: 'search',
			targetPosition: { col: 4, row: 0 },
			cols: 8,
		})
		const elapsed = performance.now() - startedAt

		expect(result).not.toBeNull()
		expect(validateLayout(result!, 8)).toBe(true)
		expect(elapsed).toBeLessThan(16)
	})

	it('is deterministic regardless of input ordering', () => {
		const initial = buildPackedLayout(12)
		const shuffled = [...initial].reverse()

		const move = (layout: StoredWidget[]) =>
			resolveLayoutChange({
				layout,
				operation: 'move',
				instanceId: 'w-5',
				targetPosition: { col: 0, row: 0 },
				cols: 8,
			})!

		const first = move(initial)
		const second = move(initial)
		const fromShuffled = move(shuffled)

		expect(first).toEqual(second)

		for (const w of first) {
			const match = fromShuffled.find((x) => x.instanceId === w.instanceId)!
			expect(match.position).toEqual(w.position)
		}
	})

	it('does not drift when previewing repeatedly from a stable base', () => {
		const base = buildPackedLayout(16)

		const preview = (col: number, row: number) =>
			resolveLayoutChange({
				layout: base,
				operation: 'move',
				instanceId: 'w-3',
				targetPosition: { col, row },
				cols: 8,
			})!

		const first = preview(5, 3)
		preview(0, 0)
		const third = preview(5, 3)

		expect(third).toEqual(first)
	})

	it('preserves object identity for untouched widgets', () => {
		const initial = [
			widget('a', 0, 0, 2, 1),
			widget('b', 0, 1, 2, 1),
			widget('far', 6, 10, 2, 1),
		]

		const result = resolveLayoutChange({
			layout: initial,
			operation: 'move',
			instanceId: 'a',
			targetPosition: { col: 0, row: 1 },
			cols: 8,
		})!

		expect(result.find((w) => w.instanceId === 'far')).toBe(initial[2])
		expect(result.find((w) => w.instanceId === 'b')).not.toBe(initial[1])
	})

	it('returns the previous array when nothing changed', () => {
		const prev = buildPackedLayout(6)
		const next = prev.map((w) => ({
			...w,
			position: { ...w.position },
			size: { ...w.size },
		}))

		expect(reconcileIdentity(prev, next)).toBe(prev)
	})

	it('honours onlyIds in compactLayout', () => {
		const layout = [widget('pull-me', 0, 5, 2, 1), widget('leave-me', 4, 5, 2, 1)]

		const compacted = compactLayout(layout, 8, { onlyIds: new Set(['pull-me']) })

		expect(compacted.find((w) => w.instanceId === 'pull-me')!.position.row).toBe(0)
		expect(compacted.find((w) => w.instanceId === 'leave-me')!.position.row).toBe(5)
	})

	it('returns overlapping pinned widgets unchanged', () => {
		const layout = [widget('p1', 0, 0, 2, 2), widget('p2', 1, 1, 2, 2)]
		const { layout: result, displacedIds } = pushDownward(
			layout,
			new Set(['p1', 'p2'])
		)

		expect(result).toBe(layout)
		expect(displacedIds.size).toBe(0)
	})
})

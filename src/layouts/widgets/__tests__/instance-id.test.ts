import { describe, expect, it } from 'bun:test'
import {
	applyInstanceIdMap,
	buildInstanceIdMap,
	dedupeInstanceIds,
	isServerInstanceId,
} from '../instance-id'
import { resolveLayoutChange } from '../layout-engine'
import type { StoredWidget } from '../layout-engine/types'
import { WidgetKeys } from '../layout-engine/types'

function widget(
	instanceId: string,
	id: WidgetKeys = WidgetKeys.clock,
	col = 0,
	row = 0
): StoredWidget {
	return { id, instanceId, position: { col, row }, size: { w: 2, h: 1 } }
}

const SERVER_A = 'aaaaaaaaaaaaaaaaaaaaaaaa'
const SERVER_B = 'bbbbbbbbbbbbbbbbbbbbbbbb'

describe('isServerInstanceId', () => {
	it('accepts only 24-char hex ids', () => {
		expect(isServerInstanceId(SERVER_A)).toBe(true)
		expect(isServerInstanceId('clock-abc123')).toBe(false)
		expect(isServerInstanceId('')).toBe(false)
		expect(isServerInstanceId(undefined)).toBe(false)
	})
})

describe('buildInstanceIdMap', () => {
	it('never assigns a server id already held by another widget', () => {
		const layout = [
			widget(SERVER_A, WidgetKeys.clock),
			widget('clock-local', WidgetKeys.clock),
		]
		const synced = [
			{ instanceId: SERVER_A, widgetKey: WidgetKeys.clock },
			{ instanceId: SERVER_B, widgetKey: WidgetKeys.clock },
		]

		const idMap = buildInstanceIdMap(layout, synced)

		expect(idMap.get('clock-local')).toBe(SERVER_B)

		const updated = applyInstanceIdMap(layout, idMap)
		const ids = updated.map((w) => w.instanceId)
		expect(new Set(ids).size).toBe(ids.length)
	})

	it('does not map two local widgets onto the same server id', () => {
		const layout = [widget('clock-1', WidgetKeys.clock), widget('clock-2', WidgetKeys.clock)]
		const synced = [{ instanceId: SERVER_A, widgetKey: WidgetKeys.clock }]

		const idMap = buildInstanceIdMap(layout, synced)

		expect(idMap.size).toBe(1)
		const updated = applyInstanceIdMap(layout, idMap)
		const ids = updated.map((w) => w.instanceId)
		expect(new Set(ids).size).toBe(ids.length)
	})

	it('leaves widgets untouched when there is nothing to map', () => {
		const layout = [widget(SERVER_A), widget(SERVER_B)]
		const synced = [
			{ instanceId: SERVER_A, widgetKey: WidgetKeys.clock },
			{ instanceId: SERVER_B, widgetKey: WidgetKeys.clock },
		]

		expect(buildInstanceIdMap(layout, synced).size).toBe(0)
		expect(applyInstanceIdMap(layout, new Map())).toBe(layout)
	})

	it('does not borrow a server id belonging to a different widget type', () => {
		const layout = [widget('search-local', WidgetKeys.search)]
		const synced = [{ instanceId: SERVER_A, widgetKey: WidgetKeys.clock }]

		expect(buildInstanceIdMap(layout, synced).size).toBe(0)
	})
})

describe('dedupeInstanceIds', () => {
	it('repairs a layout where a duplicate shares the original instance id', () => {
		const layout = [
			widget(SERVER_A, WidgetKeys.clock, 0, 0),
			widget(SERVER_A, WidgetKeys.clock, 2, 0),
		]

		const repaired = dedupeInstanceIds(layout)
		const ids = repaired.map((w) => w.instanceId)

		expect(new Set(ids).size).toBe(2)
		expect(repaired[0].instanceId).toBe(SERVER_A)
		expect(repaired[1].instanceId).not.toBe(SERVER_A)
		expect(repaired[1].widgetId).toBe(repaired[1].instanceId)
	})

	it('returns the same array when every id is unique', () => {
		const layout = [widget(SERVER_A), widget(SERVER_B)]
		expect(dedupeInstanceIds(layout)).toBe(layout)
	})
})

describe('duplicate operation', () => {
	it('keeps the server issued instance id instead of inventing one', () => {
		const layout = [widget(SERVER_A, WidgetKeys.clock)]

		const result = resolveLayoutChange({
			layout,
			operation: 'duplicate',
			instanceId: SERVER_A,
			newWidget: {
				id: WidgetKeys.clock,
				instanceId: SERVER_B,
				widgetId: SERVER_B,
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
			},
			cols: 8,
		})

		expect(result).not.toBeNull()
		expect(result!.map((w) => w.instanceId).sort()).toEqual(
			[SERVER_A, SERVER_B].sort()
		)
	})

	it('removing the duplicate leaves the original in place', () => {
		const layout = [widget(SERVER_A, WidgetKeys.clock)]

		const duplicated = resolveLayoutChange({
			layout,
			operation: 'duplicate',
			instanceId: SERVER_A,
			newWidget: {
				id: WidgetKeys.clock,
				instanceId: SERVER_B,
				widgetId: SERVER_B,
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
			},
			cols: 8,
		})!

		const afterRemove = resolveLayoutChange({
			layout: duplicated,
			operation: 'remove',
			instanceId: SERVER_B,
			cols: 8,
		})

		expect(afterRemove).not.toBeNull()
		expect(afterRemove!.length).toBe(1)
		expect(afterRemove![0].instanceId).toBe(SERVER_A)
	})

	it('rejects a duplicate whose instance id is already taken', () => {
		const layout = [widget(SERVER_A, WidgetKeys.clock)]

		const result = resolveLayoutChange({
			layout,
			operation: 'duplicate',
			instanceId: SERVER_A,
			newWidget: {
				id: WidgetKeys.clock,
				instanceId: SERVER_A,
				widgetId: SERVER_A,
				position: { col: 0, row: 0 },
				size: { w: 2, h: 1 },
			},
			cols: 8,
		})

		expect(result).toBeNull()
	})

	it('still generates an id when no widget is supplied', () => {
		const layout = [widget(SERVER_A, WidgetKeys.clock)]

		const result = resolveLayoutChange({
			layout,
			operation: 'duplicate',
			instanceId: SERVER_A,
			cols: 8,
		})

		expect(result).not.toBeNull()
		expect(result!.length).toBe(2)
		expect(result![1].instanceId).not.toBe(SERVER_A)
	})
})

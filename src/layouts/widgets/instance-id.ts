import type { StoredWidget } from './layout-engine/types'

const SERVER_INSTANCE_ID_PATTERN = /^[0-9a-fA-F]{24}$/

export interface SyncedWidgetIdentity {
	instanceId: string
	widgetKey: string
}

export function isServerInstanceId(value: unknown): value is string {
	return typeof value === 'string' && SERVER_INSTANCE_ID_PATTERN.test(value)
}

export function createLocalInstanceId(widgetKey: string): string {
	return `${widgetKey}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function dedupeInstanceIds(layout: StoredWidget[]): StoredWidget[] {
	const seen = new Set<string>()
	let changed = false

	const result = layout.map((widget) => {
		if (widget.instanceId && !seen.has(widget.instanceId)) {
			seen.add(widget.instanceId)
			return widget
		}

		let nextId = createLocalInstanceId(widget.id)
		while (seen.has(nextId)) {
			nextId = createLocalInstanceId(widget.id)
		}
		seen.add(nextId)
		changed = true

		return { ...widget, instanceId: nextId, widgetId: nextId }
	})

	return changed ? result : layout
}

export function buildInstanceIdMap(
	layout: StoredWidget[],
	synced: SyncedWidgetIdentity[]
): Map<string, string> {
	const idMap = new Map<string, string>()
	const claimed = new Set<string>()

	for (const widget of layout) {
		if (isServerInstanceId(widget.instanceId)) {
			claimed.add(widget.instanceId)
		}
	}

	for (const entry of synced) {
		if (!entry?.instanceId) continue
		const owner = layout.find((w) => w.instanceId === entry.instanceId)
		if (owner) {
			claimed.add(entry.instanceId)
		}
	}

	layout.forEach((widget, index) => {
		if (isServerInstanceId(widget.instanceId)) return

		const candidates: SyncedWidgetIdentity[] = []
		const byIndex = synced[index]
		if (byIndex?.instanceId && byIndex.widgetKey === widget.id) {
			candidates.push(byIndex)
		}
		for (const entry of synced) {
			if (entry?.instanceId && entry.widgetKey === widget.id) {
				candidates.push(entry)
			}
		}

		const matching = candidates.find((entry) => !claimed.has(entry.instanceId))
		if (!matching) return

		claimed.add(matching.instanceId)
		idMap.set(widget.instanceId, matching.instanceId)
	})

	return idMap
}

export function applyInstanceIdMap(
	layout: StoredWidget[],
	idMap: Map<string, string>
): StoredWidget[] {
	if (idMap.size === 0) return layout

	return layout.map((widget) => {
		const nextId = idMap.get(widget.instanceId)
		if (!nextId) return widget
		return { ...widget, instanceId: nextId, widgetId: nextId }
	})
}

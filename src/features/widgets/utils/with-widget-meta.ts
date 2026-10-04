import type { StoredWidget } from './layout-engine/types'

export function withWidgetMeta(
	layout: StoredWidget[],
	instanceId: string,
	meta: StoredWidget['meta']
): StoredWidget[] {
	if (!layout.some((w) => w.instanceId === instanceId)) return layout
	return layout.map((w) => (w.instanceId === instanceId ? { ...w, meta } : w))
}

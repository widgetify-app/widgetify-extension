import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'
import type { StoredWidget } from '../layout-engine/types'
import type { SlotLook, WidgetSlot } from '../../types'

export function findSlot(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace
): WidgetSlot | undefined {
	return slots.find((slot) => slot.workspace === workspace)
}

function upsertSlot(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace,
	change: (current: WidgetSlot) => WidgetSlot
): WidgetSlot[] {
	const current = findSlot(slots, workspace)
	const next = change(
		current ?? { workspace, name: null, updatedAt: 0, widgets: [], look: null }
	)
	return current
		? slots.map((slot) => (slot.workspace === workspace ? next : slot))
		: [...slots, next]
}

export function withStashedSlot(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace,
	stash: { widgets: StoredWidget[]; look: SlotLook },
	now: number
): WidgetSlot[] {
	return upsertSlot(slots, workspace, (slot) => ({ ...slot, ...stash, updatedAt: now }))
}

export function withActiveSlot(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace,
	startWith: StoredWidget[] | undefined,
	now: number
): WidgetSlot[] {
	return upsertSlot(slots, workspace, (slot) =>
		startWith
			? { ...slot, widgets: startWith, look: null, updatedAt: now }
			: { ...slot, look: null }
	)
}

export function withSlotName(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace,
	name: string | null
): WidgetSlot[] {
	return upsertSlot(slots, workspace, (slot) => ({ ...slot, name }))
}

export function withoutSlot(
	slots: WidgetSlot[],
	workspace: WidgetWorkspace
): WidgetSlot[] {
	return slots.filter((slot) => slot.workspace !== workspace)
}

function sameWallpaper(a: StoredWallpaper, b: StoredWallpaper | null): boolean {
	return (
		b !== null &&
		a.id === b.id &&
		a.type === b.type &&
		a.src === b.src &&
		a.gradient?.from === b.gradient?.from &&
		a.gradient?.to === b.gradient?.to &&
		a.gradient?.direction === b.gradient?.direction
	)
}

export function lookChanges(
	current: SlotLook,
	target: SlotLook | null
): Partial<SlotLook> {
	if (!target) return {}
	const changes: Partial<SlotLook> = {}
	if (target.theme && target.theme !== current.theme) changes.theme = target.theme
	if (target.fontFamily && target.fontFamily !== current.fontFamily) {
		changes.fontFamily = target.fontFamily
	}
	if (
		target.browserTitle &&
		target.browserTitle.template !== current.browserTitle?.template
	) {
		changes.browserTitle = target.browserTitle
	}
	if (target.wallpaper && !sameWallpaper(target.wallpaper, current.wallpaper)) {
		changes.wallpaper = target.wallpaper
	}
	return changes
}

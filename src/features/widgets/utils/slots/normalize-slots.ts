import type { StoredWallpaper } from '@/common/types/wallpaper.interface'
import type { WidgetWorkspace } from '@/services/widgets/widget-sync.hook'
import type { StoredWidget } from '../layout-engine/types'
import type { SlotBrowserTitle, SlotLook, WidgetSlot } from '../../types'
import { SLOT_NAME_MAX_LENGTH, SLOT_WORKSPACES } from './slot-access'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value)
}

function isWorkspace(value: unknown): value is WidgetWorkspace {
	return SLOT_WORKSPACES.includes(value as WidgetWorkspace)
}

function isStoredWidget(value: unknown): value is StoredWidget {
	if (!isRecord(value)) return false
	const { id, instanceId, position, size } = value
	return (
		typeof id === 'string' &&
		typeof instanceId === 'string' &&
		isRecord(position) &&
		isFiniteNumber(position.col) &&
		isFiniteNumber(position.row) &&
		isRecord(size) &&
		isFiniteNumber(size.w) &&
		isFiniteNumber(size.h)
	)
}

const WALLPAPER_TYPES: StoredWallpaper['type'][] = ['IMAGE', 'VIDEO', 'GRADIENT']

type GradientDirection = NonNullable<StoredWallpaper['gradient']>['direction']

function nonEmptyString(value: unknown): string | null {
	return typeof value === 'string' && value.length > 0 ? value : null
}

function normalizeWallpaper(value: unknown): StoredWallpaper | null {
	if (!isRecord(value)) return null
	const { id, type, src, gradient } = value
	if (typeof id !== 'string' || typeof src !== 'string') return null
	if (!WALLPAPER_TYPES.includes(type as StoredWallpaper['type'])) return null

	const wallpaper: StoredWallpaper = { id, type: type as StoredWallpaper['type'], src }
	if (type === 'GRADIENT') {
		if (
			!isRecord(gradient) ||
			typeof gradient.from !== 'string' ||
			typeof gradient.to !== 'string' ||
			typeof gradient.direction !== 'string'
		) {
			return null
		}
		wallpaper.gradient = {
			from: gradient.from,
			to: gradient.to,
			direction: gradient.direction as GradientDirection,
		}
	}
	return wallpaper
}

function normalizeBrowserTitle(value: unknown): SlotBrowserTitle | null {
	if (!isRecord(value) || typeof value.template !== 'string') return null
	return {
		id: typeof value.id === 'string' ? value.id : 'default',
		name: typeof value.name === 'string' ? value.name : '',
		template: value.template,
	}
}

function normalizeLook(value: unknown): SlotLook | null {
	if (!isRecord(value)) return null
	return {
		theme: nonEmptyString(value.theme),
		fontFamily: nonEmptyString(value.fontFamily),
		browserTitle: normalizeBrowserTitle(value.browserTitle),
		wallpaper: normalizeWallpaper(value.wallpaper),
	}
}

export function normalizeSlotName(value: unknown): string | null {
	if (typeof value !== 'string') return null
	const name = value.trim().slice(0, SLOT_NAME_MAX_LENGTH).trim()
	return name.length > 0 ? name : null
}

export function normalizeActiveSlot(value: unknown): WidgetWorkspace {
	return isWorkspace(value) ? value : 'HOME'
}

export function normalizeSlots(value: unknown): WidgetSlot[] {
	if (!Array.isArray(value)) return []

	const slots: WidgetSlot[] = []
	for (const entry of value) {
		if (!isRecord(entry) || !isWorkspace(entry.workspace)) continue
		if (slots.some((slot) => slot.workspace === entry.workspace)) continue

		slots.push({
			workspace: entry.workspace,
			name: normalizeSlotName(entry.name),
			updatedAt: isFiniteNumber(entry.updatedAt) ? entry.updatedAt : 0,
			widgets: Array.isArray(entry.widgets)
				? entry.widgets.filter(isStoredWidget)
				: [],
			look: normalizeLook(entry.look),
		})
	}
	return slots
}

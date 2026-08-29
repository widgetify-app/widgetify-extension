import { compactLayout } from './compact'
import { reconcileIdentity } from './identity'
import { findAvailableSlot, getBestAllowedSizeForColumns } from './placement'
import { resolveCollisions } from './push'
import type {
	LayoutEngineOptions,
	StoredWidget,
	WidgetPosition,
	WidgetSize,
} from './types'
import { validateLayout } from './validation'

function patchWidget(
	layout: StoredWidget[],
	instanceId: string,
	patch: { position?: WidgetPosition; size?: WidgetSize }
): StoredWidget[] | null {
	const index = layout.findIndex((w) => w.instanceId === instanceId)
	if (index === -1) return null

	const current = layout[index]
	const next: StoredWidget = {
		...current,
		position: patch.position ?? current.position,
		size: patch.size ?? current.size,
	}

	const updated = layout.slice()
	updated[index] = next
	return updated
}

function assertValidInDev(
	layout: StoredWidget[],
	cols: number,
	registry: LayoutEngineOptions['registry'],
	operation: string
): void {
	if (!import.meta.env.DEV) return
	if (!validateLayout(layout, cols, registry)) {
		console.error(
			`[layout-engine] "${operation}" produced an invalid layout`,
			layout
		)
	}
}

export function resolveLayoutChange(
	options: LayoutEngineOptions
): StoredWidget[] | null {
	const {
		layout,
		operation,
		instanceId,
		targetPosition,
		targetSize,
		newWidget,
		cols,
		allowedSizes,
		registry,
	} = options

	switch (operation) {
		case 'move': {
			if (!instanceId || !targetPosition) return null

			const current = layout.find((w) => w.instanceId === instanceId)
			if (!current) return null

			const clampedCol = Math.max(
				0,
				Math.min(cols - current.size.w, targetPosition.col)
			)
			const clampedRow = Math.max(0, targetPosition.row)

			const patched = patchWidget(layout, instanceId, {
				position: { col: clampedCol, row: clampedRow },
			})
			if (!patched) return null

			const resolved = resolveCollisions(patched, new Set([instanceId]), cols)
			assertValidInDev(resolved, cols, registry, 'move')

			return reconcileIdentity(layout, resolved)
		}

		case 'resize': {
			if (!instanceId || !targetSize) return null
			if (targetSize.w > cols || targetSize.w <= 0 || targetSize.h <= 0) {
				return null
			}

			const current = layout.find((w) => w.instanceId === instanceId)
			if (!current) return null

			const nextSize: WidgetSize = { ...targetSize }
			const nextPosition: WidgetPosition =
				current.position.col + nextSize.w > cols
					? { col: Math.max(0, cols - nextSize.w), row: current.position.row }
					: current.position

			const patched = patchWidget(layout, instanceId, {
				position: nextPosition,
				size: nextSize,
			})
			if (!patched) return null

			const resolved = resolveCollisions(patched, new Set([instanceId]), cols)
			assertValidInDev(resolved, cols, registry, 'resize')

			return reconcileIdentity(layout, resolved)
		}

		case 'add': {
			if (!newWidget) return null
			if (newWidget.size.w > cols) return null

			const toAdd: StoredWidget = {
				...newWidget,
				position: { ...newWidget.position },
				size: { ...newWidget.size },
			}

			if (
				targetPosition &&
				targetPosition.col + toAdd.size.w <= cols &&
				targetPosition.col >= 0 &&
				targetPosition.row >= 0
			) {
				toAdd.position = { ...targetPosition }
				const resolved = resolveCollisions(
					[...layout, toAdd],
					new Set([toAdd.instanceId]),
					cols
				)
				if (validateLayout(resolved, cols, registry)) {
					return resolved
				}
			}

			toAdd.position = findAvailableSlot(layout, toAdd.size, cols)
			const appended = [...layout, toAdd]

			if (!validateLayout(appended, cols, registry)) {
				return null
			}

			return appended
		}

		case 'duplicate': {
			if (!instanceId) return null
			const original = layout.find((w) => w.instanceId === instanceId)
			if (!original) return null

			const newInstanceId = `${original.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
			const duplicated: StoredWidget = {
				id: original.id,
				instanceId: newInstanceId,
				size: { ...original.size },
				position: findAvailableSlot(layout, original.size, cols),
			}

			const appended = [...layout, duplicated]

			if (!validateLayout(appended, cols, registry)) {
				return null
			}

			return appended
		}

		case 'remove': {
			if (!instanceId) return null
			const filtered = layout.filter((w) => w.instanceId !== instanceId)
			if (!validateLayout(filtered, cols, registry)) {
				return null
			}
			return filtered
		}

		case 'responsive-reflow': {
			const sorted = [...layout].sort((a, b) => {
				if (a.position.row !== b.position.row) {
					return a.position.row - b.position.row
				}
				return a.position.col - b.position.col
			})

			const reflowed: StoredWidget[] = []

			for (const widget of sorted) {
				const validSizes = allowedSizes || [widget.size]
				const adaptedSize: WidgetSize = getBestAllowedSizeForColumns(
					validSizes,
					widget.size,
					cols
				)

				const slot = findAvailableSlot(reflowed, adaptedSize, cols)
				const isSame =
					adaptedSize.w === widget.size.w &&
					adaptedSize.h === widget.size.h &&
					slot.col === widget.position.col &&
					slot.row === widget.position.row

				reflowed.push(
					isSame ? widget : { ...widget, size: adaptedSize, position: slot }
				)
			}

			const compacted = compactLayout(reflowed, cols)
			if (!validateLayout(compacted, cols, registry)) {
				return null
			}

			return reconcileIdentity(layout, compacted)
		}

		default:
			return null
	}
}

import {
	getBestAllowedSizeForColumns,
	DEFAULT_COLS,
	resolveLayoutChange,
	validateLayout,
} from '@/layouts/widgets/layout-engine'
import type { StoredWidget } from '@/layouts/widgets/layout-engine/types'
import { dedupeInstanceIds, isServerInstanceId } from '@/layouts/widgets/instance-id'
import { WIDGET_DEFINITIONS } from '@/layouts/widgets/widget-registry'

export function normalizeWidgetSizes(
	layout: StoredWidget[],
	cols: number
): StoredWidget[] {
	let changed = false

	const normalized = layout.map((widget) => {
		const definition = WIDGET_DEFINITIONS[widget.id]
		if (!definition) return widget

		const isAllowed = definition.allowedSizes.some(
			(s) => s.w === widget.size.w && s.h === widget.size.h
		)
		if (isAllowed) return widget

		const size = getBestAllowedSizeForColumns(
			definition.allowedSizes,
			widget.size,
			cols
		)
		changed = true
		return { ...widget, size }
	})

	return changed ? normalized : layout
}

export function sanitizeLayout(layout: StoredWidget[], cols: number): StoredWidget[] {
	const sized = normalizeWidgetSizes(dedupeInstanceIds(layout), cols)

	if (validateLayout(sized, cols)) {
		return sized
	}

	return (
		resolveLayoutChange({
			layout: sized,
			operation: 'responsive-reflow',
			cols,
		}) ?? sized
	)
}

export function storedWidgetToApiPayload(w: StoredWidget) {
	return {
		instanceId: isServerInstanceId(w.instanceId) ? w.instanceId : undefined,
		widgetKey: w.id,
		col: w.position.col,
		row: w.position.row,
		width: w.size.w,
		height: w.size.h,
		meta: w.meta,
		disabled: w.disabled ?? false,
	}
}

export function reflowForColumns(
	baseLayout: StoredWidget[],
	targetCols: number
): StoredWidget[] {
	const safeLayout = sanitizeLayout(baseLayout, targetCols)

	if (targetCols >= DEFAULT_COLS) {
		return safeLayout
	}

	const reflowed = resolveLayoutChange({
		layout: safeLayout,
		operation: 'responsive-reflow',
		cols: targetCols,
		registry: WIDGET_DEFINITIONS,
	})

	return reflowed || safeLayout
}

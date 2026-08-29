import { memo } from 'react'
import type { WidgetDefinition, WidgetSize } from '../layout-engine/types'

interface WidgetSlotProps {
	definition: WidgetDefinition
	instanceId: string
	size: WidgetSize
	meta?: any
}

function WidgetSlotImpl({ definition, instanceId, size, meta }: WidgetSlotProps) {
	return <>{definition.node(instanceId, size, meta)}</>
}

export const WidgetSlot = memo(
	WidgetSlotImpl,
	(a, b) =>
		a.definition === b.definition &&
		a.instanceId === b.instanceId &&
		a.size.w === b.size.w &&
		a.size.h === b.size.h &&
		a.meta === b.meta
)

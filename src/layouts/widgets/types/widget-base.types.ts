import type React from 'react'
import type { WidgetSize } from '../layout-engine/types'

export type WidgetSizeKey = `${number}x${number}`

export interface BaseWidgetProps {
	instanceId?: string
	size?: WidgetSize
	className?: string
}

export type WidgetVariantComponent<P = {}> = React.ComponentType<
	P & { size?: WidgetSize }
>

export function matchWidgetSize(size?: WidgetSize): WidgetSizeKey {
	if (!size) return '2x2'
	return `${size.w}x${size.h}` as WidgetSizeKey
}

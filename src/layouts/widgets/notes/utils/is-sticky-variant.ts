import type { WidgetSize } from '@widget/layout-engine/types'
import type { NotesMeta } from '../types'

const STICKY_SIZE: WidgetSize = { w: 2, h: 2 }

export function isStickyVariant(size: WidgetSize, meta?: NotesMeta): boolean {
	if (meta?.variant) return meta.variant === 'sticky'

	return size.w === STICKY_SIZE.w && size.h === STICKY_SIZE.h
}

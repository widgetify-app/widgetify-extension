import type { WidgetSize } from '@/features/widgets/utils/layout-engine/types'
import type { NotesMeta, NotesVariant } from '../types'

const NOTES_VARIANTS: NotesVariant[] = ['list', 'sticky', 'board', 'panel']

export function resolveNotesVariant(size: WidgetSize, meta?: NotesMeta): NotesVariant {
	if (meta?.variant && NOTES_VARIANTS.includes(meta.variant)) return meta.variant
	if (size.w === 2 && size.h === 2) return 'sticky'
	if (size.w === 4 && size.h === 3) return 'board'
	if (size.w === 2 && size.h === 6) return 'panel'
	return 'list'
}

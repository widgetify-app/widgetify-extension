import { NotesProvider } from '@/features/widgets/notes/notes.context'
import type { ReactNode } from 'react'
import type { WidgetSize } from '../utils/layout-engine/types'
import type { NotesMeta } from './types'
import { resolveNotesVariant } from './utils/resolve-notes-variant'
import { NoteBoard } from './variants/note-board'
import { NoteList } from './variants/note-list'
import { NoteSticky } from './variants/note-sticky'

export { resolveNotesVariant } from './utils/resolve-notes-variant'

interface NotesLayoutProps {
	size?: WidgetSize
	meta?: NotesMeta
	instanceId?: string
	tabs?: ReactNode
}

export function NotesLayout({
	size = { w: 2, h: 3 },
	meta,
	instanceId,
	tabs,
}: NotesLayoutProps = {}) {
	const variant = resolveNotesVariant(size, meta)

	return (
		<NotesProvider>
			{variant === 'sticky' ? (
				<NoteSticky meta={meta} instanceId={instanceId} />
			) : variant === 'board' ? (
				<NoteBoard />
			) : (
				<NoteList tabs={tabs} />
			)}
		</NotesProvider>
	)
}

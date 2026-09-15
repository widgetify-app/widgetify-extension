import { NotesProvider } from '@/context/notes.context'
import type { WidgetSize } from '../layout-engine/types'
import type { NotesMeta } from './types'
import { isStickyVariant } from './utils/is-sticky-variant'
import { NoteList } from './variants/note-list'
import { NoteSticky } from './variants/note-sticky'

interface NotesLayoutProps {
	size?: WidgetSize
	meta?: NotesMeta
	instanceId?: string
}

export function NotesLayout({
	size = { w: 2, h: 3 },
	meta,
	instanceId,
}: NotesLayoutProps = {}) {
	return (
		<NotesProvider>
			{isStickyVariant(size, meta) ? (
				<NoteSticky meta={meta} instanceId={instanceId} />
			) : (
				<NoteList />
			)}
		</NotesProvider>
	)
}

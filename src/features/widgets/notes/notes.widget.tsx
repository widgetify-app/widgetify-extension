import { NotesProvider } from '@/features/widgets/notes/notes.context'
import type { ReactNode } from 'react'
import type { WidgetSize } from '../utils/layout-engine/types'
import type { NotesMeta } from './types'
import { isStickyVariant } from './utils/is-sticky-variant'
import { NoteList } from './variants/note-list'
import { NoteSticky } from './variants/note-sticky'

export { isStickyVariant } from './utils/is-sticky-variant'

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
	return (
		<NotesProvider>
			{isStickyVariant(size, meta) ? (
				<NoteSticky meta={meta} instanceId={instanceId} />
			) : (
				<NoteList tabs={tabs} />
			)}
		</NotesProvider>
	)
}

import { useEffect, useMemo, useState } from 'react'
import { ConfirmationModal, PopoverMenuItem } from '@/components/ui'
import { useNotes } from '@/features/widgets/notes/notes.context'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useFreeWidgetActions } from '@/features/widgets/widgets.context'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { STICKY_COLOR_MAP } from '../constants'
import { NoteColorPicker } from '../components/note-color-picker'
import { NoteFields } from '../components/note-fields'
import type { NotePriority, NotesMeta } from '../types'
import moment from 'jalali-moment'
import { WidgetError } from '@/features/widgets/components/widget-error'
import {
	WidgetHeader,
	WidgetHeaderButton,
} from '@/features/widgets/components/widget-header'
import { useWidgetMenuActions } from '@/features/widgets/widget-menu.context'

interface NoteStickyProps {
	meta?: NotesMeta
	instanceId?: string
}

export function NoteSticky({ meta, instanceId }: NoteStickyProps = {}) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const {
		notes,
		addNote,
		updateNote,
		deleteNote,
		isSaving,
		isCreatingNote,
		isLoading,
		isError,
		refetch,
	} = useNotes()
	const { updateWidgetSettings } = useFreeWidgetActions()

	const [currentIndex, setCurrentIndex] = useState(0)
	const [localTitle, setLocalTitle] = useState('')
	const [localBody, setLocalBody] = useState('')
	const [localPriority, setLocalPriority] = useState<NotePriority | undefined>(
		undefined
	)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const targetNoteId = meta?.activeNoteId || meta?.noteId

	const currentNote = useMemo(() => {
		if (!notes.length) return null
		if (targetNoteId) {
			const found = notes.find((n) => n.id === targetNoteId)
			if (found) return found
		}
		const validIndex = Math.min(Math.max(0, currentIndex), notes.length - 1)
		return notes[validIndex] || notes[0]
	}, [notes, targetNoteId, currentIndex])

	useEffect(() => {
		if (currentNote) {
			setLocalTitle(currentNote.title || '')
			setLocalBody(currentNote.body || '')
			setLocalPriority(currentNote.priority)
			const foundIndex = notes.findIndex((n) => n.id === currentNote.id)
			if (foundIndex !== -1 && foundIndex !== currentIndex) {
				setCurrentIndex(foundIndex)
			}
			const targetResolved = !targetNoteId || currentNote.id === targetNoteId
			if (
				instanceId &&
				currentNote.id &&
				meta?.activeNoteId !== currentNote.id &&
				targetResolved
			) {
				updateWidgetSettings(instanceId, {
					...meta,
					activeNoteId: currentNote.id,
				})
			}
		} else {
			setLocalTitle('')
			setLocalBody('')
			setLocalPriority(undefined)
		}
	}, [currentNote?.id])

	const handleTitleChange = (val: string) => {
		setLocalTitle(val)
		if (currentNote) {
			updateNote(currentNote.id, {
				title: val,
				body: localBody,
				priority: localPriority,
			})
		}
	}

	const handleBodyChange = (val: string) => {
		setLocalBody(val)
		if (currentNote) {
			updateNote(currentNote.id, {
				title: localTitle,
				body: val,
				priority: localPriority,
			})
		}
	}

	const handlePriorityChange = (nextPriority?: NotePriority) => {
		if (!currentNote) return
		setLocalPriority(nextPriority)
		updateNote(currentNote.id, {
			title: localTitle,
			body: localBody,
			priority: nextPriority,
		})
	}

	const handlePrevNote = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (notes.length <= 1) return
		const prev = (currentIndex - 1 + notes.length) % notes.length
		setCurrentIndex(prev)
		const target = notes[prev]
		if (instanceId && target) {
			updateWidgetSettings(instanceId, {
				...meta,
				activeNoteId: target.id,
			})
		}
		Analytics.event('note_sticky_prev')
	}

	const handleNextNote = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (notes.length <= 1) return
		const next = (currentIndex + 1) % notes.length
		setCurrentIndex(next)
		const target = notes[next]
		if (instanceId && target) {
			updateWidgetSettings(instanceId, {
				...meta,
				activeNoteId: target.id,
			})
		}
		Analytics.event('note_sticky_next')
	}

	const handleCreateNote = async () => {
		if (!isAuthenticated) {
			callEvent('open_require_auth_modal')
			Analytics.event('note_open_required_auth_modal')
			return
		}
		const created = await addNote({
			title: '',
			body: '',
		})
		if (created) {
			setCurrentIndex(0)
			if (instanceId) {
				updateWidgetSettings(instanceId, {
					...meta,
					activeNoteId: created.id,
				})
			}
		}
	}

	const handleDelete = async () => {
		setShowDeleteConfirm(false)
		if (currentNote) {
			await deleteNote(currentNote.id)
			const remaining = notes.filter((n) => n.id !== currentNote.id)
			const nextIdx = Math.min(currentIndex, Math.max(0, remaining.length - 1))
			setCurrentIndex(nextIdx)
			if (instanceId) {
				updateWidgetSettings(instanceId, {
					...meta,
					activeNoteId: remaining[nextIdx]?.id,
				})
			}
		}
	}

	useWidgetMenuActions(
		<PopoverMenuItem
			icon={<Icon name="refresh" size={14} />}
			label={t('widgets.notes.refresh')}
			onClick={() => {
				refetch()
				Analytics.event('note_refetch')
			}}
		/>
	)

	const colorTheme =
		STICKY_COLOR_MAP[localPriority || 'default'] || STICKY_COLOR_MAP.default
	const tone = colorTheme.onColor ? 'onColor' : 'default'

	const frameClass = cn(
		'relative flex flex-col w-full h-full gap-2 p-3 overflow-hidden select-none rounded-widget transition-ui',
		colorTheme.bg,
		colorTheme.text
	)

	if (isLoading && !notes.length) {
		return (
			<div aria-hidden="true" className={frameClass}>
				<div className="flex items-center flex-none h-7">
					<div className="w-16 h-3 rounded-sm skeleton" />
				</div>
				<div className="flex flex-col flex-1 min-h-0 gap-1.5 px-2">
					<div className="w-1/2 h-4 rounded-sm skeleton" />
					<div className="flex-1 rounded-xl skeleton" />
				</div>
			</div>
		)
	}

	if (isError && !notes.length) {
		return (
			<div className={frameClass}>
				<WidgetError message={t('widgets.notes.loadError')} onRetry={refetch} />
			</div>
		)
	}

	const noteDate = currentNote
		? moment(currentNote.updatedAt || currentNote.createdAt).locale('fa')
		: null

	return (
		<div className={frameClass}>
			<WidgetHeader
				tone={tone}
				title={t('widgets.notes.stickyTitle')}
				badge={
					isSaving && (
						<span
							className={cn(
								'font-medium text-3xs',
								tone === 'onColor' ? 'opacity-60' : 'text-fg-faint'
							)}
						>
							{t('widgets.notes.saving')}
						</span>
					)
				}
				info={noteDate?.format('jD jMMM')}
				actions={
					<>
						{currentNote && (
							<WidgetHeaderButton
								tone={tone}
								label={t('widgets.notes.deleteThis')}
								icon="trash"
								onClick={() => setShowDeleteConfirm(true)}
							/>
						)}
						<WidgetHeaderButton
							tone={tone}
							label={t('widgets.notes.new')}
							icon="plus"
							onClick={handleCreateNote}
							disabled={isCreatingNote}
						/>
					</>
				}
			/>

			<div
				className={cn(
					'flex flex-col flex-1 min-h-0',
					currentNote && 'widget-control-fade'
				)}
			>
				{currentNote ? (
					<NoteFields
						title={localTitle}
						body={localBody}
						onTitleChange={handleTitleChange}
						onBodyChange={handleBodyChange}
						tone={tone}
						titleDebounceMs={600}
						className={blurMode ? 'blur-mode' : 'disabled-blur-mode'}
						bodyClassName="pb-10 scroll-pb-10"
					/>
				) : (
					<button
						type="button"
						onClick={handleCreateNote}
						className="flex flex-col items-center justify-center w-full h-full gap-1.5 text-center rounded-xl cursor-pointer transition-ui hover:bg-fill focus-visible:focus-ring"
					>
						<Icon
							name="pen"
							size={20}
							aria-hidden="true"
							className="opacity-60"
						/>
						<span className="text-xs font-bold">
							{t('widgets.notes.emptyCtaTitle')}
						</span>
						<span className="opacity-60 text-3xs">
							{t('widgets.notes.emptyCtaHint')}
						</span>
					</button>
				)}
			</div>

			{currentNote && (
				<footer className="absolute flex items-center justify-between gap-2 px-2 inset-x-3 bottom-3 h-5.5 widget-control">
					<NoteColorPicker
						tone={tone}
						value={localPriority}
						onChange={handlePriorityChange}
					/>
					{notes.length > 1 && (
						<nav
							aria-label={t('widgets.notes.otherNotesAria')}
							className="flex items-center gap-1 font-semibold text-3xs"
						>
							<StickyPagerButton
								label={t('widgets.notes.prev')}
								icon="chevronRight"
								onClick={handlePrevNote}
							/>
							<span className="opacity-70 tabular-nums">
								{t('widgets.notes.pager', {
									current: currentIndex + 1,
									total: notes.length,
								})}
							</span>
							<StickyPagerButton
								label={t('widgets.notes.next')}
								icon="chevronLeft"
								onClick={handleNextNote}
							/>
						</nav>
					)}
				</footer>
			)}

			<ConfirmationModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				title={t('widgets.notes.deleteConfirmTitle')}
				message={t('widgets.notes.deleteConfirmMessage')}
				confirmText={t('widgets.notes.deleteConfirm')}
				cancelText={t('widgets.notes.deleteCancel')}
			/>
		</div>
	)
}

interface StickyPagerButtonProps {
	label: string
	icon: 'chevronRight' | 'chevronLeft'
	onClick: (e: React.MouseEvent) => void
}

function StickyPagerButton({ label, icon, onClick }: StickyPagerButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="grid rounded-lg cursor-pointer place-items-center size-5.5 opacity-70 transition-ui hover:opacity-100 hover:bg-fill-2 focus-visible:focus-ring"
		>
			<Icon name={icon} size={14} aria-hidden="true" />
		</button>
	)
}

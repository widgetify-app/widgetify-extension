import { useEffect, useMemo, useState } from 'react'
import {
	Button,
	ConfirmationModal,
	IconLoading,
	TextInput,
	Tooltip,
} from '@/components/ui'
import { useNotes } from '@/context/notes.context'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useFreeWidgetActions } from '@/context/free-widget/free-widget.context'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/src/icons'
import { PRIORITY_OPTIONS } from '@/common/constant/priority_options'
import moment from 'jalali-moment'

const STICKY_COLOR_MAP: Record<
	string,
	{ bg: string; border: string; text: string; headerBg: string; divider: string }
> = {
	default: {
		bg: 'bg-base-200 bg-glass',
		border: 'border-base-content/10',
		text: 'text-content',
		headerBg: 'bg-base-300/40',
		divider: 'border-base-content/10',
	},
	low: {
		bg: 'bg-success',
		border: 'border-success-content/20',
		text: 'text-success-content',
		headerBg: 'bg-black/10',
		divider: 'border-success-content/20',
	},
	medium: {
		bg: 'bg-warning',
		border: 'border-warning-content/20',
		text: 'text-warning-content',
		headerBg: 'bg-black/10',
		divider: 'border-warning-content/20',
	},
	high: {
		bg: 'bg-error',
		border: 'border-error-content/20',
		text: 'text-error-content',
		headerBg: 'bg-black/10',
		divider: 'border-error-content/20',
	},
}

interface NoteStickyProps {
	meta?: Record<string, any>
	instanceId?: string
}

export function NoteSticky({ meta, instanceId }: NoteStickyProps = {}) {
	const { isAuthenticated } = useAuth()
	const { blurMode } = useGeneralSetting()
	const { notes, addNote, updateNote, deleteNote, isSaving, isCreatingNote } =
		useNotes()
	const { updateWidgetSettings } = useFreeWidgetActions()

	const [currentIndex, setCurrentIndex] = useState(0)
	const [localTitle, setLocalTitle] = useState('')
	const [localBody, setLocalBody] = useState('')
	const [localPriority, setLocalPriority] = useState<
		'low' | 'medium' | 'high' | undefined
	>(undefined)
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

	const handlePriorityChange = (priorityKey?: 'low' | 'medium' | 'high') => {
		if (!currentNote) return
		const nextPriority = localPriority === priorityKey ? undefined : priorityKey
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

	const currentPriorityKey = localPriority || 'default'
	const colorTheme = STICKY_COLOR_MAP[currentPriorityKey] || STICKY_COLOR_MAP.default

	return (
		<div
			className={cn(
				'h-full w-full flex flex-col justify-between p-3 rounded-2xl transition-all duration-200 select-none overflow-hidden relative',
				colorTheme.bg,
				colorTheme.text
			)}
		>
			<div
				className={cn(
					'flex items-center justify-between gap-2 pb-1.5 border-b',
					colorTheme.divider
				)}
			>
				<div className="flex items-center gap-1.5 flex-1 min-w-0">
					{currentNote ? (
						<TextInput
							value={localTitle}
							onChange={handleTitleChange}
							debounce
							debounceTime={600}
							placeholder="عنوان یادداشت..."
							direction="rtl"
							className={cn(
								'bg-transparent border-none text-xs font-bold outline-none w-full truncate placeholder:opacity-60 h-auto p-0 shadow-none focus:ring-0',
								colorTheme.text
							)}
						/>
					) : (
						<span className="text-xs font-bold opacity-75">
							استیک نوت جدید
						</span>
					)}
				</div>

				<div className="flex items-center gap-1 shrink-0">
					{notes.length > 1 && (
						<div
							className={cn(
								'flex items-center gap-0.5 rounded-lg h-5 px-1 py-0.5 text-[10px]',
								colorTheme.headerBg
							)}
						>
							<Button
								size="xs"
								variant="ghost"
								rounded="md"
								onClick={handlePrevNote}
								className="w-4 h-4 p-0 border-none shadow-none hover:opacity-100 opacity-70 text-inherit"
								title="یادداشت قبلی"
							>
								<Icon name="chevronRight" size={11} />
							</Button>
							<Button
								size="xs"
								variant="ghost"
								rounded="md"
								onClick={handleNextNote}
								className="w-4 h-4 p-0 border-none shadow-none hover:opacity-100 opacity-70 text-inherit"
								title="یادداشت بعدی"
							>
								<Icon name="chevronLeft" size={11} />
							</Button>
						</div>
					)}

					<Tooltip content="یادداشت جدید">
						<Button
							size="xs"
							variant="ghost"
							rounded="full"
							onClick={handleCreateNote}
							disabled={isCreatingNote}
							className={cn(
								'h-6 w-6 p-0 transition-all hover:scale-105 border-none shadow-none text-inherit',
								colorTheme.headerBg
							)}
						>
							<Icon name="plus" size={12} />
						</Button>
					</Tooltip>

					{currentNote && (
						<Tooltip content="حذف">
							<Button
								size="xs"
								variant="ghost"
								rounded="full"
								onClick={() => setShowDeleteConfirm(true)}
								className={cn(
									'h-6 w-6 p-0 transition-all hover:scale-105 hover:bg-error/30 hover:text-error-content border-none shadow-none text-inherit',
									colorTheme.headerBg
								)}
							>
								<Icon name="trash" size={12} />
							</Button>
						</Tooltip>
					)}
				</div>
			</div>

			<div className="flex-1 min-h-0 py-2">
				{currentNote ? (
					<textarea
						value={localBody}
						onChange={(e) => handleBodyChange(e.target.value)}
						placeholder="اینجا بنویس..."
						className={cn(
							'w-full h-full text-xs leading-relaxed resize-none outline-none bg-transparent font-normal scrollbar-none placeholder:opacity-60',
							blurMode ? 'blur-mode' : 'disabled-blur-mode',
							colorTheme.text
						)}
						dir="rtl"
					/>
				) : (
					<div
						onClick={handleCreateNote}
						className={cn(
							'w-full h-full flex flex-col items-center justify-center text-center cursor-pointer transition-colors p-4 rounded-xl border border-dashed hover:opacity-100 opacity-80',
							colorTheme.border,
							colorTheme.headerBg
						)}
					>
						<Icon name="pen" size={18} className="mb-1 opacity-60" />
						<span className="text-xs font-bold">ایجاد اولین یادداشت</span>
						<span className="text-[10px] opacity-70 mt-0.5">
							برای شروع اینجا کلیک کن
						</span>
					</div>
				)}
			</div>

			<div
				className={cn(
					'flex items-center justify-between pt-1.5 text-[10px]',
					colorTheme.divider
				)}
			>
				<div className="flex items-center gap-1.5">
					<Tooltip content="رنگ پیش‌فرض">
						<button
							type="button"
							onClick={() => handlePriorityChange(undefined)}
							className={cn(
								'w-3.5 h-3.5 rounded-full transition-transform cursor-pointer bg-base-300 border border-base-content/20',
								!localPriority
									? 'ring-2 ring-primary ring-offset-1 scale-110'
									: 'opacity-60 hover:opacity-100'
							)}
						/>
					</Tooltip>
					{PRIORITY_OPTIONS.map((opt) => {
						const isSelected = localPriority === opt.value
						return (
							<Tooltip key={opt.value} content={opt.ariaLabel}>
								<button
									type="button"
									onClick={() => handlePriorityChange(opt.value as any)}
									className={cn(
										'w-3.5 h-3.5 rounded-full transition-transform cursor-pointer',
										opt.bgColor,
										isSelected
											? 'ring-2 ring-primary ring-offset-1 scale-110'
											: 'opacity-60 hover:opacity-100'
									)}
								/>
							</Tooltip>
						)
					})}
				</div>

				<div className="flex items-center gap-1.5">
					{isSaving ? (
						<div className="flex items-center gap-1 text-primary">
							<IconLoading />
							<span className="text-[9px]">درحال ذخیره</span>
						</div>
					) : currentNote ? (
						<span className="opacity-80">
							{moment(currentNote.updatedAt || currentNote.createdAt)
								.locale('fa')
								.format('jD jMMM')}
						</span>
					) : null}
				</div>
			</div>

			<ConfirmationModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				message="از حذف این یادداشت مطمعنی؟"
			/>
		</div>
	)
}

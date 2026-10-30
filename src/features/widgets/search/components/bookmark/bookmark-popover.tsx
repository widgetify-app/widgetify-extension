import { useEffect, useRef } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { Motion, Presence } from '@/common/motion'
import { cn } from '@/common/utils/cn'
import { Button, Portal } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { BookmarkPanel } from './bookmark-panel'

interface BookmarkPopoverProps {
	isOpen: boolean
	onClose: () => void
	coords: { top: number; left: number }
	folderId: string | null
	onFolderChange: (id: string) => void
}

const PREVIEW_ROWS = ['w-3/4', 'w-1/2', 'w-2/3']

export function BookmarkPopover({
	isOpen,
	onClose,
	coords,
	folderId,
	onFolderChange,
}: BookmarkPopoverProps) {
	const { browserBookmarksEnabled, setBrowserBookmarksEnabled } = useGeneralSetting()
	const popoverRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (e: MouseEvent) => {
			if (!popoverRef.current?.contains(e.target as Node)) onClose()
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	const handlePermission = () => {
		Analytics.event('browser_bookmark_permission_clicked')
		setBrowserBookmarksEnabled(true)
	}

	const handleDismiss = () => {
		Analytics.event('browser_bookmark_permission_dismissed')
		onClose()
	}

	return (
		<Portal>
			<Presence>
				{isOpen && (
					<Motion.div
						key="bookmark-popover"
						ref={popoverRef}
						className={cn(
							'fixed overflow-hidden border shadow-xl z-popover border-line rounded-2xl origin-top bg-glass-surface-2',
							browserBookmarksEnabled
								? 'w-155 max-w-[calc(100vw-1.25rem)]'
								: 'w-90 max-w-[calc(100vw-1.25rem)]'
						)}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15, ease: 'easeOut' }}
						style={{ top: coords.top, left: coords.left, direction: 'rtl' }}
					>
						{browserBookmarksEnabled ? (
							<BookmarkPanel
								folderId={folderId}
								onFolderChange={onFolderChange}
							/>
						) : (
							<div className="flex flex-col gap-3.5 p-4">
								<div
									aria-hidden="true"
									className="flex flex-col gap-2.5 p-3.5 border rounded-xl border-surface-3 bg-surface-2"
								>
									{PREVIEW_ROWS.map((width) => (
										<span
											key={width}
											className="flex items-center gap-2"
										>
											<span className="w-4 h-4 rounded-sm bg-fill-2" />
											<span
												className={cn(
													'h-2 rounded-sm bg-fill-2',
													width
												)}
											/>
										</span>
									))}
								</div>
								<div>
									<p className="text-sm font-bold text-fg-strong">
										{t('widgets.search.bookmark.permissionTitle')}
									</p>
									<p className="mt-0.5 text-xs text-fg-muted">
										{t('widgets.search.bookmark.permissionBody')}
									</p>
								</div>
								<div className="flex gap-2">
									<Button
										size="md"
										color="brand"
										rounded="xl"
										onClick={handlePermission}
										className="flex-1"
									>
										{t('widgets.search.bookmark.allow')}
									</Button>
									<Button
										size="md"
										rounded="xl"
										onClick={handleDismiss}
									>
										{t('widgets.search.bookmark.notNow')}
									</Button>
								</div>
							</div>
						)}
					</Motion.div>
				)}
			</Presence>
		</Portal>
	)
}

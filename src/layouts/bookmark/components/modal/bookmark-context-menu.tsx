import { useEffect, useRef } from 'react'
import { Motion } from '@/common/motion'
import { createPortal } from 'react-dom'
import { Icon } from '@/src/icons'

interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
	onEdit: () => void
	onOpenInNewTab?: () => void
	onClose: () => void
	isFolder?: boolean
}

export function BookmarkContextMenu({
	position,
	onDelete,
	onEdit,
	onOpenInNewTab,
	onClose,
}: BookmarkContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose()
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		const handleScroll = () => {
			onClose()
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		window.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('scroll', handleScroll)
		}
	}, [onClose])

	const MENU_WIDTH = 148
	const MENU_HEIGHT = onOpenInNewTab ? 120 : 85

	const adjustedLeft = Math.min(
		Math.max(10, position.x),
		Math.max(10, window.innerWidth - MENU_WIDTH - 10)
	)
	const adjustedTop = Math.min(
		Math.max(10, position.y),
		Math.max(10, window.innerHeight - MENU_HEIGHT - 10)
	)

	return createPortal(
		<Motion.div
			ref={menuRef}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.15, ease: 'easeOut' }}
			style={{
				position: 'fixed',
				left: adjustedLeft,
				top: adjustedTop,
				zIndex: 99999,
			}}
			className="w-[148px] bg-base-200/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-content/10 p-1.5 text-right text-xs flex flex-col gap-1 select-none"
			onClick={(e) => e.stopPropagation()}
			onContextMenu={(e) => {
				e.preventDefault()
				e.stopPropagation()
			}}
		>
			{onOpenInNewTab && (
				<button
					type="button"
					onClick={() => {
						onOpenInNewTab()
						onClose()
					}}
					className="w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer rounded-xl transition-colors duration-150 text-content hover:bg-base-300 text-xs"
				>
					<span className="font-medium">در تب جدید</span>
					<Icon name="plus" size={13} className="text-muted" />
				</button>
			)}

			<button
				type="button"
				onClick={() => {
					onEdit()
					onClose()
				}}
				className="w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer rounded-xl transition-colors duration-150 text-content hover:bg-base-300 text-xs"
			>
				<span className="font-medium">ویرایش</span>
				<Icon name="pen" size={12} className="text-muted" />
			</button>

			<div className="h-px bg-base-content/10 my-0.5" />

			<button
				type="button"
				onClick={() => {
					onDelete()
					onClose()
				}}
				className="w-full px-2.5 py-1.5 flex items-center justify-between cursor-pointer rounded-xl transition-colors duration-150 text-error hover:bg-error/15 text-xs"
			>
				<span className="font-medium">حذف</span>
				<Icon name="trash" size={13} className="text-error" />
			</button>
		</Motion.div>,
		document.body
	)
}

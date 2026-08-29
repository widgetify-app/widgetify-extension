import { useEffect, useRef } from 'react'
import { Icon } from '@/src/icons'

interface CanvasContextMenuProps {
	x: number
	y: number
	canvasMode: 'normal' | 'edit'
	onClose: () => void
	onToggleEditMode: () => void
	onOpenAddWidget: () => void
	onOpenPresets?: () => void
	onOpenAppearanceSettings: () => void
	onOpenHelp?: () => void
}

export function CanvasContextMenu({
	x,
	y,
	canvasMode,
	onClose,
	onToggleEditMode,
	onOpenAddWidget,
	onOpenPresets,
	onOpenAppearanceSettings,
	onOpenHelp,
}: CanvasContextMenuProps) {
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

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [onClose])

	const adjustedLeft = Math.min(Math.max(10, x), window.innerWidth - 220)
	const adjustedTop = Math.min(Math.max(10, y), window.innerHeight - 220)

	return (
		<div
			ref={menuRef}
			style={{
				position: 'fixed',
				left: adjustedLeft,
				top: adjustedTop,
				zIndex: 9999,
			}}
			className="w-52 bg-base-200/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-content/10 p-2 text-right text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
			onClick={(e) => e.stopPropagation()}
			onContextMenu={(e) => e.preventDefault()}
		>
			<button
				type="button"
				onClick={() => {
					onToggleEditMode()
					onClose()
				}}
				className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
			>
				<Icon name="edit" size={14} className="text-muted" />
				<span>{canvasMode === 'edit' ? 'پایان ویرایش' : 'ویرایش ویجت‌ها'}</span>
			</button>

			<button
				type="button"
				onClick={() => {
					onOpenAddWidget()
					onClose()
				}}
				className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
			>
				<Icon name="plus" size={14} className="text-muted" />
				<span>افزودن ویجت</span>
			</button>

			{onOpenPresets && (
				<button
					type="button"
					onClick={() => {
						onOpenPresets()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
				>
					<Icon name="squares2X2" size={14} className="text-muted" />
					<span>چیدمان‌های آماده</span>
				</button>
			)}

			<button
				type="button"
				onClick={() => {
					onOpenAppearanceSettings()
					onClose()
				}}
				className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors"
			>
				<Icon name="brush" size={14} className="text-muted" />
				<span>تنظیمات ظاهری</span>
			</button>

			{onOpenHelp && (
				<button
					type="button"
					onClick={() => {
						onOpenHelp()
						onClose()
					}}
					className="w-full px-2 py-1.5 rounded-xl hover:bg-base-300 text-content text-right flex items-center gap-2 cursor-pointer transition-colors border-t border-base-content/5 mt-0.5 pt-1.5"
				>
					<Icon name="help" size={14} className="text-muted" />
					<span>راهنمای ویجت‌ها</span>
				</button>
			)}
		</div>
	)
}

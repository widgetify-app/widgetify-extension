import { useEffect, useRef, useState } from 'react'
import { Portal } from '@/components/ui/portal/portal'
import { cn } from '@/common/utils/cn'

export interface PopoverMenuProps {
	isOpen: boolean
	onClose: () => void
	position?: { x: number; y: number } | null
	triggerRef?: React.RefObject<HTMLElement | null>
	children: React.ReactNode
	className?: string
	width?: number | string
	placement?:
		| 'bottom-start'
		| 'bottom-end'
		| 'bottom-center'
		| 'top-start'
		| 'top-end'
		| 'top-center'
	offset?: number
}

export function PopoverMenu({
	isOpen,
	onClose,
	position,
	triggerRef,
	children,
	className,
	width = 208,
	placement = 'bottom-center',
	offset = 8,
}: PopoverMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null)
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)

	useEffect(() => {
		if (!isOpen) {
			setCoords(null)
			return
		}

		const computePosition = () => {
			if (position) {
				const numericWidth = typeof width === 'number' ? width : 208
				const left = Math.min(
					Math.max(12, position.x),
					window.innerWidth - numericWidth - 12
				)
				const top = Math.min(Math.max(12, position.y), window.innerHeight - 260)
				setCoords({ top, left })
				return
			}

			if (triggerRef?.current) {
				const rect = triggerRef.current.getBoundingClientRect()
				const numericWidth = typeof width === 'number' ? width : 208
				let left = rect.left + rect.width / 2 - numericWidth / 2
				let top = rect.bottom + offset

				if (placement === 'bottom-start') {
					left = rect.left
				} else if (placement === 'bottom-end') {
					left = rect.right - numericWidth
				} else if (placement.startsWith('top')) {
					top = rect.top - offset - 100
					if (placement === 'top-start') left = rect.left
					if (placement === 'top-end') left = rect.right - numericWidth
				}

				left = Math.min(Math.max(12, left), window.innerWidth - numericWidth - 12)
				top = Math.min(Math.max(12, top), window.innerHeight - 180)

				setCoords({ top, left })
			}
		}

		computePosition()

		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				triggerRef?.current &&
				!triggerRef.current.contains(e.target as Node)
			) {
				onClose()
			} else if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				!triggerRef
			) {
				onClose()
			}
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		const handleScroll = () => {
			onClose()
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleKeyDown)
		window.addEventListener('scroll', handleScroll, true)
		window.addEventListener('resize', computePosition)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('scroll', handleScroll, true)
			window.removeEventListener('resize', computePosition)
		}
	}, [isOpen, position, triggerRef, width, placement, offset, onClose])

	if (!isOpen || !coords) return null

	return (
		<Portal topLayer>
			<div
				ref={menuRef}
				style={{
					position: 'fixed',
					top: coords.top,
					left: coords.left,
					width: typeof width === 'number' ? `${width}px` : width,
					zIndex: 99999,
					pointerEvents: 'auto',
				}}
				className={cn(
					'bg-base-200/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-content/10 p-2 text-right text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150',
					className
				)}
				onClick={(e) => e.stopPropagation()}
				onContextMenu={(e) => e.preventDefault()}
			>
				{children}
			</div>
		</Portal>
	)
}

export interface PopoverMenuItemProps {
	icon?: React.ReactNode
	label: string
	badge?: React.ReactNode
	onClick?: () => void
	variant?: 'default' | 'danger' | 'primary'
	disabled?: boolean
	className?: string
}
const variantStyles = {
	default: 'text-content hover:bg-base-content/10 active:bg-base-300',
	danger: 'text-error hover:bg-error/10 active:bg-error/20',
	primary: 'text-primary hover:bg-primary/10 active:bg-primary/20',
}
export function PopoverMenuItem({
	icon,
	label,
	badge,
	onClick,
	variant = 'default',
	disabled = false,
	className,
}: PopoverMenuItemProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={(e) => {
				e.stopPropagation()
				if (!disabled) {
					onClick?.()
				}
			}}
			className={cn(
				'flex items-center justify-between w-full px-2.5 py-2 rounded-xl font-medium transition-colors text-right cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
				variantStyles[variant],
				className
			)}
		>
			<div className="flex items-center gap-2">
				{icon && <span className="text-sm shrink-0">{icon}</span>}
				<span className="truncate">{label}</span>
			</div>
			{badge && <span className="shrink-0">{badge}</span>}
		</button>
	)
}

export function PopoverMenuDivider() {
	return <div className="h-px my-1 bg-base-content/10" />
}

export function PopoverMenuHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="px-2.5 py-1 text-[11px] font-semibold text-muted flex items-center justify-between">
			{children}
		</div>
	)
}

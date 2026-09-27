import { useEffect, useRef } from 'react'
import { cn } from '@/common/utils/cn'

interface ContextMenuProps {
	className?: string
	position: { x: number; y: number }
	children: React.ReactNode
	onClose?: () => void
}

export function ContextMenu({
	className,
	position,
	children,
	onClose,
}: ContextMenuProps) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onClose?.()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClose])

	return (
		<div
			ref={ref}
			className={cn(
				'absolute z-popover flex flex-col p-2 min-w-5 rounded-2xl shadow-lg bg-ds-surface-2 backdrop-blur-lg border-2 border-ds-surface-3',
				className
			)}
			style={{
				top: position.y,
				left: position.x,
			}}
		>
			{children}
		</div>
	)
}

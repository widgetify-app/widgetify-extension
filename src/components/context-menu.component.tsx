import { useEffect, useRef } from 'react'

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
			className={`absolute flex flex-col p-2 min-w-5 rounded-2xl shadow-lg bg-content backdrop-blur-lg border-2 border-content ${className}`}
			style={{
				top: position.y,
				left: position.x,
				zIndex: 1000,
			}}
		>
			{children}
		</div>
	)
}

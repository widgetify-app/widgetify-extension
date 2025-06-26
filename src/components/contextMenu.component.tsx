interface ContextMenuProps {
	className?: string
	position: { x: number; y: number }
	children: React.ReactNode
}

export function ContextMenu({ className, position, children }: ContextMenuProps) {
	return (
		<div
			className={`absolute flex flex-col p-2 min-w-5 rounded-xl bg-content backdrop-blur-lg border border-content ${className}`}
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	)
}

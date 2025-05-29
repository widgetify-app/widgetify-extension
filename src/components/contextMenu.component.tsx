interface ContextMenuProps {
	position: { x: number; y: number }
	children: React.ReactNode
}

export function ContextMenu({ position, children }: ContextMenuProps) {
	return (
		<div
			className={
				'absolute p-2 min-w-[150px] rounded-lg bg-content shadow-md  border-1 border-content'
			}
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	)
}

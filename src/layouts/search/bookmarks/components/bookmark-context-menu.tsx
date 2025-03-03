interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
}

export function BookmarkContextMenu({ position, onDelete }: BookmarkContextMenuProps) {
	return (
		<div
			className="absolute p-2 backdrop-blur-md bg-black/30 border border-white/20 shadow-lg min-w-[150px] rounded-lg"
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the menu
		>
			<button
				onClick={onDelete}
				className="w-full px-2 py-1.5 text-center text-red-400 hover:text-red-300 rounded-md transition-colors duration-200 hover:bg-white/10"
			>
				حذف
			</button>
		</div>
	)
}

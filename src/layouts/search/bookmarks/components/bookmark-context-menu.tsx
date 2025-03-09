interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
	theme: string
}

export function BookmarkContextMenu({
	position,
	onDelete,
	theme,
}: BookmarkContextMenuProps) {
	const getContextMenuStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white shadow-xl border border-gray-300/40 shadow-lg'
			default: // glass
				return 'bg-black/30 backdrop-blur-md border border-white/20 shadow-lg'
		}
	}

	// Get theme-specific styles for delete button
	const getDeleteButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-red-600 hover:text-red-700 hover:bg-red-50/80'
			case 'dark':
				return 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
			default: // glass
				return 'text-red-400 hover:text-red-300 hover:bg-white/10'
		}
	}

	return (
		<div
			className={`absolute p-2 min-w-[150px] rounded-lg ${getContextMenuStyle()}`}
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()}
		>
			<button
				onClick={onDelete}
				className={`w-full px-2 py-1.5 text-center rounded-md transition-colors duration-200 ${getDeleteButtonStyle()}`}
			>
				حذف
			</button>
		</div>
	)
}

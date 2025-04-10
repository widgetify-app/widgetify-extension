interface BookmarkContextMenuProps {
	position: { x: number; y: number }
	onDelete: () => void
	onOpenInNewTab?: () => void
	isFolder?: boolean
	theme: string
}

export function BookmarkContextMenu({
	position,
	onDelete,
	onOpenInNewTab,

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

	const getMenuItemStyle = (isDelete = false) => {
		if (isDelete) {
			switch (theme) {
				case 'light':
					return 'text-red-600 hover:text-red-700 hover:bg-red-50/80'
				case 'dark':
					return 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
				default: // glass
					return 'text-red-400 hover:text-red-300 hover:bg-white/10'
			}
		}

		switch (theme) {
			case 'light':
				return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50/80'
			case 'dark':
				return 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
			default: // glass
				return 'text-blue-400 hover:text-blue-300 hover:bg-white/10'
		}
	}

	return (
		<div
			className={`absolute p-2 min-w-[150px] rounded-lg ${getContextMenuStyle()}`}
			style={{ top: position.y, left: position.x, zIndex: 1000 }}
			onClick={(e) => e.stopPropagation()}
		>
			{onOpenInNewTab && (
				<button
					onClick={onOpenInNewTab}
					className={`w-full px-2 py-1.5 cursor-pointer text-center rounded-md transition-colors duration-200 ${getMenuItemStyle()}`}
				>
					باز کردن در تب جدید
				</button>
			)}

			<button
				onClick={onDelete}
				className={`w-full px-2 cursor-pointer py-1.5 text-center rounded-md transition-colors duration-200 ${getMenuItemStyle(true)}`}
			>
				حذف
			</button>
		</div>
	)
}

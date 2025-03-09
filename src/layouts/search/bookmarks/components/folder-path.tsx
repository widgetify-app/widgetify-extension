import type { FolderPathItem } from '../types/bookmark.types'

type FolderPathProps = {
	folderPath: FolderPathItem[]
	onBackClick: () => void
	theme?: string
}

export function FolderPath({
	folderPath,
	onBackClick,
	theme = 'glass',
}: FolderPathProps) {
	if (folderPath.length === 0) return null

	const getPathStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white/80 text-gray-700'
			case 'dark':
				return 'bg-gray-800/90 text-gray-300'
			default:
				return 'bg-neutral-900/60 backdrop-blur-sm text-gray-300'
		}
	}

	const getPathItemStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-600'
			case 'dark':
				return 'text-blue-400'
			default:
				return 'text-blue-400'
		}
	}

	return (
		<div
			className={`flex items-center px-2 py-1 mt-2 text-xs rounded-lg ${getPathStyle()}`}
		>
			<button onClick={onBackClick} className="p-1 ml-1">
				⬅️
			</button>
			<div className="flex items-center">
				{folderPath.map((item, index) => (
					<span key={item.id} className="flex items-center">
						{index > 0 && <span className="mx-1">›</span>}
						<span className={getPathItemStyle()}>{item.title}</span>
					</span>
				))}
			</div>
		</div>
	)
}

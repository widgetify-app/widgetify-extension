import type { FolderPathItem } from '../types/bookmark.types'

type FolderPathProps = {
	folderPath: FolderPathItem[]
	onNavigate: (folderId: string | null, depth: number) => void
	theme?: string
}

export function FolderPath({ folderPath, onNavigate, theme = 'glass' }: FolderPathProps) {
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
				return 'text-blue-600 hover:text-blue-800'
			case 'dark':
				return 'text-blue-400 hover:text-blue-300'
			default:
				return 'text-blue-400 hover:text-blue-300'
		}
	}

	const getRootStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 hover:text-gray-800'
			case 'dark':
				return 'text-gray-400 hover:text-gray-200'
			default:
				return 'text-gray-400 hover:text-gray-200'
		}
	}

	return (
		<nav
			aria-label="Folder navigation"
			className={`flex items-center px-3 py-2 mt-2 text-xs rounded-lg ${getPathStyle()}`}
		>
			<ol className="flex flex-wrap items-center gap-y-1">
				<li>
					<button
						onClick={() => onNavigate(null, -1)}
						className={`flex items-center cursor-pointer transition-colors ${getRootStyle()}`}
						aria-label="Go to root folder"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
					</button>
				</li>

				{folderPath.map((item, index) => (
					<li key={item.id} className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-3 h-3 mx-1 opacity-70"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
						<button
							onClick={() => onNavigate(item.id, index)}
							className={`cursor-pointer transition-colors ${getPathItemStyle()}`}
							aria-label={`Go to ${item.title} folder`}
						>
							{item.title}
						</button>
					</li>
				))}
			</ol>
		</nav>
	)
}

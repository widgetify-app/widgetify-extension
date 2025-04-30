import { getCardBackground, getTextColor } from '@/context/theme.context'
import type { FolderPathItem } from '../types/bookmark.types'

type FolderPathProps = {
	folderPath: FolderPathItem[]
	onNavigate: (folderId: string | null, depth: number) => void
	theme?: string
}

export function FolderPath({ folderPath, onNavigate, theme = 'glass' }: FolderPathProps) {
	if (folderPath.length === 0) return null

	return (
		<nav
			aria-label="Folder navigation"
			className={`flex items-center px-3 py-2 mt-2 text-xs rounded-lg ${getCardBackground(theme)}`}
		>
			<ol className="flex flex-wrap items-center gap-y-1">
				<li>
					<button
						onClick={() => onNavigate(null, -1)}
						className={`flex items-center cursor-pointer transition-colors ${getTextColor(theme)} opacity-70 hover:opacity-100`}
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
							className={
								'cursor-pointer transition-colors text-blue-400 hover:text-blue-300'
							}
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

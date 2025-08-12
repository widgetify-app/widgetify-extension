import type { FolderPathItem } from '../types/bookmark.types'

type FolderPathProps = {
	folderPath: FolderPathItem[]
	onNavigate: (folderId: string | null, depth: number) => void
}

export function FolderPath({ folderPath, onNavigate }: FolderPathProps) {
	if (folderPath.length === 0) return null

	return (
		<nav
			aria-label="Folder navigation"
			className={
				'flex w-fit items-center px-4 py-2 text-xs rounded-full bg-widget bg-glass'
			}
		>
			<ol className="flex flex-wrap items-center gap-y-1">
				<li>
					<button
						onClick={() => onNavigate(null, -1)}
						className={
							'cursor-pointer transition-colors text-content opacity-70 hover:opacity-100'
						}
						aria-label="Go to root folder"
					>
						بازگشت
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

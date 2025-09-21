import type { FolderPathItem } from '../types/bookmark.types'
import { TbHomeRibbon } from 'react-icons/tb'

type FolderPathProps = {
	folderPath: FolderPathItem[]
	onNavigate: (folderId: string | null, depth: number) => void
	currentFolderId?: FolderPathItem["id"] | null
};

export function FolderPath({
	folderPath,
	onNavigate,
	currentFolderId = null,
}: FolderPathProps) {
	if (folderPath.length === 0) return null

	return (
		<nav
			aria-label="Folder navigation"
			className={
				"flex w-fit items-center px-4 py-2 text-xs leading-3 rounded-xl bg-widget bg-glass"
			}
		>
			<ol className="flex flex-wrap items-center gap-y-1">
				<li className="leading-0">
					<button
						onClick={() => onNavigate(null, -1)}
						className={
							"cursor-pointer transition-colors text-content opacity-70 hover:opacity-100"
						}
						aria-label="Go to root folder"
					>
						<TbHomeRibbon className="size-4 text-muted" />
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
								d="M16 5L9 12L16 19"
							/>
						</svg>

						{item.id === currentFolderId ? (
							<span
								className="cursor-default transition-colors text-content font-bold"
								aria-label={`Current folder (${item.title})`}
							>
								{item.title}
							</span>
						) : (
							<button
								onClick={() => onNavigate(item.id, index)}
								className={
									"cursor-pointer transition-colors opacity-70 hover:opacity-100"
								}
								aria-label={`Go to ${item.title} folder`}
							>
								{item.title}
							</button>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}

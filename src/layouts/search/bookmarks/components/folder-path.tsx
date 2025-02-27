import { FaArrowLeft } from 'react-icons/fa6'
import type { FolderPathItem } from '../types/bookmark.types'

interface FolderPathProps {
	folderPath: FolderPathItem[]
	onBackClick: () => void
}

export function FolderPath({ folderPath, onBackClick }: FolderPathProps) {
	// Don't render anything if we're at the root level
	if (folderPath.length === 0) return null

	return (
		<div className="flex items-center justify-between w-full mt-4 mb-2">
			<button
				onClick={onBackClick}
				className="flex items-center gap-2 px-3 py-2 font-medium text-blue-400 transition-all duration-300 rounded-lg hover:bg-blue-500/10 hover:text-blue-300 active:scale-95"
			>
				<FaArrowLeft />
				<span>بازگشت</span>
			</button>

			<div className="flex items-center overflow-x-auto max-w-[60%] scrollbar-hide">
				<div className="flex items-center gap-1 px-3 py-1.5 text-sm bg-neutral-800/50 rounded-lg text-gray-300">
					{folderPath.map((folder, index) => (
						<span key={folder.id} className="whitespace-nowrap">
							{index > 0 && <span className="mx-1 text-gray-500">/</span>}
							<span
								className={
									index === folderPath.length - 1 ? 'font-medium text-blue-400' : ''
								}
							>
								{folder.title}
							</span>
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

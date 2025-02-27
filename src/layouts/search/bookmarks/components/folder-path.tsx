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
				className="flex items-center gap-2 px-3 py-2 font-medium transition-all duration-300 border rounded-lg text-white/80 bg-white/10 backdrop-blur-sm border-white/10 hover:bg-indigo-500/20 hover:text-white hover:border-indigo-400/30 active:scale-95"
			>
				<FaArrowLeft />
				<span>بازگشت</span>
			</button>

			<div className="flex items-center overflow-x-auto max-w-[60%] scrollbar-hide">
				<div
					className="flex items-center gap-1 px-3 py-1.5 text-sm 
                bg-white/8 backdrop-filter backdrop-blur-md border border-white/15 rounded-lg 
                text-gray-300 shadow-sm transition-all duration-300"
				>
					{folderPath.map((folder, index) => (
						<span key={folder.id} className="whitespace-nowrap">
							{index > 0 && <span className="mx-1 text-indigo-200/40">/</span>}
							<span
								className={
									index === folderPath.length - 1
										? 'font-medium text-indigo-200'
										: 'text-gray-300/80 hover:text-white transition-colors'
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

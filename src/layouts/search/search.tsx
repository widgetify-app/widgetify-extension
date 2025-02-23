import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { BsTools } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaPlus } from 'react-icons/fa6'
import { AddBookmarkModal } from './add-bookmark.modal'
interface Bookmark {
	title: string
	url: string
	icon: string
}
export function SearchLayout() {
	const GOOGLE_URL = 'https://www.google.com/search?q='
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([
		{
			title: 'یوتیوب',
			url: 'https://youtube.com',
			icon: 'https://www.youtube.com/favicon.ico',
		},
		{
			title: 'گیت هاب',
			url: 'https://github.com',
			icon: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
		},
		{
			title: 'Stack Overflow',
			url: 'https://stackoverflow.com',
			icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
		},
	])
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const contextMenuRef = useRef<HTMLDivElement>(null)
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = (e.target as HTMLFormElement).search.value
		if (query.trim()) {
			window.open(GOOGLE_URL + encodeURIComponent(query))
		}
	}

	return (
		<>
			<div className="flex flex-col items-center justify-center text-white" dir="rtl">
				<form className="w-full" onSubmit={handleSubmit}>
					<div className="relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm bg-neutral-900/70 rounded-2xl hover:bg-neutral-800/80 group">
						<input
							type="text"
							name="search"
							className="w-full py-4 pl-16 pr-6 text-lg text-right text-gray-200 placeholder-gray-400 transition-all duration-300 bg-transparent focus:outline-none"
							placeholder="جستجو در گوگل..."
						/>
						<button
							type="submit"
							className="absolute p-2 text-blue-400 transition-all duration-300 -translate-y-1/2 rounded-lg left-3 top-1/2 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300"
						>
							<CiSearch size={20} />
						</button>
						<div className="absolute inset-0 transition-all duration-300 border pointer-events-none border-white/10 rounded-2xl group-hover:border-white/20" />
					</div>
				</form>
				<div className="flex flex-row w-full gap-1 mt-3">
					{[...bookmarks, ...Array(Math.max(0, 5 - bookmarks.length))].map(
						(bookmark, i) =>
							bookmark ? (
								<OptionButton
									key={i}
									onClick={() => window.open(bookmark.url)}
									title={bookmark.title}
									icon={
										<motion.img
											initial={{ scale: 0.9 }}
											animate={{ scale: 1 }}
											src={bookmark.icon}
											className="transition-transform duration-300 group-hover:scale-110"
										/>
									}
								/>
							) : (
								<OptionButton
									key={i}
									onClick={() => setShowAddBookmarkModal(true)}
									title="افزودن"
									icon={<FaPlus />}
								/>
							),
					)}
				</div>
			</div>
			<AddBookmarkModal
				isOpen={showAddBookmarkModal}
				onClose={() => setShowAddBookmarkModal(false)}
				onAdd={(newBookmark: Bookmark) => setBookmarks((prev) => [...prev, newBookmark])}
			/>
		</>
	)
}

type OptionButtonProps = {
	onClick: () => void
	title: string
	icon: React.ReactNode
}
function OptionButton({ icon, onClick, title }: OptionButtonProps) {
	return (
		<button
			onClick={onClick}
			className="relative flex flex-col items-center justify-center flex-1 p-4 overflow-hidden transition-all duration-300 border cursor-pointer group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20"
		>
			<div className="relative flex items-center justify-center w-8 h-8 mb-2">{icon}</div>
			<span className="text-[10px] w-full text-center font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
				{title}
			</span>
			<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent" />
		</button>
	)
}
// className =
// 	'object-contain w-full h-full transition-transform duration-300 group-hover:scale-110'
// //

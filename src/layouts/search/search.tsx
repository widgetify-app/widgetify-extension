import { Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { BsTools } from 'react-icons/bs'
import { CiSearch } from 'react-icons/ci'
import { FaPlus, FaTrash } from 'react-icons/fa6'
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
			icon: 'https://github.com/favicon.ico',
		},
		{
			title: 'گوگل',
			url: 'https://google.com',
			icon: 'https://www.google.com/favicon.ico',
		},
		{
			title: 'استک اورفلو',
			url: 'https://stackoverflow.com',
			icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
		},
		{
			title: 'توییتر',
			url: 'https://twitter.com',
			icon: 'https://twitter.com/favicon.ico',
		},
		{
			title: 'لینکدین',
			url: 'https://linkedin.com',
			icon: 'https://www.linkedin.com/favicon.ico',
		},
		{
			title: 'دیجی‌کالا',
			url: 'https://www.digikala.com/',
			icon: 'https://www.digikala.com/favicon.ico',
		},
		{
			title: 'ردیت',
			url: 'https://reddit.com',
			icon: 'https://www.reddit.com/favicon.ico',
		},
		{
			title: 'دیوار',
			url: 'https://divar.ir/s/tehran',
			icon: 'https://divar.ir/favicon.ico',
		},
	])
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = (e.target as HTMLFormElement).search.value
		if (query.trim()) {
			window.location.href = GOOGLE_URL + encodeURIComponent(query)
		}
	}

	const handleDeleteBookmark = () => {
		if (selectedBookmark) {
			setBookmarks((prev) => prev.filter((b) => b.url !== selectedBookmark.url))
			setSelectedBookmark(null)
		}
	}

	const handleRightClick = (e: React.MouseEvent, bookmark: Bookmark) => {
		e.preventDefault()
		setSelectedBookmark(bookmark)
		setContextMenuPos({ x: e.clientX, y: e.clientY })
	}

	// when click on the document, close the context menu
	window.addEventListener('click', () => setSelectedBookmark(null))

	const displayedBookmarks = bookmarks.slice(0, 10)

	return (
		<>
			<div className="flex flex-col items-center justify-center text-white max-h-80">
				<form className="w-full" onSubmit={handleSubmit}>
					<div className="relative overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm bg-neutral-900/70 rounded-2xl hover:bg-neutral-800/80 group">
						<input
							type="text"
							name="search"
							className="w-full py-4 pl-16 pr-6 text-lg font-light text-right text-gray-200 transition-all duration-300 bg-transparent placeholder-gray-400/70 focus:outline-none"
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

				<div className="flex flex-row flex-wrap justify-center w-full gap-1 mt-3">
					{[
						...displayedBookmarks,
						...Array(Math.max(0, 10 - displayedBookmarks.length)),
					].map((bookmark, i) =>
						bookmark ? (
							<Menu key={i} open={selectedBookmark?.url === bookmark.url}>
								<MenuHandler>
									<div onContextMenu={(e) => handleRightClick(e, bookmark)}>
										<OptionButton
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
									</div>
								</MenuHandler>

								<MenuList
									className="bg-neutral-800 border-white/10 p-1  min-w-[150px]"
									style={{
										position: 'fixed',
										left: contextMenuPos.x,
										top: contextMenuPos.y,
									}}
								>
									<MenuItem
										className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 font-[Vazir]"
										onClick={handleDeleteBookmark}
									>
										<FaTrash />
										حذف
									</MenuItem>
								</MenuList>
							</Menu>
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
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.button
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			whileHover={{ scale: 1.02 }}
			className="relative flex flex-col items-center justify-center flex-1 p-4 transition-all duration-300 border cursor-pointer group bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 rounded-xl border-white/10 hover:border-white/20 min-w-[5.4rem] max-w-[5.4rem]"
		>
			<div className="relative flex items-center justify-center w-8 h-8 mb-2">{icon}</div>
			<span className="text-[10px] w-full text-center font-medium text-gray-400 transition-colors duration-300 group-hover:text-white truncate">
				{title}
			</span>

			{isHovered && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 0.9, y: 0 }}
					className="absolute z-50 px-2 py-1 text-sm text-white transition-all duration-200 -translate-y-full rounded-lg bg-neutral-900/70 -top-2"
				>
					{title}
				</motion.div>
			)}

			<div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-white/5 to-transparent" />
		</motion.button>
	)
}

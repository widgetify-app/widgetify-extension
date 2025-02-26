import { Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa6'
import { StoreKey } from '../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../common/storage'
import { type LocalBookmark, useBookmarkStore } from '../../../context/bookmark.context'
import { useGetBookmarks } from '../../../services/getMethodHooks/getBookmarks.hook'
import { AddBookmarkModal } from './add-bookmark.modal'
import { BookmarkItem } from './bookmark-item'
import type { Bookmark } from './bookmark.interface'
export function BookmarksComponent() {
	const { bookmarks, setBookmarks } = useBookmarkStore()
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

	const { data: fetchedBookmarks } = useGetBookmarks()

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const handleDeleteBookmark = async () => {
		if (!selectedBookmark) return

		const bookmarkIndex = bookmarks.findIndex(
			(bookmark) => !bookmark.pinned && bookmark.id === selectedBookmark.id,
		)

		if (bookmarkIndex !== -1) {
			const bookmark = bookmarks[bookmarkIndex]

			if (!bookmark.isLocal) {
				const deletedBookmarks =
					(await getFromStorage<string[]>(StoreKey.DeletedBookmarks)) || []

				deletedBookmarks.push(bookmark.id)
				await setToStorage(StoreKey.DeletedBookmarks, deletedBookmarks)
			}

			const newBookmarks = [...bookmarks]
			newBookmarks.splice(bookmarkIndex, 1)
			setBookmarks(newBookmarks)

			setSelectedBookmark(null)
		}
	}

	const handleRightClick = (e: React.MouseEvent, bookmark: Bookmark) => {
		e.preventDefault()
		if (!bookmark.pinned) {
			setSelectedBookmark(bookmark)
			setContextMenuPos({ x: e.clientX, y: e.clientY })
		}
	}

	const onAddBookmark = (bookmark: LocalBookmark) => {
		setBookmarks([...bookmarks, bookmark])
	}

	const displayedBookmarks = bookmarks
		.slice(0, 10)
		.concat(new Array(Math.max(0, 10 - bookmarks.length)).fill(null))

	useEffect(() => {
		if (Array.isArray(fetchedBookmarks)) {
			for (const bookmark of fetchedBookmarks) {
				const index = bookmarks.findIndex((b) => b.id === bookmark.id)
				if (index === -1) {
					bookmarks.unshift({
						...bookmark,
						isLocal: false,
					})

					setBookmarks([...bookmarks])
				}
			}
		}
	}, [fetchedBookmarks])

	return (
		<>
			<div className="flex flex-row flex-wrap justify-center w-full gap-1 mt-3">
				{displayedBookmarks.map((bookmark, i) =>
					bookmark ? (
						bookmark.pinned ? (
							<BookmarkItem
								key={bookmark.id}
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
							<Menu key={i} open={selectedBookmark?.url === bookmark.url}>
								<MenuHandler>
									<div onContextMenu={(e) => handleRightClick(e, bookmark)}>
										<BookmarkItem
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
									className="bg-neutral-800 border-white/10 p-1 min-w-[150px]"
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
						)
					) : (
						<BookmarkItem
							key={i}
							onClick={() => setShowAddBookmarkModal(true)}
							title="افزودن"
							icon={<FaPlus />}
						/>
					),
				)}
			</div>

			<AddBookmarkModal
				isOpen={showAddBookmarkModal}
				onClose={() => setShowAddBookmarkModal(false)}
				onAdd={onAddBookmark}
			/>
		</>
	)
}

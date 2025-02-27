import React, { createContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'
import type { Bookmark } from '../layouts/search/bookmarks/types/bookmark.types'

export interface BookmarkStoreContext {
	bookmarks: Bookmark[]
	setBookmarks: (bookmarks: Bookmark[]) => void
	getCurrentFolderItems: (parentId: string | null) => Bookmark[]
	addBookmark: (bookmark: Bookmark) => void
	deleteBookmark: (id: string) => void
}

const bookmarkContext = createContext<BookmarkStoreContext>({
	bookmarks: [],
	setBookmarks: () => {},
	getCurrentFolderItems: () => [],
	addBookmark: () => {},
	deleteBookmark: () => {},
})

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

	useEffect(() => {
		const loadBookmarks = async () => {
			try {
				const storedBookmarks = await getFromStorage<Bookmark[]>(StoreKey.Bookmarks)
				if (Array.isArray(storedBookmarks)) {
					setBookmarks(storedBookmarks)
				}
			} catch (error) {
				console.error('Error loading bookmarks:', error)
			}
		}
		loadBookmarks()
	}, [])

	useEffect(() => {
		const saveBookmarks = async () => {
			try {
				const localBookmarks = bookmarks.filter((b) => b.isLocal)
				await setToStorage(StoreKey.Bookmarks, localBookmarks)
			} catch (error) {
				console.error('Error saving bookmarks:', error)
			}
		}

		const hasLocalBookmarks = bookmarks.some((b) => b.isLocal)
		if (hasLocalBookmarks) {
			saveBookmarks()
		}
	}, [bookmarks])

	const getCurrentFolderItems = (parentId: string | null) => {
		const pinnedBookmarks = bookmarks.filter((bookmark) => bookmark.pinned)
		const currentFolderBookmarks = bookmarks.filter(
			(bookmark) => bookmark.parentId === parentId && !bookmark.pinned,
		)

		return parentId === null
			? [...pinnedBookmarks, ...currentFolderBookmarks]
			: currentFolderBookmarks
	}

	const addBookmark = async (bookmark: Bookmark) => {
		try {
			const newBookmark = { ...bookmark, isLocal: true }
			const updatedBookmarks = [...bookmarks, newBookmark]
			setBookmarks(updatedBookmarks)

			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage(StoreKey.Bookmarks, localBookmarks)
		} catch (error) {
			console.error('Error adding bookmark:', error)
		}
	}

	const getNestedItems = (parentId: string): string[] => {
		const result: string[] = []
		const children = bookmarks.filter((b) => b.parentId === parentId)

		for (const child of children) {
			result.push(child.id)

			if (child.type === 'FOLDER') {
				const nestedItems = getNestedItems(child.id)
				for (const nestedItem of nestedItems) {
					result.push(nestedItem)
				}
			}
		}

		return result
	}

	const deleteBookmark = async (id: string) => {
		const bookmarkToDelete = bookmarks.find((b) => b.id === id)
		if (!bookmarkToDelete) return

		try {
			let itemsToDelete = [id]

			if (bookmarkToDelete.type === 'FOLDER') {
				itemsToDelete = [...itemsToDelete, ...getNestedItems(id)]
			}

			const updatedBookmarks = bookmarks.filter((b) => !itemsToDelete.includes(b.id))
			setBookmarks(updatedBookmarks)

			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage(StoreKey.Bookmarks, localBookmarks)
		} catch (error) {
			console.error('Error deleting bookmark:', error)
		}
	}

	return (
		<bookmarkContext.Provider
			value={{
				bookmarks,
				setBookmarks,
				getCurrentFolderItems,
				addBookmark,
				deleteBookmark,
			}}
		>
			{children}
		</bookmarkContext.Provider>
	)
}

export function useBookmarkStore(): BookmarkStoreContext {
	const context = React.useContext(bookmarkContext)
	if (!context) {
		throw new Error('useBookmarkStore must be used within a BookmarkProvider')
	}
	return context
}

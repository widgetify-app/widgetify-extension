import React, { createContext, useEffect, useState } from 'react'
import { StoreKey } from '../common/constant/store.key'
import { getFromStorage, setToStorage } from '../common/storage'

export interface LocalBookmark {
	id: string
	title: string
	url: string
	icon: string
	isLocal: boolean
	pinned: boolean
}

export interface BookmarkStoreContext {
	bookmarks: LocalBookmark[]
	setBookmarks: (bookmarks: LocalBookmark[]) => void
}

export const bookmarkContext = createContext<BookmarkStoreContext>({
	bookmarks: [],
	setBookmarks: () => {},
})

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bookmarks, setBookmarks] = useState<LocalBookmark[] | null>(null)

	useEffect(() => {
		async function load() {
			const storedBookmarks = await getFromStorage<LocalBookmark[]>(StoreKey.Bookmarks)

			setBookmarks(storedBookmarks ?? [])
		}

		load()
	}, [])

	useEffect(() => {
		async function save() {
			if (Array.isArray(bookmarks)) {
				const localBookMarks = bookmarks.filter((bookmark) => bookmark.isLocal)
				await setToStorage(StoreKey.Bookmarks, localBookMarks)
			}
		}
		save()
	}, [bookmarks])

	return (
		<bookmarkContext.Provider
			value={{
				bookmarks: bookmarks ?? [],
				setBookmarks,
			}}
		>
			{children}
		</bookmarkContext.Provider>
	)
}

export function useBookmarkStore(): BookmarkStoreContext {
	const context = React.useContext(bookmarkContext)
	if (!context) {
		throw new Error('useStore must be used within a StoreProvider')
	}

	return context
}

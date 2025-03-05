import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { getFromStorage, setToStorage } from '../common/storage'
import type { Bookmark } from '../layouts/search/bookmarks/types/bookmark.types'

const MAX_BOOKMARK_SIZE = 1024 * 1024

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
			const storedBookmarks = await getFromStorage('bookmarks')
			if (Array.isArray(storedBookmarks)) {
				setBookmarks(storedBookmarks)
			}
		}
		loadBookmarks()
	}, [])

	useEffect(() => {
		const saveBookmarks = async () => {
			const localBookmarks = bookmarks.filter((b) => b.isLocal)
			await setToStorage('bookmarks', localBookmarks)
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

	const getBookmarkDataSize = (bookmark: Bookmark): number => {
		try {
			const json = JSON.stringify(bookmark)
			return new Blob([json]).size
		} catch (e) {
			return Number.POSITIVE_INFINITY
		}
	}

	const compressImageData = (imageData: string): string => {
		if (!imageData.startsWith('data:image')) {
			return imageData
		}

		const base64 = imageData.split(',')[1]
		const binaryString = window.atob(base64)
		const length = binaryString.length

		if (length > 2 * 1024 * 1024) {
			throw new Error('Image is too large to process')
		}

		const img = new Image()
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const maxDimension = 48

		canvas.width = maxDimension
		canvas.height = maxDimension
		img.src = imageData

		try {
			ctx?.drawImage(img, 0, 0, maxDimension, maxDimension)
			return canvas.toDataURL('image/webp', 0.6)
		} catch (e) {
			return imageData.substring(0, 50000)
		}
	}

	const prepareBookmarkForStorage = (bookmark: Bookmark): Bookmark => {
		const processedBookmark = { ...bookmark, isLocal: true }

		if (processedBookmark.customImage && processedBookmark.customImage.length > 50000) {
			try {
				processedBookmark.customImage = compressImageData(processedBookmark.customImage)
			} catch (err) {
				toast.error('خطا در پردازش تصویر. از تصویر پیش‌فرض استفاده می‌شود.')

				if (processedBookmark.type === 'BOOKMARK') {
					processedBookmark.customImage = undefined
				}
			}
		}

		return processedBookmark
	}

	const addBookmark = async (bookmark: Bookmark) => {
		try {
			const bookmarkSize = getBookmarkDataSize(bookmark)
			if (bookmarkSize > MAX_BOOKMARK_SIZE) {
				toast.error('تصویر انتخاب شده خیلی بزرگ است. لطفاً تصویر کوچکتری انتخاب کنید.')
				return
			}

			const newBookmark = prepareBookmarkForStorage(bookmark)
			const updatedBookmarks = [...bookmarks, newBookmark]

			try {
				const testData = JSON.stringify(updatedBookmarks.filter((b) => b.isLocal))
				if (testData.length > 5 * 1024 * 1024) {
					toast.error(
						'حجم بوکمارک‌ها بیش از حد مجاز است. لطفاً برخی بوکمارک‌ها را حذف کنید.',
					)
					return
				}
			} catch (e) {
				toast.error('خطا در ذخیره‌سازی بوکمارک. داده‌ها بیش از حد بزرگ هستند.')
				return
			}

			setBookmarks(updatedBookmarks)
			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage('bookmarks', localBookmarks)
		} catch (error) {
			toast.error('خطا در افزودن بوکمارک')
		}
	}

	const getNestedItems = (parentId: string, visited = new Set<string>()): string[] => {
		visited.add(parentId)
		const result: string[] = []
		const children = bookmarks.filter((b) => b.parentId === parentId)

		for (const child of children) {
			result.push(child.id)

			if (child.type === 'FOLDER' && !visited.has(child.id)) {
				const nestedItems = getNestedItems(child.id, new Set(visited))
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

		let itemsToDelete = [id]

		if (bookmarkToDelete.type === 'FOLDER') {
			const nestedItems = getNestedItems(id)
			itemsToDelete = [...itemsToDelete, ...nestedItems]
		}

		const updatedBookmarks = bookmarks.filter((b) => !itemsToDelete.includes(b.id))
		setBookmarks(updatedBookmarks)

		const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
		await setToStorage('bookmarks', localBookmarks)

		const deletedList = (await getFromStorage('deletedBookmarkIds')) || []
		deletedList.push(...itemsToDelete)
		await setToStorage('deletedBookmarkIds', deletedList)
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

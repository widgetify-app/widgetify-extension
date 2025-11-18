import ms from 'ms'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { safeAwait } from '@/services/api'
import { useRemoveBookmark } from '@/services/hooks/bookmark/remove-bookmark.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from './auth.context'

const MAX_BOOKMARK_SIZE = 1.5 * 1024 * 1024

export interface BookmarkStoreContext {
	bookmarks: Bookmark[]
	setBookmarks: (bookmarks: Bookmark[]) => void
	getCurrentFolderItems: (parentId: string | null) => Bookmark[]
	addBookmark: (bookmark: Bookmark) => void
	editBookmark: (bookmark: Bookmark) => void
	deleteBookmark: (id: string) => void
}

const bookmarkContext = createContext<BookmarkStoreContext>({
	bookmarks: [],
	setBookmarks: () => {},
	getCurrentFolderItems: () => [],
	addBookmark: () => {},
	editBookmark: () => {},
	deleteBookmark: () => {},
})

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null)
	const { isAuthenticated } = useAuth()
	const { mutateAsync } = useRemoveBookmark()

	useEffect(() => {
		const loadBookmarks = async () => {
			const storedBookmarks = await getFromStorage('bookmarks')
			if (Array.isArray(storedBookmarks)) {
				setBookmarks(storedBookmarks)
			}
		}
		loadBookmarks()

		const bookEvent = listenEvent('bookmarksChanged', async (data: Bookmark[]) => {
			if (data) {
				const current = (await getFromStorage('bookmarks')) || []
				const all = [...current, ...data]
				const uniqueBookmarks = all.reduce(
					(acc: Bookmark[], bookmark: Bookmark) => {
						if (!acc.some((b) => b.id === bookmark.id)) {
							acc.push(bookmark)
						} else {
							// update existing bookmark
							const index = acc.findIndex(
								(b) =>
									b.id === bookmark.id ||
									b.onlineId === bookmark.onlineId
							)
							if (index !== -1) {
								acc[index] = {
									...bookmark,
									icon: bookmark.icon,
									customImage:
										acc[index].customImage || bookmark.customImage,
								}
							}
						}
						return acc
					},
					[]
				)

				setBookmarks(uniqueBookmarks)
			}
		})

		return () => {
			bookEvent()
		}
	}, [])

	useEffect(() => {
		const saveBookmarks = async (data: Bookmark[]) => {
			await setToStorage('bookmarks', data)
		}

		if (bookmarks !== null) {
			saveBookmarks(bookmarks)
		}
	}, [bookmarks])

	const getCurrentFolderItems = (parentId: string | null) => {
		if (!bookmarks) return []
		const currentFolderBookmarks = bookmarks.filter(
			(bookmark) => bookmark.parentId === parentId
		)

		const sortedBookmarks = [...currentFolderBookmarks].sort((a, b) => {
			return (a.order || 0) - (b.order || 0)
		})

		return parentId === null ? sortedBookmarks : sortedBookmarks
	}

	const getBookmarkDataSize = (bookmark: Bookmark): number => {
		try {
			if (bookmark.customImage) {
				const base64Data =
					bookmark.customImage.split(',')[1] || bookmark.customImage

				const imageSize = Math.ceil((base64Data.length * 3) / 4)

				const bookmarkWithoutImage = { ...bookmark }
				bookmarkWithoutImage.customImage = undefined
				const jsonSize = new Blob([JSON.stringify(bookmarkWithoutImage)]).size

				return imageSize + jsonSize
			}

			const json = JSON.stringify(bookmark)
			return new Blob([json]).size
		} catch (e) {
			console.error('Error calculating bookmark size:', e)
			return Number.POSITIVE_INFINITY
		}
	}

	const compressImageData = async (imageData: string): Promise<string> => {
		if (!imageData.startsWith('data:image')) {
			return imageData
		}

		if (
			imageData.startsWith('data:image/gif') &&
			imageData.length < MAX_BOOKMARK_SIZE
		) {
			return imageData
		}

		try {
			const base64 = imageData.split(',')[1]
			const binaryString = window.atob(base64)
			const length = binaryString.length

			if (length > 3 * 1024 * 1024) {
				throw new Error('Image is too large to process')
			}

			return new Promise((resolve) => {
				const img = new Image()
				img.onload = () => {
					const canvas = document.createElement('canvas')
					const ctx = canvas.getContext('2d')
					const maxDimension = 128

					let width = img.width
					let height = img.height

					if (width > height) {
						if (width > maxDimension) {
							height = Math.round(height * (maxDimension / width))
							width = maxDimension
						}
					} else {
						if (height > maxDimension) {
							width = Math.round(width * (maxDimension / height))
							height = maxDimension
						}
					}

					canvas.width = width
					canvas.height = height

					ctx?.drawImage(img, 0, 0, width, height)

					const format = imageData.startsWith('data:image/gif')
						? 'image/png'
						: 'image/webp'
					const quality = 0.7

					const compressed = canvas.toDataURL(format, quality)
					resolve(compressed)
				}

				img.onerror = () => {
					console.warn('Image compression failed, using original')
					resolve(imageData)
				}

				img.src = imageData
			})
		} catch (e) {
			console.error('Error in image compression:', e)
			return imageData
		}
	}

	const prepareBookmarkForStorage = async (bookmark: Bookmark): Promise<Bookmark> => {
		const processedBookmark = { ...bookmark, isLocal: true }

		if (
			processedBookmark.customImage &&
			processedBookmark.customImage.length > 50000
		) {
			try {
				processedBookmark.customImage = await compressImageData(
					processedBookmark.customImage
				)
			} catch (err) {
				console.error('Image processing error:', err)
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
			const bookmarkSize =
				(bookmark.customImage?.length || 0) +
				(bookmark.icon?.length || 0) +
				JSON.stringify(bookmark).length

			if (bookmarkSize > MAX_BOOKMARK_SIZE) {
				toast.error(
					`تصویر انتخاب شده (${(bookmarkSize / 1024).toFixed(1)} کیلوبایت) بزرگتر از حداکثر مجاز است.`
				)
				return
			}

			// Calculate the order for the new bookmark
			const currentFolderItems = getCurrentFolderItems(bookmark.parentId)
			const maxOrder = currentFolderItems.reduce(
				(max, item) => Math.max(max, item.order || 0),
				-1
			)

			// Assign the next order value
			const newBookmark = await prepareBookmarkForStorage({
				...bookmark,
				order: maxOrder + 1,
			})

			const updatedBookmarks = [...(bookmarks || []), newBookmark]

			try {
				const testData = JSON.stringify(updatedBookmarks.filter((b) => b.isLocal))
				if (testData.length > 5 * 1024 * 1024) {
					toast.error(
						'حجم بوکمارک‌ها بیش از حد مجاز است. لطفاً برخی بوکمارک‌ها را حذف کنید.'
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

			Analytics.event('add_bookmark', {
				bookmark_type: bookmark.type,
				has_custom_image: !!bookmark.customImage,
				has_custom_background: !!bookmark.customBackground,
				has_custom_text_color: !!bookmark.customTextColor,
				has_custom_sticker: !!bookmark.sticker,
			})

			await new Promise((resolve) => setTimeout(resolve, ms('3s')))

			callEvent('startSync', SyncTarget.BOOKMARKS)
		} catch (error) {
			console.error('Error adding bookmark:', error)
			toast.error('خطا در افزودن بوکمارک')
		}
	}

	const editBookmark = async (bookmark: Bookmark) => {
		try {
			const bookmarkSize = getBookmarkDataSize(bookmark)

			const isGif = bookmark.customImage?.startsWith('data:image/gif')
			const sizeLimit = isGif ? 1.5 * MAX_BOOKMARK_SIZE : MAX_BOOKMARK_SIZE

			if (bookmarkSize > sizeLimit) {
				toast.error(
					`تصویر انتخاب شده (${(bookmarkSize / 1024).toFixed(1)} کیلوبایت) بزرگتر از حداکثر مجاز است.`
				)
				return
			}

			const processedBookmark = await prepareBookmarkForStorage(bookmark)
			const updatedBookmarks =
				bookmarks?.map((b) =>
					b.id === processedBookmark.id ? processedBookmark : b
				) || []

			try {
				const testData = JSON.stringify(updatedBookmarks.filter((b) => b.isLocal))
				if (testData.length > 5 * 1024 * 1024) {
					toast.error(
						'حجم بوکمارک‌ها بیش از حد مجاز است. لطفاً برخی بوکمارک‌ها را حذف کنید.'
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

			Analytics.event('edit_bookmark', {
				bookmark_type: bookmark.type,
				has_custom_image: !!bookmark.customImage,
				has_custom_background: !!bookmark.customBackground,
				has_custom_text_color: !!bookmark.customTextColor,
				has_custom_sticker: !!bookmark.sticker,
			})

			await new Promise((resolve) => setTimeout(resolve, ms('3s')))

			callEvent('startSync', SyncTarget.BOOKMARKS)
		} catch (error) {
			console.error('Error editing bookmark:', error)
			toast.error('خطا در ویرایش بوکمارک')
		}
	}

	const getNestedItems = (parentId: string, visited = new Set<string>()): string[] => {
		if (!bookmarks) return []

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
		if (!bookmarks) return

		const bookmarkToDelete = bookmarks.find((b) => b.id === id || b.onlineId === id)
		if (!bookmarkToDelete) return

		let itemsToDelete = [id]

		if (bookmarkToDelete.type === 'FOLDER') {
			const nestedItems = getNestedItems(id)
			itemsToDelete = [...itemsToDelete, ...nestedItems]
		}

		if (isAuthenticated) {
			const [error, _] = await safeAwait(mutateAsync(id))
			if (error) {
				return toast.error(translateError(error) as string)
			}
		}

		const updatedBookmarks = bookmarks.filter(
			(b) =>
				!itemsToDelete.includes(b.id) && !itemsToDelete.includes(b.onlineId || '')
		)
		setBookmarks(updatedBookmarks)
		const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
		await setToStorage('bookmarks', localBookmarks)

		Analytics.event('delete_bookmark')
	}

	return (
		<bookmarkContext.Provider
			value={{
				bookmarks: bookmarks || [],
				setBookmarks,
				getCurrentFolderItems,
				addBookmark,
				editBookmark,
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

import ms from 'ms'
import { v4 as uuidv4 } from 'uuid'
import React, { createContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { Bookmark, LocalBookmark } from '@/layouts/bookmark/types/bookmark.types'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { safeAwait } from '@/services/api'
import { useRemoveBookmark } from '@/services/hooks/bookmark/remove-bookmark.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { useAddBookmark } from '@/services/hooks/bookmark/add-bookmark.hook'
import type { AxiosError } from 'axios'
import type { BookmarkFormFields } from '../components/modal/add-bookmark.modal'

const MAX_ICON_SIZE = 1 * 1024 * 1024 // 1 MB

export interface BookmarkStoreContext {
	bookmarks: Bookmark[]
	setBookmarks: (bookmarks: Bookmark[]) => void
	getCurrentFolderItems: (parentId: string | null) => Bookmark[]
	addBookmark: (bookmark: BookmarkFormFields, cb: () => void) => Promise<void>
	editBookmark: (bookmark: Bookmark) => void
	deleteBookmark: (id: string) => void
}

const bookmarkContext = createContext<BookmarkStoreContext>({
	bookmarks: [],
	setBookmarks: () => {},
	getCurrentFolderItems: () => [],
	addBookmark: async () => {},
	editBookmark: () => {},
	deleteBookmark: () => {},
})

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null)
	const { isAuthenticated } = useAuth()
	const { mutateAsync: removeBookmarkAsync } = useRemoveBookmark()
	const { mutateAsync: addBookmarkAsync } = useAddBookmark()

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

	const addBookmark = async (inputBookmark: BookmarkFormFields, cb: () => void) => {
		try {
			if (inputBookmark.icon && inputBookmark.icon.size > MAX_ICON_SIZE) {
				toast.error(
					`تصویر انتخاب شده (${(inputBookmark.icon.size / (1024 * 1024)).toFixed(1)} مگابایت) بزرگتر از حداکثر مجاز است.`
				)
				cb()
				return
			}

			// Calculate the order for the new bookmark
			const currentFolderItems = getCurrentFolderItems(inputBookmark.parentId)
			const maxOrder = currentFolderItems.reduce(
				(max, item) => Math.max(max, item.order || 0),
				-1
			)
			if (!inputBookmark.icon) {
				toast.error('آیکون انتخاب نشده است.')
				return
			}
			let createdBookmark: Bookmark | null = null

			if (isAuthenticated) {
				const [err, response] = await safeAwait<AxiosError, Bookmark>(
					addBookmarkAsync({
						order: maxOrder + 1,
						parentId: inputBookmark.parentId,
						title: inputBookmark.title,
						customBackground: inputBookmark.customBackground,
						customTextColor: inputBookmark.customTextColor,
						sticker: inputBookmark.sticker,
						type: inputBookmark.type,
						url: inputBookmark.url,
						icon: inputBookmark.icon || null,
					})
				)
				if (err) {
					const translated: string | Record<string, string> =
						translateError(err)
					const msg =
						typeof translated === 'string'
							? translated
							: `${Object.keys(translated)[0]}: ${Object.values(translated)[0]}`

					toast.error(msg, {
						duration: 5000,
					})
				} else {
					createdBookmark = response
				}
			}

			const newBookmark: LocalBookmark = {
				order: createdBookmark?.order || maxOrder + 1,
				id: createdBookmark?.id || uuidv4(),
				isLocal: createdBookmark ? false : true,
				onlineId: createdBookmark?.id || null,
				parentId: inputBookmark.parentId,
				title: inputBookmark.title,
				customBackground: inputBookmark.customBackground,
				customTextColor: inputBookmark.customTextColor,
				sticker: inputBookmark.sticker,
				type: inputBookmark.type,
				url: inputBookmark.url,
				icon:
					createdBookmark?.icon ||
					(inputBookmark.icon ? await fileToBase64(inputBookmark.icon) : null),
			}
			const updatedBookmarks = [...(bookmarks || []), newBookmark]
			setBookmarks(updatedBookmarks)
			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage('bookmarks', localBookmarks)

			Analytics.event('add_bookmark')
			if (!createdBookmark) {
				await new Promise((resolve) => setTimeout(resolve, ms('3s')))
				callEvent('startSync', SyncTarget.BOOKMARKS)
			}
		} catch (error) {
			console.error('Error adding bookmark:', error)
			toast.error('خطا در افزودن بوکمارک')
		} finally {
			cb()
		}
	}

	const editBookmark = async (bookmark: Bookmark) => {
		// try {
		// 	const bookmarkSize = getBookmarkDataSize(bookmark)
		// 	const isGif = bookmark.customImage?.startsWith('data:image/gif')
		// 	const sizeLimit = isGif ? 1.5 * MAX_ICON_SIZE : MAX_ICON_SIZE
		// 	if (bookmarkSize > sizeLimit) {
		// 		toast.error(
		// 			`تصویر انتخاب شده (${(bookmarkSize / 1024).toFixed(1)} کیلوبایت) بزرگتر از حداکثر مجاز است.`
		// 		)
		// 		return
		// 	}
		// 	const processedBookmark = await prepareBookmarkForStorage(bookmark)
		// 	const updatedBookmarks =
		// 		bookmarks?.map((b) =>
		// 			b.id === processedBookmark.id ? processedBookmark : b
		// 		) || []
		// 	try {
		// 		const testData = JSON.stringify(updatedBookmarks.filter((b) => b.isLocal))
		// 		if (testData.length > 5 * 1024 * 1024) {
		// 			toast.error(
		// 				'حجم بوکمارک‌ها بیش از حد مجاز است. لطفاً برخی بوکمارک‌ها را حذف کنید.'
		// 			)
		// 			return
		// 		}
		// 	} catch {
		// 		toast.error('خطا در ذخیره‌سازی بوکمارک. داده‌ها بیش از حد بزرگ هستند.')
		// 		return
		// 	}
		// 	setBookmarks(updatedBookmarks)
		// 	const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
		// 	await setToStorage('bookmarks', localBookmarks)
		// 	Analytics.event('edit_bookmark', {
		// 		bookmark_type: bookmark.type,
		// 		has_custom_image: !!bookmark.customImage,
		// 		has_custom_background: !!bookmark.customBackground,
		// 		has_custom_text_color: !!bookmark.customTextColor,
		// 		has_custom_sticker: !!bookmark.sticker,
		// 	})
		// 	await new Promise((resolve) => setTimeout(resolve, ms('3s')))
		// 	callEvent('startSync', SyncTarget.BOOKMARKS)
		// } catch (error) {
		// 	console.error('Error editing bookmark:', error)
		// 	toast.error('خطا در ویرایش بوکمارک')
		// }
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
			const [error, _] = await safeAwait(removeBookmarkAsync(id))
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

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result)
			} else {
				reject(new Error('Failed to convert file to base64'))
			}
		}
		reader.onerror = () => {
			reject(new Error('Failed to read file'))
		}
		reader.readAsDataURL(file)
	})
}

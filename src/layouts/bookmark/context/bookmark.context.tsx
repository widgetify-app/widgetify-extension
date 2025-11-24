import { v4 as uuidv4, validate } from 'uuid'
import React, { createContext, useEffect, useState } from 'react'
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
import type { BookmarkCreateFormFields } from '../components/modal/add-bookmark.modal'
import type { BookmarkUpdateFormFields } from '../components/modal/edit-bookmark.modal'
import { useUpdateBookmark } from '@/services/hooks/bookmark/update-bookmark.hook'
import { showToast } from '@/common/toast'

const MAX_ICON_SIZE = 1 * 1024 * 1024 // 1 MB

export interface BookmarkStoreContext {
	bookmarks: Bookmark[]
	setBookmarks: (bookmarks: Bookmark[]) => void
	getCurrentFolderItems: (parentId: string | null) => Bookmark[]
	addBookmark: (bookmark: BookmarkCreateFormFields, cb: () => void) => Promise<void>
	editBookmark: (bookmark: BookmarkUpdateFormFields, cb: () => void) => void
	deleteBookmark: (id: string, cb: () => void) => void
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
	const { mutateAsync: updateBookmarkAsync } = useUpdateBookmark()

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

				const localBookmarks = current.filter(
					(b: Bookmark) => validate(b.id) && !b.onlineId
				)
				const filteredLocalBookmarks = localBookmarks.filter((localB) => {
					return !data.some(
						(b) => b.id === localB.id || b.onlineId === localB.id
					)
				})

				setBookmarks([...data, ...filteredLocalBookmarks])
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
		const parentBookmark = bookmarks.find(
			(b) => b.id === parentId || b.onlineId === parentId
		)

		let currentFolderBookmarks: Bookmark[] = []
		if (parentId) {
			currentFolderBookmarks = bookmarks.filter(
				(bookmark) =>
					(typeof bookmark.parentId === 'string' &&
						bookmark.parentId === parentId) ||
					(typeof bookmark.parentId === 'string' &&
						bookmark.parentId === parentBookmark?.onlineId)
			)
		} else {
			currentFolderBookmarks = bookmarks.filter(
				(bookmark) => bookmark.parentId === null
			)
		}

		const sortedBookmarks = [...currentFolderBookmarks].sort((a, b) => {
			return (a.order || 0) - (b.order || 0)
		})
		return sortedBookmarks
	}

	const addBookmark = async (
		inputBookmark: BookmarkCreateFormFields,
		cb: () => void
	) => {
		if (!isAuthenticated)
			return showToast('برای افزودن بوکمارک باید وارد شوید.', 'error')

		try {
			if (inputBookmark.icon && inputBookmark.icon.size > MAX_ICON_SIZE) {
				showToast(
					`تصویر انتخاب شده (${(inputBookmark.icon.size / (1024 * 1024)).toFixed(1)} مگابایت) بزرگتر از حداکثر مجاز است.`,
					'error'
				)
				cb()
				return
			}

			const currentFolderItems = getCurrentFolderItems(inputBookmark.parentId)
			const maxOrder = currentFolderItems.reduce(
				(max, item) => Math.max(max, item.order || 0),
				-1
			)

			let parentId = inputBookmark.parentId
			if (validate(inputBookmark.parentId)) {
				const parentBookmark = bookmarks?.find(
					(b) =>
						b.id === inputBookmark.parentId ||
						b.onlineId === inputBookmark.parentId
				)
				if (parentBookmark?.onlineId) {
					parentId = parentBookmark.onlineId
				}
			}
			const [err, createdBookmark] = await safeAwait<AxiosError, Bookmark>(
				addBookmarkAsync({
					order: maxOrder + 1,
					parentId: parentId,
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
				const translated: string | Record<string, string> = translateError(err)
				const msg =
					typeof translated === 'string'
						? translated
						: `${Object.keys(translated)[0]}: ${Object.values(translated)[0]}`

				showToast(msg, 'error')
				return
			}

			cb()
			const newBookmark: LocalBookmark = {
				order: createdBookmark.order || maxOrder + 1,
				id: createdBookmark.id,
				isLocal: false,
				onlineId: createdBookmark.id,
				parentId: inputBookmark.parentId,
				title: inputBookmark.title,
				customBackground: inputBookmark.customBackground,
				customTextColor: inputBookmark.customTextColor,
				sticker: inputBookmark.sticker,
				type: inputBookmark.type,
				url: inputBookmark.url,
				icon: createdBookmark.icon,
			}

			const updatedBookmarks = [...(bookmarks || []), newBookmark]
			setBookmarks(updatedBookmarks)
			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage('bookmarks', localBookmarks)
			Analytics.event('add_bookmark')
		} catch (error) {
			console.error('Error adding bookmark:', error)
			showToast('خطا در افزودن بوکمارک', 'error')
		}
	}

	const editBookmark = async (input: BookmarkUpdateFormFields, cb: () => void) => {
		if (!isAuthenticated) return

		if (!input.title?.trim() || !bookmarks) return

		const foundedBookmark = bookmarks.find(
			(b) =>
				b.id === input.id ||
				(typeof b.onlineId === 'string' && b.onlineId === input.onlineId)
		)
		if (!foundedBookmark) return showToast('بوکمارک یافت نشد!', 'error')

		let idForEdit = input.id
		const isValidUuid = validate(idForEdit)
		if (isValidUuid) {
			idForEdit = foundedBookmark.onlineId || foundedBookmark.id
		}

		if (!idForEdit) {
			showToast('شناسه بوکمارک نامعتبر است!', 'error')
			return
		}

		const [error, _] = await safeAwait<AxiosError, Bookmark>(
			updateBookmarkAsync({
				id: idForEdit,
				customBackground: input.customBackground,
				customTextColor: input.customTextColor,
				sticker: input.sticker,
				title: input.title?.trim(),
				icon: input.icon || null,
				url: input.url,
			})
		)

		if (error) {
			const translated: string | Record<string, string> = translateError(error)
			const msg =
				typeof translated === 'string'
					? translated
					: `${Object.keys(translated)[0]}: ${Object.values(translated)[0]}`
			showToast(msg, 'error')
			return
		}

		// input.id can be localId(old bookmarks)
		// const index = bookmarks.findIndex(
		// 	(b) => b.id === foundedBookmark.id || b.onlineId === foundedBookmark.onlineId
		// )
		// if (index !== -1) {
		// 	bookmarks[index] = {
		// 		...foundedBookmark,
		// 		title: input.title?.trim(),
		// 		customBackground: input.customBackground,
		// 		customTextColor: input.customTextColor,
		// 		sticker: input.sticker,
		// 		url:
		// 			foundedBookmark.type === 'BOOKMARK' ? input.url : foundedBookmark.url,
		// 		icon: input.icon ? await fileToBase64(input.icon) : foundedBookmark.icon,
		// 		onlineId: onlineId || foundedBookmark.onlineId,
		// 		id: updatedBookmark ? updatedBookmark.id : foundedBookmark.id,
		// 		isLocal: updatedBookmark ? false : foundedBookmark.isLocal,
		// 	}
		// 	setBookmarks([...bookmarks])

		// 	await setToStorage('bookmarks', bookmarks)
		// 	Analytics.event('edit_bookmark')
		// } else {
		// 	showToast('بوکمارک یافت نشد!', 'error')
		// }

		cb()
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

	const deleteBookmark = async (id: string, cb: () => void) => {
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
				showToast(translateError(error) as string, 'error')
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
		cb()
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

import { validate } from 'uuid'
import React, { createContext, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { Bookmark, BrowserImportNode } from '@/layouts/bookmark/types/bookmark.types'
import { safeAwait } from '@/services/api'
import { useRemoveBookmark } from '@/services/hooks/bookmark/remove-bookmark.hook'
import { translateError } from '@/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { useAddBookmark } from '@/services/hooks/bookmark/add-bookmark.hook'
import { useImportBrowserBookmarks } from '@/services/hooks/bookmark/import-browser-bookmarks.hook'
import type { BulkImportBookmarkNode } from '@/services/hooks/bookmark/import-browser-bookmarks.hook'
import type { AxiosError } from 'axios'
import type { BookmarkCreateFormFields } from '../components/modal/add-bookmark.modal'
import type { BookmarkUpdateFormFields } from '../components/modal/edit-bookmark.modal'
import { useUpdateBookmark } from '@/services/hooks/bookmark/update-bookmark.hook'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import {
	type FetchedBookmark,
	useGetBookmarks,
} from '@/services/hooks/bookmark/getBookmarks.hook'

const MAX_ICON_SIZE = 1 * 1024 * 1024 // 1 MB

export interface BookmarkStoreContext {
	bookmarks: Bookmark[]
	setBookmarks: (bookmarks: Bookmark[]) => void
	getCurrentFolderItems: (parentId: string | null) => Bookmark[]
	addBookmark: (bookmark: BookmarkCreateFormFields, cb: () => void) => Promise<void>
	importBrowserBookmarks: (
		nodes: BrowserImportNode[],
		parentId: string | null
	) => Promise<{ importedCount: number; createdFolders: number } | null>
	editBookmark: (bookmark: BookmarkUpdateFormFields, cb: () => void) => void
	deleteBookmark: (id: string, cb: () => void) => void
	currentFolderId: string | null
	setCurrentFolderId: (id: string | null) => void
}

const bookmarkContext = createContext<BookmarkStoreContext>({
	bookmarks: [],
	setBookmarks: () => {},
	getCurrentFolderItems: () => [],
	addBookmark: async () => {},
	importBrowserBookmarks: async () => null,
	editBookmark: () => {},
	deleteBookmark: () => {},
	currentFolderId: null,
	setCurrentFolderId: () => {},
})

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[] | null>(null)
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
	const { isAuthenticated } = useAuth()
	const { data, refetch, dataUpdatedAt } = useGetBookmarks(null, isAuthenticated)

	const { mutateAsync: removeBookmarkAsync } = useRemoveBookmark()
	const { mutateAsync: addBookmarkAsync } = useAddBookmark()
	const { mutateAsync: importBrowserBookmarksAsync } = useImportBrowserBookmarks()
	const { mutateAsync: updateBookmarkAsync } = useUpdateBookmark()

	useEffect(() => {
		const loadBookmarks = async () => {
			const storedBookmarks = await getFromStorage('bookmarks')
			if (Array.isArray(storedBookmarks)) {
				setBookmarks(storedBookmarks)
			}
		}
		loadBookmarks()

		const bookEvent = listenEvent(
			'bookmarksChanged',
			async (eventData: Bookmark[]) => {
				if (eventData) {
					const current = (await getFromStorage('bookmarks')) || []

					const localBookmarks = current.filter(
						(b: Bookmark) => validate(b.id) && !b.onlineId
					)
					const filteredLocalBookmarks = localBookmarks.filter((localB) => {
						return !eventData.some(
							(b) => b.id === localB.id || b.onlineId === localB.id
						)
					})

					setBookmarks([...eventData, ...filteredLocalBookmarks])
				}
			}
		)

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

	useEffect(() => {
		if (!data || data.length === 0) return

		function mapBookmarks(fetchedBookmarks: FetchedBookmark[]) {
			const mappedFetched: Bookmark[] = fetchedBookmarks.map((bookmark) => ({
				id: bookmark.offlineId || bookmark.id,
				title: bookmark.title,
				type: bookmark.type,
				parentId: bookmark.parentId,
				isLocal: true,
				isManageable: bookmark.isManageable,
				url: bookmark.url,
				icon: bookmark.icon,
				onlineId: bookmark.id,
				sticker: bookmark.sticker ?? null,
				customTextColor: bookmark.customTextColor ?? null,
				customBackground: bookmark.customBackground ?? null,
				order: bookmark.order || 0,
			}))

			return mappedFetched
		}

		const mappedFetched = mapBookmarks(data)

		callEvent('bookmarksChanged', mappedFetched)
	}, [data, dataUpdatedAt])

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
			const [err, _] = await safeAwait<AxiosError, Bookmark>(
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
				autoFormatErrorToast(err)
				return
			}

			cb()
			await refetch()

			Analytics.event('add_bookmark')
		} catch {
			showToast('خطا در افزودن بوکمارک', 'error')
		}
	}

	const importBrowserBookmarks = async (
		nodes: BrowserImportNode[],
		parentId: string | null
	): Promise<{ importedCount: number; createdFolders: number } | null> => {
		if (!isAuthenticated) {
			showToast('برای درون‌ریزی بوکمارک‌ها باید وارد شوید.', 'error')
			return null
		}

		let resolvedParentId = parentId
		if (parentId && validate(parentId)) {
			const parentBookmark = bookmarks?.find(
				(b) => b.id === parentId || b.onlineId === parentId
			)
			if (parentBookmark?.onlineId) {
				resolvedParentId = parentBookmark.onlineId
			}
		}

		if (resolvedParentId && validate(resolvedParentId)) {
			showToast(
				'برای درون‌ریزی در این پوشه، لطفا ابتدا بوکمارک‌های خود را همگام‌سازی کنید.',
				'error',
				{ duration: 8000 }
			)
			return null
		}

		const toApiNode = (node: BrowserImportNode): BulkImportBookmarkNode => ({
			title: node.title,
			type: node.type,
			url: node.type === 'BOOKMARK' ? node.url : null,
			children: node.children?.map(toApiNode),
		})

		const [err, result] = await safeAwait<
			AxiosError,
			{ importedCount: number; createdFolders: number }
		>(
			importBrowserBookmarksAsync({
				parentId: resolvedParentId,
				items: nodes.map(toApiNode),
			})
		)

		if (err || !result) {
			autoFormatErrorToast(err)
			return null
		}

		await refetch()
		Analytics.event('import_browser_bookmarks')

		return result
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

		let bookmarkIdToEdit = input.id
		if (validate(bookmarkIdToEdit)) {
			bookmarkIdToEdit = foundedBookmark.onlineId || foundedBookmark.id
		}

		if (!bookmarkIdToEdit || validate(bookmarkIdToEdit)) {
			showToast(
				'برای ویرایش این بوکمارک، لطفا ابتدا بوکمارک‌های خود را همگام‌سازی کنید.',
				'error',
				{
					duration: 8000, // 8 seconds
				}
			)
			return
		}

		const [error, _] = await safeAwait<AxiosError, Bookmark>(
			updateBookmarkAsync({
				id: bookmarkIdToEdit,
				customBackground: input.customBackground,
				customTextColor: input.customTextColor,
				sticker: input.sticker,
				title: input.title?.trim(),
				icon: input.icon || null,
				url: input.url,
				isDeletedIcon: input.isDeletedIcon,
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

		await refetch()

		cb()
	}

	const deleteBookmark = async (id: string, cb: () => void) => {
		if (!isAuthenticated) return

		if (!bookmarks) return

		const bookmarkToDelete = bookmarks.find((b) => b.id === id || b.onlineId === id)
		if (!bookmarkToDelete) return

		const idToDelete = bookmarkToDelete.onlineId || bookmarkToDelete.id

		if (validate(idToDelete)) {
			showToast(
				'برای حـذف این بوکمارک، لطفا ابتدا بوکمارک‌های خود را همگام‌سازی کنید.',
				'error',
				{
					duration: 8000, // 8 seconds
				}
			)
			return
		}

		const [error, _] = await safeAwait(removeBookmarkAsync(idToDelete))
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}

		await refetch()

		Analytics.event('delete_bookmark')
		cb()
	}

	return (
		<bookmarkContext.Provider
			value={{
				bookmarks: bookmarks || [],
				setBookmarks,
				getCurrentFolderItems,
				addBookmark: addBookmark as any,
				importBrowserBookmarks,
				editBookmark,
				deleteBookmark,
				currentFolderId,
				setCurrentFolderId,
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

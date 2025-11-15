import { useEffect, useRef, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { isSyncActive } from '@/common/sync-checker'
import { callEvent } from '@/common/utils/call-event'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { useAuth } from '@/context/auth.context'
import type { Theme } from '@/context/theme.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type {
	FetchedTodo,
	Todo,
} from '@/layouts/widgets/calendar/interface/todo.interface'
import { getMainClient } from '@/services/api'
import {
	type FetchedBookmark,
	getBookmarks,
} from '@/services/hooks/bookmark/getBookmarks.hook'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'

enum SyncState {
	Syncing = 0,
	Success = 1,
	Error = 2,
}

export enum SyncTarget {
	ALL = 0,
	TODOS = 1,
	BOOKMARKS = 2,
}

export function SyncButton() {
	const [syncState, setSyncState] = useState<SyncState | null>(null)
	const { isAuthenticated } = useAuth()
	const syncInProgressRef = useRef(false)
	const lastSyncTimeRef = useRef<number>(0)
	const initialSyncDoneRef = useRef(false)
	useEffect(() => {
		if (syncState === SyncState.Success) {
			const timer = setTimeout(() => setSyncState(null), 3000)
			return () => clearTimeout(timer)
		}
	}, [syncState])

	useEffect(() => {
		async function initialSync() {
			if (!isAuthenticated || initialSyncDoneRef.current) {
				return
			}

			const isSyncEnabled = await isSyncActive()
			if (!isSyncEnabled) {
				return
			}

			initialSyncDoneRef.current = true

			setTimeout(() => {
				syncData(SyncTarget.ALL, 'GET')
			}, 1000)
		}
		initialSync()
	}, [isAuthenticated])

	const syncData = async (syncTarget: SyncTarget, method: 'POST' | 'GET') => {
		const now = Date.now()
		if (now - lastSyncTimeRef.current < 500) {
			console.info('Sync request ignored due to rapid succession')
			return
		}
		lastSyncTimeRef.current = now

		if (!isAuthenticated) {
			return
		}

		const isSyncEnabled = await isSyncActive()
		if (!isSyncEnabled) {
			return
		}

		if (syncInProgressRef.current) return

		syncInProgressRef.current = true
		setSyncState(SyncState.Syncing)

		try {
			if (syncTarget === SyncTarget.ALL) {
				try {
					await getAll()
					setSyncState(SyncState.Success)
				} catch (error) {
					console.error('Error during sync:', error)
					setSyncState(SyncState.Error)
				}
			}

			if (syncTarget === SyncTarget.TODOS) {
				const isSyncTodoComplete = await SyncTodo(method)

				if (isSyncTodoComplete) {
					setSyncState(SyncState.Success)
				} else {
					setSyncState(SyncState.Error)
				}
			}

			if (syncTarget === SyncTarget.BOOKMARKS) {
				const isSyncBookmarkComplete = await SyncBookmark(method)

				if (isSyncBookmarkComplete) {
					setSyncState(SyncState.Success)
				} else {
					setSyncState(SyncState.Error)
				}
			}
		} finally {
			syncInProgressRef.current = false
		}
	}

	useEffect(() => {
		const handleSyncRequest = (eventData: any) => {
			const target = eventData.detail as SyncTarget
			syncData(target, 'POST')
		}

		if (isAuthenticated) {
			window.addEventListener('startSync', handleSyncRequest)
			return () => {
				window.removeEventListener('startSync', handleSyncRequest)
			}
		}

		return undefined
	}, [isAuthenticated, syncData])

	return <></>
}

async function SyncTodo(method: 'POST' | 'GET'): Promise<boolean> {
	try {
		const mapTodos = (todos: Todo[] = []) => {
			return todos.map((todo) => ({
				text: todo.text,
				category: todo.category,
				date: todo.date,
				description: todo.notes,
				priority: todo.priority,
				completed: todo.completed,
				offlineId: todo.id,
				id: todo.onlineId,
				order: todo.order || 0,
			}))
		}

		const [apiClient, todos, deletedTodos] = await Promise.all([
			getMainClient(),
			getFromStorage('todos'),
			getFromStorage('deletedTodos'),
		])
		let fetchedTodos: FetchedTodo[] = []
		if (method === 'POST') {
			const todosInput = mapTodos(todos || [])
			const deletedTodosInput = mapTodos(deletedTodos || [])

			const response = await apiClient.post<FetchedTodo[]>('/todos/sync', {
				todos: todosInput,
				deletedTodos: deletedTodosInput,
			})

			fetchedTodos = response.data
		} else {
			const response = await apiClient.get<FetchedTodo[]>('/todos/@me')
			fetchedTodos = response.data
		}

		const mapped: Todo[] = mapFetchedTodos(fetchedTodos)

		await setToStorage('deletedTodos', [])

		callEvent('todosChanged', mapped)

		return true
	} catch (error) {
		console.error('Error during sync:', error)
		return false
	}
}

function mapFetchedTodos(fetchedTodos: FetchedTodo[]) {
	return fetchedTodos.map((todo: FetchedTodo) => ({
		id: todo.offlineId || todo.id,
		text: todo.text,
		onlineId: todo.id,
		completed: todo.completed,
		date: todo.date,
		priority: todo.priority,
		category: todo.category,
		notes: todo.description,
		order: todo.order || 0,
	}))
}

async function SyncBookmark(method: 'GET' | 'POST') {
	const mapBookmark = (bookmarks: Bookmark[]) => {
		return bookmarks
			.map((bookmark) => ({
				title: bookmark.title,
				url: 'url' in bookmark ? bookmark.url : undefined,
				parentId: bookmark.parentId,
				offlineId: bookmark.id,
				id: bookmark.onlineId,
				type: bookmark.type,
				sticker: bookmark.sticker,
				customTextColor: bookmark.customTextColor,
				customBackground: bookmark.customBackground,
				order: bookmark.order || 0,
			}))
			.sort((a, b) => {
				const parentCompare = (a.parentId ? 1 : -1) - (b.parentId ? 1 : -1)
				if (parentCompare !== 0) return parentCompare

				return (a.order || 0) - (b.order || 0)
			})
	}

	const [apiClient, bookmarks, deletedBookmarks] = await Promise.all([
		getMainClient(),
		getFromStorage('bookmarks'),
		getFromStorage('deletedBookmarkIds'),
	])

	let fetchedBookmarks: FetchedBookmark[] = []
	if (method === 'GET') {
		fetchedBookmarks = await getBookmarks()
	} else {
		const bookmarksInput = mapBookmark(bookmarks || [])

		const response = await apiClient.post<FetchedBookmark[]>('/bookmarks/sync', {
			bookmarks: bookmarksInput,
			deletedBookmarks: deletedBookmarks || [],
		})

		fetchedBookmarks = response.data
	}

	const mappedFetched: Bookmark[] = mapBookmarks(fetchedBookmarks)

	callEvent('bookmarksChanged', mappedFetched)

	return true
}

async function getAll() {
	const client = await getMainClient()
	const response = await client.get<{
		bookmarks: FetchedBookmark[]
		todos: FetchedTodo[]
		wallpaper: Wallpaper
		theme: Theme | null
		browserTitle: UserInventoryItem
	}>('/extension/@me/sync')

	const { bookmarks, todos, wallpaper, theme, browserTitle } = response.data

	const mappedFetched: Bookmark[] = mapBookmarks(bookmarks)
	callEvent('bookmarksChanged', mappedFetched)

	const mappedTodos: Todo[] = mapFetchedTodos(todos)
	callEvent('todosChanged', mappedTodos)

	const wallpaperStore = await getFromStorage('wallpaper')
	if (
		(wallpaper && wallpaperStore?.id !== wallpaper?.id) ||
		wallpaper.src !== wallpaperStore?.src
	) {
		if (wallpaperStore?.id === 'custom-wallpaper') {
			return
		}

		await setToStorage('wallpaper', {
			...wallpaper,
			isRetouchEnabled: false,
		})
		callEvent('wallpaperChanged', {
			...wallpaper,
			isRetouchEnabled: false,
		})
	}

	const [themeStore, browserTitleStore] = await Promise.all([
		getFromStorage('theme'),
		getFromStorage('browserTitle'),
	])
	if (theme && theme !== themeStore) {
		callEvent('theme_change', theme)
	}

	if (browserTitleStore) {
		if (
			browserTitleStore.id !== browserTitle.id ||
			browserTitleStore.template !== browserTitle.value ||
			browserTitleStore.name !== browserTitle.name
		) {
			document.title = browserTitle.value
			setToStorage('browserTitle', {
				id: browserTitle.id,
				name: browserTitle.name || 'بدون نام',
				template: browserTitle.value,
			})
		}
	} else {
		document.title = browserTitle.value
		setToStorage('browserTitle', {
			id: browserTitle.id,
			name: browserTitle.name || 'بدون نام',
			template: browserTitle.value,
		})
	}
}

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
		sticker: bookmark.sticker,
		customTextColor: bookmark.customTextColor,
		customBackground: bookmark.customBackground,
		order: bookmark.order || 0,
	}))

	return mappedFetched
}

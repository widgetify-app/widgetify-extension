import { useEffect, useRef, useState } from 'react'
import { getFromStorage, getMultipleFromStorage, setToStorage } from '@/common/storage'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import type { StoredWallpaper, Wallpaper } from '@/common/wallpaper.interface'
import { useAuth } from '@/context/auth.context'
import type { Theme } from '@/context/theme.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import { getMainClient } from '@/services/api'
import type { FetchedBookmark } from '@/services/hooks/bookmark/getBookmarks.hook'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'
import { validate } from 'uuid'
import { MdSyncProblem } from 'react-icons/md'
import Tooltip from '@/components/toolTip'
import { SyncAlertModal } from './sync-alert.modal'
import { showToast } from '@/common/toast'
import type { FetchedTodo, Todo } from '@/services/hooks/todo/todo.interface'

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
interface AlertType {
	show: boolean
	type: 'BOOKMARKS' | 'TODOS' | null
}
export function SyncButton() {
	const [showAlert, setShowAlert] = useState<AlertType>({
		show: false,
		type: null,
	})

	const [showModal, setShowModal] = useState(false)
	const [syncState, setSyncState] = useState<SyncState | null>(null)

	const { isAuthenticated } = useAuth()
	const syncInProgressRef = useRef(false)
	const lastSyncTimeRef = useRef<number>(0)
	const initialSyncDoneRef = useRef(false)

	useEffect(() => {
		async function initialSync() {
			if (!isAuthenticated || initialSyncDoneRef.current) {
				return
			}

			initialSyncDoneRef.current = true

			setTimeout(async () => {
				await syncData(SyncTarget.ALL, 'GET')
			}, 1000)
		}

		const handleSyncRequest = (eventData: SyncTarget) => {
			const target = eventData as SyncTarget
			syncData(target, 'POST')
		}

		const event = listenEvent('startSync', handleSyncRequest)
		if (isAuthenticated) {
			checkSyncData().then((alert) => {
				setShowAlert(alert)
			})
		}

		initialSync()
		return () => {
			event()
		}
	}, [isAuthenticated])

	const syncData = async (syncTarget: SyncTarget, method: 'POST' | 'GET') => {
		const now = Date.now()
		if (now - lastSyncTimeRef.current < 500) {
			return
		}
		lastSyncTimeRef.current = now

		if (!isAuthenticated) {
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

	const checkSyncData = async (): Promise<AlertType> => {
		const bookmarksFromStorage = (await getFromStorage('bookmarks')) || []

		const bookmarkNotSynced = bookmarksFromStorage.some(
			(b: Bookmark) =>
				validate(b.id) && (b.onlineId === null || b.onlineId === undefined)
		)
		if (bookmarkNotSynced) {
			return {
				show: true,
				type: 'BOOKMARKS',
			}
		}

		const todosFromStorage = (await getFromStorage('todos')) || []

		const todoNotSynced = todosFromStorage.some(
			(t: Todo) =>
				validate(t.id) && (t.onlineId === null || t.onlineId === undefined)
		)

		if (todoNotSynced) {
			return {
				show: true,
				type: 'TODOS',
			}
		}

		return {
			show: false,
			type: null,
		}
	}

	const onTryAgainClick = async () => {
		setSyncState(SyncState.Syncing)
		if (showAlert.type === 'BOOKMARKS') {
			const result = await SyncBookmark('POST')
			if (result) {
				showToast('بوکمارک‌ها با موفقیت همگام‌سازی شدند.', 'success')
			} else {
				showToast('خطا در همگام‌سازی بوکمارک‌ها.', 'error')
			}

			setSyncState(result ? SyncState.Success : SyncState.Error)
			setShowModal(false)
			setShowAlert({ show: false, type: null })
		}
		if (showAlert.type === 'TODOS') {
			const result = await SyncTodo('POST')
			if (result) {
				showToast('وظایف با موفقیت همگام‌سازی شدند.', 'success', {
					alarmSound: true,
				})
			} else {
				showToast('خطا در همگام‌سازی وظایف.', 'error')
			}

			setSyncState(result ? SyncState.Success : SyncState.Error)
			setShowModal(false)
			setShowAlert({ show: false, type: null })
		}
	}

	if (!showAlert.show || !isAuthenticated) {
		return <></>
	}

	return (
		<>
			<Tooltip content="خطا در همگام‌سازی داده‌ها">
				<div
					className="relative p-2 transition-all cursor-pointer text-white/40 hover:text-white active:scale-90"
					id="profile-and-friends-list"
					onClick={() => setShowModal(true)}
				>
					<span className="absolute z-0 w-4 h-4 duration-200 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-error animate-ping"></span>
					<MdSyncProblem size={24} className="z-10 text-error" />
				</div>
			</Tooltip>

			{showAlert.type && (
				<SyncAlertModal
					isOpen={showModal}
					onClose={() => setShowModal(false)}
					type={showAlert.type}
					isSyncing={syncState === SyncState.Syncing}
					onTryAgainClick={onTryAgainClick}
				/>
			)}
		</>
	)
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

			const mapped: Todo[] = mapFetchedTodos(fetchedTodos)

			await setToStorage('deletedTodos', [])

			callEvent('todosChanged', mapped)
		}

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
	try {
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
					icon: bookmark.icon,
					order: bookmark.order || 0,
				}))
				.sort((a, b) => {
					const parentCompare = (a.parentId ? 1 : -1) - (b.parentId ? 1 : -1)
					if (parentCompare !== 0) return parentCompare

					return (a.order || 0) - (b.order || 0)
				})
		}

		const [apiClient, bookmarks] = await Promise.all([
			getMainClient(),
			getFromStorage('bookmarks'),
			getFromStorage('deletedBookmarkIds'),
		])

		let fetchedBookmarks: FetchedBookmark[] = []
		if (method === 'POST') {
			const offlineBookmarks = bookmarks?.filter(
				(b) => validate(b.id) && (b.onlineId === null || b.onlineId === undefined)
			)

			const bookmarksInput = mapBookmark(offlineBookmarks || [])

			const response = await apiClient.post<FetchedBookmark[]>('/bookmarks/sync', {
				bookmarks: bookmarksInput,
				deletedBookmarks: [],
			})

			fetchedBookmarks = response.data
		}

		const mappedFetched: Bookmark[] = mapBookmarks(fetchedBookmarks)

		callEvent('bookmarksChanged', mappedFetched)

		return true
	} catch {
		return false
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
		sticker: bookmark.sticker ?? null,
		customTextColor: bookmark.customTextColor ?? null,
		customBackground: bookmark.customBackground ?? null,
		order: bookmark.order || 0,
	}))

	return mappedFetched
}

async function getAll() {
	const client = await getMainClient()
	const response = await client.get<{
		wallpaper: Wallpaper
		theme: Theme | null
		browserTitle: UserInventoryItem
		font: string | null
	}>('/extension/@me/sync')

	const { wallpaper, theme, browserTitle, font } = response.data
	const store = await getMultipleFromStorage([
		'wallpaper',
		'theme',
		'browserTitle',
		'appearance',
	])

	await Promise.all([
		processWallpaper(wallpaper, store?.wallpaper),
		processBrowserTitle(browserTitle, store?.browserTitle),
	])

	processFont(font, store?.appearance)
	processTheme(theme, store?.theme)
}

async function processWallpaper(
	wallpaper: Wallpaper,
	wallpaperStore: StoredWallpaper | undefined
) {
	try {
		if (!wallpaper) return
		if (
			(wallpaper && wallpaperStore?.id !== wallpaper?.id) ||
			wallpaper?.src !== wallpaperStore?.src
		) {
			if (wallpaperStore?.id === 'custom-wallpaper') {
				return
			}

			await setToStorage('wallpaper', {
				...wallpaper,
			})
		}
	} catch (er) {
		console.log(er)
	}
}

async function processBrowserTitle(
	browserTitle: UserInventoryItem | null,
	browserTitleStore: { id: string; template: string; name: string } | undefined
) {
	try {
		if (!browserTitle) return
		if (browserTitleStore) {
			if (
				browserTitleStore.id !== browserTitle.id ||
				browserTitleStore.template !== browserTitle.value ||
				browserTitleStore.name !== browserTitle.name
			) {
				document.title = browserTitle.value
				await setToStorage('browserTitle', {
					id: browserTitle.id,
					name: browserTitle.name || 'بدون نام',
					template: browserTitle.value,
				})
			}
		} else {
			document.title = browserTitle.value
			await setToStorage('browserTitle', {
				id: browserTitle.id,
				name: browserTitle.name || 'بدون نام',
				template: browserTitle.value,
			})
		}
	} catch (er) {
		console.log(er)
	}
}

function processTheme(theme: Theme | null, themeStore: Theme | undefined) {
	try {
		if (!theme) return
		if (theme !== themeStore) {
			callEvent('theme_change', theme)
		}
	} catch (er) {
		console.log(er)
	}
}
function processFont(font: string | null, appearanceStore?: Record<string, any>) {
	try {
		if (!font) return
		const fontStore = appearanceStore?.fontFamily as string | undefined
		if (font !== fontStore) {
			callEvent('font_change', font)
		}
	} catch (er) {
		console.log(er)
	}
}

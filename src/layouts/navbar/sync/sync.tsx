import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import type { Wallpaper } from '@/common/wallpaper.interface'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
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
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudSync, AiOutlineSync } from 'react-icons/ai'
import { BiCheck } from 'react-icons/bi'

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
	const [firstAuth, setFirstAuth] = useState<boolean>(false)
	const [syncState, setSyncState] = useState<SyncState | null>(null)
	const { isAuthenticated } = useAuth()
	const [user, setUser] = useState<UserProfile | null>(null)
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
		async function loadUser() {
			const userData = await getFromStorage('profile')
			if (userData) {
				setUser(userData)
			}
		}

		loadUser()
	}, [])

	useEffect(() => {
		async function initialSync() {
			if (!isAuthenticated || initialSyncDoneRef.current) {
				return
			}

			const isSyncEnabled = await getFromStorage('enable_sync')
			if (isSyncEnabled === false) {
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
			setFirstAuth(true)
			return
		}

		const isSyncEnabled = await getFromStorage('enable_sync')

		if (isSyncEnabled === false) {
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

	const tooltipContent = () => {
		if (syncState === SyncState.Syncing) return 'در حال همگام‌سازی...'

		if (syncState === SyncState.Success) return 'همگام‌سازی با موفقیت انجام شد'

		if (syncState === SyncState.Error) return 'خطا در همگام‌سازی'

		return 'همگام‌سازی با حساب کاربری'
	}

	return (
		<>
			<Tooltip delay={0} content={tooltipContent()}>
				<div className="relative group">
					<LazyMotion features={domAnimation}>
						<m.button
							className="flex items-center justify-center w-8 h-8 transition-all border shadow-lg cursor-pointer border-content rounded-xl hover:text-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-content backdrop-blur-sm"
							onClick={() => syncData(SyncTarget.ALL, 'POST')}
							aria-label="Sync"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ type: 'spring', stiffness: 400, damping: 17 }}
						>
							<AnimatePresence mode="wait">
								{user?.avatar && syncState === null && (
									<m.div
										className="absolute flex items-center justify-center w-4 h-4 bg-blue-500 border border-gray-800 rounded-full -bottom-1 -right-1"
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<AiOutlineCloudSync size={10} className="text-muted" />
									</m.div>
								)}

								{syncState === SyncState.Syncing ? (
									<m.div
										className="flex items-center justify-center"
										key="syncing"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<m.div
											animate={{ rotate: 360 }}
											transition={{
												repeat: Number.POSITIVE_INFINITY,
												duration: 1,
												ease: 'linear',
											}}
										>
											<AiOutlineSync size={22} className="text-blue-400" />
										</m.div>
									</m.div>
								) : syncState === SyncState.Success ? (
									<m.div
										className="flex items-center justify-center text-green-400"
										key="success"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 1.5, opacity: 0 }}
										transition={{ type: 'spring', stiffness: 300, damping: 15 }}
									>
										<BiCheck size={24} />
									</m.div>
								) : syncState === SyncState.Error ? (
									<m.div
										className="flex items-center justify-center text-red-400"
										key="error"
										initial={{ scale: 0.5, opacity: 0 }}
										animate={{
											scale: [1, 1.1, 1],
											opacity: 1,
											rotate: [0, -5, 5, -5, 0],
										}}
										exit={{ scale: 0.5, opacity: 0 }}
										transition={{ duration: 0.5 }}
									>
										<AiOutlineCloudSync size={22} />
									</m.div>
								) : (
									<m.div
										className="flex items-center justify-center"
										key="default"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										{user?.avatar && isAuthenticated ? (
											<m.img
												src={user.avatar}
												alt="User"
												className="object-cover w-6 h-6 rounded-full"
												initial={{ scale: 0.8 }}
												animate={{ scale: 1 }}
												transition={{ type: 'spring', stiffness: 300, damping: 15 }}
											/>
										) : (
											<m.div
												initial={{ scale: 0.8, opacity: 0.5 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ type: 'spring', stiffness: 300, damping: 15 }}
											>
												<AiOutlineCloudSync size={22} />
											</m.div>
										)}
									</m.div>
								)}
							</AnimatePresence>
						</m.button>
					</LazyMotion>
				</div>
			</Tooltip>
			<AuthRequiredModal
				isOpen={firstAuth}
				onClose={() => setFirstAuth(false)}
				title="ورود به حساب کاربری"
				message="برای همگام‌سازی با حساب کاربری، ابتدا وارد حساب کاربری خود شوید."
				loginButtonText="ورود به حساب"
				cancelButtonText="بعداً"
			/>
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
	}>('/extension/@me/sync')

	const { bookmarks, todos, wallpaper } = response.data

	const mappedFetched: Bookmark[] = mapBookmarks(bookmarks)
	callEvent('bookmarksChanged', mappedFetched)

	const mappedTodos: Todo[] = mapFetchedTodos(todos)
	callEvent('todosChanged', mappedTodos)

	const wallpaperStore = await getFromStorage('wallpaper')
	if (wallpaper && wallpaperStore?.id !== wallpaper?.id) {
		await setToStorage('wallpaper', {
			...wallpaper,
			isRetouchEnabled: false,
		})
		callEvent('wallpaperChanged', {
			...wallpaper,
			isRetouchEnabled: false,
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
		order: bookmark.order || 0, // Include order in the mapped fetched bookmarks
	}))

	return mappedFetched
}

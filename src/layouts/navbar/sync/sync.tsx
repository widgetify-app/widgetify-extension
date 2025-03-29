import { Colors } from '@/common/constant/colors.constant'
import { getFromStorage, setToStorage } from '@/common/storage'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import type { FetchedTodo, Todo } from '@/layouts/calendar/interface/todo.interface'
import { getMainClient } from '@/services/api'
import type { UserProfile } from '@/services/getMethodHooks/user/userService.hook'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
			if (!isAuthenticated || initialSyncDoneRef.current) return

			const isSyncEnabled = await getFromStorage('enable_sync')
			if (isSyncEnabled === false) return

			initialSyncDoneRef.current = true

			setTimeout(() => {
				syncData(SyncTarget.ALL)
			}, 1000)
		}

		initialSync()
	}, [isAuthenticated])

	const syncData = useCallback(
		async (syncTarget: SyncTarget) => {
			const now = Date.now()
			if (now - lastSyncTimeRef.current < 500) {
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
				if (syncTarget === SyncTarget.ALL || syncTarget === SyncTarget.TODOS) {
					const isSyncTodoComplete = await SyncTodo()

					if (isSyncTodoComplete) {
						setSyncState(SyncState.Success)
					} else {
						setSyncState(SyncState.Error)
					}
				}
			} finally {
				syncInProgressRef.current = false
			}
		},
		[isAuthenticated],
	)

	useEffect(() => {
		const handleSyncRequest = (eventData: any) => {
			const target = eventData.detail as SyncTarget
			syncData(target)
		}

		if (isAuthenticated) {
			window.addEventListener('startSync', handleSyncRequest)
			return () => {
				window.removeEventListener('startSync', handleSyncRequest)
			}
		}

		return undefined
	}, [isAuthenticated, syncData])

	const tooltipContent = useMemo(() => {
		if (syncState === SyncState.Syncing) return 'در حال همگام‌سازی...'

		if (syncState === SyncState.Success) return 'همگام‌سازی با موفقیت انجام شد'

		if (syncState === SyncState.Error) return 'خطا در همگام‌سازی'

		return 'همگام‌سازی با حساب کاربری'
	}, [syncState])

	return (
		<>
			<Tooltip delay={0} content={tooltipContent}>
				<div className="relative group">
					<motion.button
						className={`flex items-center justify-center cursor-pointer w-10 h-10 text-gray-300 transition-all border shadow-lg rounded-xl hover:text-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${Colors.bgItemGlass}`}
						onClick={() => syncData(SyncTarget.ALL)}
						aria-label="Sync"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					>
						<AnimatePresence mode="wait">
							{user?.avatar && syncState === null && (
								<motion.div
									className="absolute flex items-center justify-center w-4 h-4 bg-blue-500 border border-gray-800 rounded-full -bottom-1 -right-1"
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<AiOutlineCloudSync size={10} className="text-white" />
								</motion.div>
							)}

							{syncState === SyncState.Syncing ? (
								<motion.div
									className="flex items-center justify-center"
									key="syncing"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{
											repeat: Number.POSITIVE_INFINITY,
											duration: 1,
											ease: 'linear',
										}}
									>
										<AiOutlineSync size={22} className="text-blue-400" />
									</motion.div>
								</motion.div>
							) : syncState === SyncState.Success ? (
								<motion.div
									className="flex items-center justify-center text-green-400"
									key="success"
									initial={{ scale: 0.5, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									exit={{ scale: 1.5, opacity: 0 }}
									transition={{ type: 'spring', stiffness: 300, damping: 15 }}
								>
									<BiCheck size={24} />
								</motion.div>
							) : syncState === SyncState.Error ? (
								<motion.div
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
								</motion.div>
							) : (
								<motion.div
									className="flex items-center justify-center"
									key="default"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									{user?.avatar && isAuthenticated ? (
										<motion.img
											src={user.avatar}
											alt="User"
											className="object-cover rounded-full w-7 h-7"
											initial={{ scale: 0.8 }}
											animate={{ scale: 1 }}
											transition={{ type: 'spring', stiffness: 300, damping: 15 }}
										/>
									) : (
										<motion.div
											initial={{ scale: 0.8, opacity: 0.5 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ type: 'spring', stiffness: 300, damping: 15 }}
										>
											<AiOutlineCloudSync size={22} />
										</motion.div>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</Tooltip>
			<Modal
				size="sm"
				isOpen={firstAuth}
				onClose={() => setFirstAuth(false)}
				direction="rtl"
				title="خطا در همگام‌سازی"
			>
				<div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4 text-center">
					<p className="text-gray-300">
						برای همگام‌سازی، ابتدا وارد حساب کاربری خود شوید.
					</p>
					<motion.button
						className={`px-4 cursor-pointer py-2 text-sm font-medium text-white transition-colors bg-blue-500 border rounded-lg hover:bg-blue-600 ${Colors.bgItemGlass}`}
						onClick={() => setFirstAuth(false)}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						بستن
					</motion.button>
				</div>
			</Modal>
		</>
	)
}

async function SyncTodo(): Promise<boolean> {
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

		const todosInput = mapTodos(todos || [])
		const deletedTodosInput = mapTodos(deletedTodos || [])

		const response = await apiClient.post<FetchedTodo[]>('/todos/sync', {
			todos: todosInput,
			deletedTodos: deletedTodosInput,
		})

		const fetchedTodos = response.data

		const mapped: Todo[] = fetchedTodos.map((todo: FetchedTodo) => ({
			id: todo.offlineId || todo.id,
			text: todo.text,
			onlineId: todo.id,
			completed: todo.completed,
			date: todo.date,
			priority: todo.priority,
			category: todo.category,
			notes: todo.description,
		}))

		await setToStorage('deletedTodos', [])

		const event = new CustomEvent('todosChanged', {
			detail: mapped,
		})

		window.dispatchEvent(event)

		return true
	} catch (error) {
		console.error('Error during sync:', error)
		return false
	}
}

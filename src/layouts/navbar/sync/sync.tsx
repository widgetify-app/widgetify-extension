import { Colors } from '@/common/constant/colors.constant'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
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
	const { themeUtils } = useTheme()
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

	function triggerAccountTabDisplay() {
		setFirstAuth(false)
		callEvent('openSettings', 'account')
	}

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
				title="ورود به حساب کاربری"
			>
				<div className="flex flex-col items-center justify-center w-full gap-6 p-5 text-center">
					<div className="flex items-center justify-center w-16 h-16 mb-2 rounded-full bg-blue-500/10">
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ repeatType: 'reverse', duration: 1.5 }}
						>
							<AiOutlineCloudSync size={32} className="text-blue-500" />
						</motion.div>
					</div>

					<p className={`${themeUtils.getTextColor()} text-base`}>
						برای همگام‌سازی اطلاعات خود، ابتدا وارد حساب کاربری شوید.
					</p>

					<div className="flex flex-row items-center justify-center gap-3 mt-2">
						<motion.button
							className={`px-5 py-2.5 rounded-lg cursor-pointer font-medium transition-colors ${themeUtils.getTextColor()} border ${themeUtils.getBorderColor()}`}
							onClick={() => setFirstAuth(false)}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							بعداً
						</motion.button>

						<motion.button
							className="px-5 py-2.5 text-white cursor-pointer transition-colors bg-blue-500 rounded-lg font-medium hover:bg-blue-600"
							onClick={() => triggerAccountTabDisplay()}
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
						>
							ورود به حساب
						</motion.button>
					</div>
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

		callEvent('todosChanged', mapped)

		return true
	} catch (error) {
		console.error('Error during sync:', error)
		return false
	}
}

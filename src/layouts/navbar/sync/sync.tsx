import { Colors } from '@/common/constant/colors.constant'
import { getFromStorage } from '@/common/storage'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { getMainClient } from '@/services/api'
import type { UserProfile } from '@/services/getMethodHooks/user/userService.hook'
import { AnimatePresence, motion } from 'framer-motion'
import ms from 'ms'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudSync, AiOutlineSync } from 'react-icons/ai'
import { BiCheck } from 'react-icons/bi'

enum SyncState {
	Syncing = 0,
	Success = 1,
	Error = 2,
}

const AUTO_SYNC_INTERVAL = ms('5m') // 5 minutes

export function SyncButton() {
	const [firstAuth, setFirstAuth] = useState<boolean>(false)
	const [syncState, setSyncState] = useState<SyncState | null>(null)
	const { isAuthenticated } = useAuth()
	const [user, setUser] = useState<UserProfile | null>(null)
	const syncInProgressRef = useRef(false)

	useEffect(() => {
		if (syncState === SyncState.Success) {
			const timer = setTimeout(() => setSyncState(null), 3000)
			return () => clearTimeout(timer)
		}

		async function loadUser() {
			const userData = await getFromStorage('profile')
			if (userData) {
				setUser(userData)
			}
		}

		loadUser()
	}, [syncState])

	// Auto sync effect
	useEffect(() => {
		if (!isAuthenticated) return

		syncData(true)

		const intervalId = setInterval(() => {
			syncData(true)
		}, AUTO_SYNC_INTERVAL)

		return () => clearInterval(intervalId)
	}, [isAuthenticated])

	async function syncData(isAutoSync = false) {
		if (!isAuthenticated) {
			setFirstAuth(true)
			return
		}

		if (syncInProgressRef.current) return

		syncInProgressRef.current = true

		if (!isAutoSync) {
			setSyncState(SyncState.Syncing)
		}

		const isSyncTodoComplete = await SyncTodo()

		if (!isAutoSync) {
			if (isSyncTodoComplete) setSyncState(SyncState.Success)
			else {
				setSyncState(SyncState.Error)
			}
		}

		syncInProgressRef.current = false
	}

	return (
		<>
			<Tooltip
				delay={0}
				content={
					syncState === SyncState.Syncing
						? 'در حال همگام‌سازی...'
						: syncState === SyncState.Success
							? 'همگام‌سازی با موفقیت انجام شد'
							: syncState === SyncState.Error
								? 'خطا در همگام‌سازی'
								: 'همگام‌سازی با حساب کاربری'
				}
			>
				<div className="relative group">
					<motion.button
						className={`flex items-center justify-center cursor-pointer w-10 h-10 text-gray-300 transition-all border shadow-lg rounded-xl hover:text-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${Colors.bgItemGlass}`}
						onClick={() => syncData()}
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
		const apiClient = await getMainClient()
		const todos = await getFromStorage('todos')
		const todosInput = []
		if (todos) {
			for (const todo of todos) {
				todosInput.push({
					text: todo.text,
					category: todo.category,
					date: todo.date,
					description: todo.notes,
					priority: todo.priority,
					completed: todo.completed,
					offlineId: todo.id,
				})
			}
		}

		await apiClient.post('/todos/sync', {
			todos: todosInput,
		})
		return true
	} catch (error) {
		return false
	}
}

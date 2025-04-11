import { getFromStorage, setToStorage } from '@/common/storage'
import { OfflineIndicator } from '@/components/offline-indicator'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { useGetUserProfile } from '@/services/getMethodHooks/user/userService.hook'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Connections } from './connections'

export const UserProfile = () => {
	const { logout } = useAuth()
	const { theme, themeUtils } = useTheme()
	const { data: profile, isLoading, isError, failureReason } = useGetUserProfile()
	const [enableSync, setEnableSync] = useState<boolean>(true)

	useEffect(() => {
		const loadSyncSettings = async () => {
			const syncEnabled = await getFromStorage('enable_sync')
			setEnableSync(syncEnabled !== null ? syncEnabled : true)
		}

		loadSyncSettings()
	}, [])

	const handleSyncToggle = async (newState: boolean) => {
		setEnableSync(newState)
		await setToStorage('enable_sync', newState)
	}

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-red-600 hover:bg-red-700 text-white'
			case 'dark':
				return 'bg-red-500 hover:bg-red-600 text-white'
			default: // glass
				return 'bg-red-500/70 hover:bg-red-600/70 backdrop-blur-sm text-white'
		}
	}

	const getMessageError = () => {
		// @ts-ignore
		if (failureReason?.status === 401) {
			return 'نیاز به ورود مجدد به حساب کاربری دارید.'
		}

		return 'خطا در بارگذاری پروفایل کاربری. لطفاً دوباره تلاش کنید.'
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="w-10 h-10 border-4 rounded-full border-blue-500/20 border-t-blue-500 animate-spin"></div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className={`mb-4 text-center ${themeUtils.getTextColor()}`}>
					{getMessageError()}
				</p>
				<button
					onClick={logout}
					className={`px-4 py-2 cursor-pointer rounded-lg transition-colors ${getButtonStyle()}`}
				>
					خروج از حساب کاربری
				</button>
			</div>
		)
	}

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="space-y-6">
				<motion.div
					className="space-y-2"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<div className="flex items-center gap-4 mb-8">
						<div className="relative">
							<img
								src={profile?.avatar || 'https://via.placeholder.com/100'}
								alt={profile?.name || 'کاربر'}
								className="object-cover w-16 h-16 border-4 rounded-full border-white/10"
								onError={(e) => {
									e.currentTarget.src = 'https://via.placeholder.com/100'
								}}
							/>
							<div
								className={`absolute w-3 h-3 ${profile?.inCache ? 'bg-amber-500' : 'bg-green-500'} border-2 rounded-full border-neutral-700 bottom-1 right-1`}
							></div>

							{profile?.inCache && <OfflineIndicator mode="badge" />}
						</div>
						<div>
							<h3 className={`text-lg font-medium ${themeUtils.getTextColor()}`}>
								{profile?.name || 'کاربر'}
							</h3>
							<p className="text-sm text-left text-gray-500 dir-ltr">{profile?.email}</p>

							{profile?.inCache && <OfflineIndicator mode="status" />}
						</div>
					</div>
				</motion.div>

				<SectionPanel title="همگام‌سازی" delay={0.2}>
					<div className="flex items-center justify-between">
						<div>
							<p className={`text-sm ${themeUtils.getTextColor()}`}>
								فعال‌سازی همگام‌سازی (ُSync)
							</p>
							<p className={`text-xs ${themeUtils.getTextColor()} font-light`}>
								با فعال کردن همگام‌سازی، تنظیمات شما به صورت خودکار ذخیره و در نسخه‌های
								مختلف همگام‌سازی می‌شوند.
							</p>
						</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={enableSync}
								onChange={(e) => handleSyncToggle(e.target.checked)}
								className="sr-only peer"
							/>
							<div
								className={`relative w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer 
                                    ${enableSync ? 'bg-blue-500' : 'bg-gray-700'} 
                                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                    after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                                    after:bg-white after:rounded-full after:h-5 after:w-5 
                                    after:transition-all peer-checked:bg-blue-600`}
							></div>
						</label>
					</div>
				</SectionPanel>

				<Connections />

				<SectionPanel title="حساب کاربری" delay={0.3}>
					<div className="space-y-4">
						<p className={`text-sm font-light ${themeUtils.getTextColor()}`}>
							برای خروج از حساب کاربری خود، روی دکمه زیر کلیک کنید.
						</p>
						<button
							onClick={() => logout()}
							className={`px-4 py-2 cursor-pointer rounded-lg transition-colors ${getButtonStyle()}`}
						>
							خروج از حساب کاربری
						</button>
					</div>
				</SectionPanel>
			</div>
		</motion.div>
	)
}

import { getFromStorage, setToStorage } from '@/common/storage'
import { AvatarComponent } from '@/components/avatar.component'
import { OfflineIndicator } from '@/components/offline-indicator'
import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useAuth } from '@/context/auth.context'
import { getTextColor, useTheme } from '@/context/theme.context'
import { useGetUserProfile } from '@/services/getMethodHooks/user/userService.hook'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AiOutlineFileSync } from 'react-icons/ai'
import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiAtSign, FiLogOut, FiMail, FiUser } from 'react-icons/fi'
import { ActivityInput } from './activity-input'
import { Connections } from './connections'

const getGenderInfo = (gender: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
	if (gender === 'MALE')
		return {
			label: 'مرد',
			icon: <BsGenderMale className="text-blue-500" />,
			color: 'text-blue-500',
		}
	if (gender === 'FEMALE')
		return {
			label: 'زن',
			icon: <BsGenderFemale className="text-pink-500" />,
			color: 'text-pink-500',
		}
	if (gender === 'OTHER')
		return {
			label: 'دیگر',
			icon: <BsGenderAmbiguous className="text-purple-500" />,
			color: 'text-purple-500',
		}
	return {
		label: 'نامشخص',
		icon: <BsGenderAmbiguous className="text-gray-500" />,
		color: 'text-gray-500',
	}
}

export const UserProfile = () => {
	const { logout } = useAuth()
	const { theme } = useTheme()
	const { data: profile, isLoading, isError, failureReason } = useGetUserProfile()
	const [enableSync, setEnableSync] = useState<boolean>(true)

	useEffect(() => {
		const loadSyncSettings = async () => {
			const syncEnabled = (await getFromStorage('enable_sync')) as boolean | undefined
			setEnableSync(syncEnabled !== undefined ? syncEnabled : true)
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
			default:
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
				<p className={`mb-4 text-center ${getTextColor(theme)}`}>{getMessageError()}</p>
				<button
					onClick={logout}
					className={`px-4 py-2 font-medium cursor-pointer rounded-lg transition-colors ${getButtonStyle()}`}
				>
					خروج از حساب کاربری
				</button>
			</div>
		)
	}

	return (
		<motion.div
			className="w-full max-w-xl px-4 mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className={'flex items-center justify-between p-5 mb-8 rounded-xl'}>
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<h3 className={`text-xl font-bold ${getTextColor(theme)}`}>
							{profile?.name || 'کاربر'}
						</h3>
						{
							<div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
								<FiAtSign size={14} />
								<span>{profile?.username || '-'}</span>
							</div>
						}
						<div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
							<FiMail size={14} />
							<span className="dir-ltr">{profile?.email}</span>
						</div>
						<div className="flex items-center gap-1.5 mt-1">
							{getGenderInfo(profile?.gender).icon}
							<p
								className={`text-sm ${getGenderInfo(profile?.gender).color} font-medium`}
							>
								{getGenderInfo(profile?.gender).label}
							</p>
						</div>
						<div className="mt-4">
							<a
								href="https://widgetify.ir/login"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 w-fit"
							>
								<FiUser size={14} />
								ویرایش پروفایل
							</a>
						</div>
					</div>
				</div>
				<div className="relative flex-shrink-0">
					<AvatarComponent
						url={profile?.avatar || null}
						placeholder={profile?.name || 'کاربر'}
						size="xl"
						className="border-2 shadow-md border-neutral-700"
					/>
					<div
						className={`absolute w-4 h-4 ${profile?.inCache ? 'bg-amber-500' : 'bg-green-500'} border-2 rounded-full border-neutral-800 -bottom-1 -right-1`}
					></div>
					{profile?.inCache && <OfflineIndicator mode="badge" />}
				</div>
			</div>

			<ActivityInput />

			<SectionPanel title="همگام‌سازی" delay={0.2}>
				<div className="flex items-center justify-between p-4 transition-colors rounded-lg">
					<div className="pr-2">
						<p
							className={`text-sm font-medium ${getTextColor(theme)} flex items-center gap-1.5`}
						>
							<AiOutlineFileSync
								size={16}
								className={enableSync ? 'text-blue-500' : 'text-gray-500'}
							/>
							فعال‌سازی همگام‌سازی (Sync)
						</p>
						<p
							className={`text-xs ${getTextColor(theme)} font-light opacity-80 mt-2 max-w-md`}
						>
							با فعال کردن همگام‌سازی، تنظیمات شما به صورت خودکار ذخیره و در نسخه‌های مختلف
							همگام‌سازی می‌شوند.
						</p>
					</div>
					<ToggleSwitch
						enabled={enableSync}
						onToggle={() => handleSyncToggle(!enableSync)}
						key={'sync-toggle'}
					/>
				</div>
			</SectionPanel>

			<Connections />

			<SectionPanel title="حساب کاربری" delay={0.3}>
				<div className="p-4 space-y-3 transition-colors rounded-lg">
					<p className={`text-sm font-light ${getTextColor(theme)}`}>
						برای خروج از حساب کاربری خود، روی دکمه زیر کلیک کنید.
					</p>
					<button
						onClick={() => logout()}
						className={`px-5 py-2 cursor-pointer rounded-lg transition-colors font-medium ${getButtonStyle()} shadow-sm flex items-center justify-center gap-2 w-fit`}
					>
						<FiLogOut size={16} />
						خروج از حساب کاربری
					</button>
				</div>
			</SectionPanel>
		</motion.div>
	)
}

import { useEffect, useState } from 'react'
import { AiOutlineFileSync } from 'react-icons/ai'
import { BsGenderAmbiguous, BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { FiAtSign, FiCalendar, FiLogOut, FiMail, FiUser } from 'react-icons/fi'
import { MdOutlineVerifiedUser } from 'react-icons/md'
import { setToStorage } from '@/common/storage'
import { isSyncActive } from '@/common/sync-checker'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { OfflineIndicator } from '@/components/offline-indicator'
import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGetUserProfile } from '@/services/hooks/user/userService.hook'
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
		icon: <BsGenderAmbiguous className="text-content" />,
		color: 'text-content',
	}
}

export const UserProfile = () => {
	const { logout } = useAuth()
	const { data: profile, isLoading, isError, failureReason } = useGetUserProfile()
	const [enableSync, setEnableSync] = useState<boolean>(true)

	useEffect(() => {
		const loadSyncSettings = async () => {
			const syncEnabled = await isSyncActive()
			setEnableSync(syncEnabled)
		}

		loadSyncSettings()
	}, [])

	const handleSyncToggle = async (newState: boolean) => {
		setEnableSync(newState)
		await setToStorage('enable_sync', newState)
	}

	const getMessageError = () => {
		// @ts-expect-error
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
				<p className={'mb-4 text-center text-content'}>{getMessageError()}</p>
				<Button
					onClick={() => logout()}
					className="text-white/90 btn-error"
					size="md"
				>
					<FiLogOut size={16} />
					خروج از حساب کاربری
				</Button>
			</div>
		)
	}
	return (
		<div className="w-full max-w-xl px-4 mx-auto">
			<div className="relative mb-2 overflow-hidden border bg-gradient-to-br from-blue-50/5 to-purple-50/5 backdrop-blur-sm border-content rounded-2xl">
				<div className="relative p-4">
					<div className="flex flex-col items-center gap-3 md:flex-row md:items-start">
						{/* Avatar Section */}
						<div className="relative flex-shrink-0 group">
							<div className="absolute transition-opacity duration-300 rounded-full -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 group-hover:opacity-40"></div>
							<AvatarComponent
								url={profile?.avatar || null}
								placeholder={profile?.name || 'کاربر'}
								size="xl"
								className="relative border-4 shadow-2xl border-white/20 backdrop-blur-sm"
							/>
							{profile?.verified && (
								<div
									className={`absolute w-6 h-6 bg-success rounded-full text-content shadow-lg -bottom-1 right-1 flex items-center justify-center bg-glass`}
								>
									<Tooltip content="حساب کاربری تایید شده">
										<MdOutlineVerifiedUser size={18} />
									</Tooltip>
								</div>
							)}
							{profile?.inCache && <OfflineIndicator mode="badge" />}
						</div>

						{/* Profile Info */}
						<div className="flex-1 space-y-4 text-center md:text-right">
							<div>
								<div className="flex flex-row items-center justify-start mb-2">
									<h1 className="text-3xl font-bold text-content">
										{profile?.name || 'کاربر'}{' '}
									</h1>
								</div>
								<div className="grid items-center justify-center grid-cols-2 gap-1 text-sm text-content/70">
									<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
										<FiAtSign size={12} />
										<span>{profile?.username || '-'}</span>
									</div>
									<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
										<FiMail size={12} />
										<span className="truncate dir-ltr">
											{profile?.email}
										</span>
									</div>
									<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
										{getGenderInfo(profile?.gender).icon}
										<span
											className={`font-medium ${getGenderInfo(profile?.gender).color}`}
										>
											جنسیت:{' '}
											{getGenderInfo(profile?.gender).label ||
												'نامشخص'}
										</span>
									</div>
									{/* birthday */}
									<div className="flex items-center gap-1 px-2 py-1.5 bg-content rounded-full">
										<FiCalendar size={12} />
										<span>{profile?.birthDate || '-'}</span>
									</div>
								</div>
							</div>

							<div className="flex justify-center gap-1 md:justify-start">
								<a
									href="https://widgetify.ir/login"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition-all duration-300 transform shadow-lg hover:scale-105 bg-primary rounded-2xl"
								>
									<FiUser size={16} />
									{profile?.verified
										? 'ویرایش پروفایل'
										: 'تایید حساب کاربری'}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ActivityInput activity={profile?.activity || ''} />

			<SectionPanel title="همگام‌سازی" size="xs">
				<div className="flex items-center justify-between p-4 transition-colors rounded-lg">
					<div className="pr-2">
						<p
							className={
								'text-sm font-medium text-content flex items-center gap-1.5'
							}
						>
							<AiOutlineFileSync
								size={16}
								className={enableSync ? 'text-blue-500' : 'text-content'}
							/>
							فعال‌سازی همگام‌سازی (Sync)
						</p>
						<p
							className={
								'text-xs text-content font-light opacity-80 mt-2 max-w-md'
							}
						>
							با فعال کردن همگام‌سازی، تنظیمات شما به صورت خودکار ذخیره و در
							نسخه‌های مختلف همگام‌سازی می‌شوند.
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

			<SectionPanel title="حساب کاربری" delay={0.3} size="xs">
				<div className="p-4 space-y-3 transition-colors rounded-lg">
					<p className={'text-sm font-light text-content'}>
						برای خروج از حساب کاربری خود، روی دکمه زیر کلیک کنید.
					</p>
					<Button
						onClick={() => logout()}
						className="text-white/90 btn-error rounded-2xl"
						size="md"
					>
						<FiLogOut size={16} />
						خروج از حساب کاربری
					</Button>{' '}
				</div>
			</SectionPanel>
		</div>
	)
}

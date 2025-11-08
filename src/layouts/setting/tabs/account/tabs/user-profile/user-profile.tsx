import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineFileSync } from 'react-icons/ai'
import { FiLogOut } from 'react-icons/fi'
import { setToStorage } from '@/common/storage'
import { isSyncActive } from '@/common/sync-checker'
import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useAuth } from '@/context/auth.context'
import { useGetOrCreateReferralCode } from '@/services/hooks/user/referralsService.hook'
import {
	useGetUserProfile,
	useSendVerificationEmail,
} from '@/services/hooks/user/userService.hook'
import { AccountVerificationStatus } from '../../components/account-verification-status'
import { ActivityInput } from '../../components/activity-input'
import { ProfileDisplay } from '../../components/profile-display'
import { ProfileEditForm } from '../../components/profile-edit-form'
import { ReferralCodeSection } from '../rewards/components/ReferralCodeSection'
import { Connections } from './connections/connections'

export const UserProfile = () => {
	const { logout } = useAuth()
	const queryClient = useQueryClient()
	const {
		data: profile,
		isLoading,
		isError,
		failureReason,
		refetch,
	} = useGetUserProfile()
	const sendVerificationMutation = useSendVerificationEmail()
	const [enableSync, setEnableSync] = useState<boolean>(true)
	const [isEditing, setIsEditing] = useState(false)
	const { data: referralCode } = useGetOrCreateReferralCode(profile?.verified || false)

	useEffect(() => {
		const loadSyncSettings = async () => {
			const syncEnabled = await isSyncActive()
			setEnableSync(syncEnabled)
		}
		refetch()
		loadSyncSettings()
	}, [])

	const handleSyncToggle = async (newState: boolean) => {
		setEnableSync(newState)
		await setToStorage('enable_sync', newState)
	}

	const handleEditToggle = () => {
		setIsEditing(!isEditing)
	}

	const handleEditSuccess = () => {
		queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		setIsEditing(false)
	}

	const handleSendVerificationEmail = async () => {
		try {
			await sendVerificationMutation.mutateAsync()
			toast.success('ایمیل تایید با موفقیت ارسال شد!', {
				duration: 4000,
			})
		} catch {
			toast.error('خطا در ارسال ایمیل تایید. لطفاً دوباره تلاش کنید.')
		}
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
			{isEditing ? (
				<ProfileEditForm
					profile={profile}
					onCancel={() => setIsEditing(false)}
					onSuccess={handleEditSuccess}
				/>
			) : (
				<ProfileDisplay profile={profile} onEditToggle={handleEditToggle} />
			)}

			{!profile?.verified ? (
				<AccountVerificationStatus
					sendVerificationMutation={sendVerificationMutation}
					onSendVerificationEmail={handleSendVerificationEmail}
				/>
			) : (
				referralCode?.referralCode && (
					<ReferralCodeSection
						code={referralCode.referralCode}
						enableNewBadge={true}
						className="!p-2 !px-4"
					/>
				)
			)}
			<ActivityInput activity={profile?.activity || ''} />

			<SectionPanel title="همگام‌سازی" size="xs">
				<div className="flex items-center justify-between p-2 transition-colors rounded-lg">
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
				<div className="p-2 space-y-3 transition-colors rounded-lg">
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

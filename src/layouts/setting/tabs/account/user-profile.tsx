import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineFileSync } from 'react-icons/ai'
import { FiLogOut, FiMail } from 'react-icons/fi'
import { MdMarkEmailRead } from 'react-icons/md'
import { setToStorage } from '@/common/storage'
import { isSyncActive } from '@/common/sync-checker'
import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useAuth } from '@/context/auth.context'
import {
	useGetUserProfile,
	useSendVerificationEmail,
} from '@/services/hooks/user/userService.hook'
import { ActivityInput } from './components/activity-input'
import { Connections } from './connections/connections'
import { ProfileDisplay } from './profile-display'
import { ProfileEditForm } from './profile-edit-form'

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

			{profile && (
				<SectionPanel title="وضعیت تایید حساب" size="xs" delay={0.1}>
					<div className="p-1 space-y-3 transition-colors rounded-lg">
						{profile.verified ? (
							<div className="flex items-center gap-3 p-3 border rounded-lg bg-success/10 border-success/20">
								<MdMarkEmailRead className="text-success" size={24} />
								<div>
									<p className="text-sm font-medium text-success">
										حساب شما تایید شده است
									</p>
									<p className="text-xs text-success/80">
										ایمیل شما با موفقیت تایید شده و می‌توانید از تمام
										امکانات استفاده کنید.
									</p>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between p-3 border rounded-lg bg-warning/10 border-warning/20">
								<div className="flex items-center gap-3">
									<FiMail className="text-warning" size={24} />
									<div>
										<p className="text-sm font-medium text-warning">
											⚠️ حساب شما تایید نشده است
										</p>
										<p className="text-xs text-warning/90">
											لطفاً ایمیل خود را بررسی کنید یا ایمیل جدید
											درخواست کنید.
										</p>
									</div>
								</div>
								<Button
									onClick={handleSendVerificationEmail}
									disabled={sendVerificationMutation.isPending}
									className="px-3 py-2 text-sm transition-colors rounded-2xl text-content bg-warning/80 hover:bg-warning/50"
									size="sm"
								>
									{sendVerificationMutation.isPending ? (
										<>
											<div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
											در حال ارسال...
										</>
									) : (
										<>
											<FiMail size={16} />
											ارسال ایمیل تایید
										</>
									)}
								</Button>
							</div>
						)}
					</div>
				</SectionPanel>
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

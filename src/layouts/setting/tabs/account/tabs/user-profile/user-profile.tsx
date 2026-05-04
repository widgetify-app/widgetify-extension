import { useEffect } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { Button } from '@/components/button/button'
import { SectionPanel } from '@/components/section-panel'
import { useAuth } from '@/context/auth.context'
import { useGetOrCreateReferralCode } from '@/services/hooks/user/referralsService.hook'
import {
	useGetUserProfile,
	useSendVerificationEmail,
} from '@/services/hooks/user/userService.hook'
import { AccountVerificationStatus } from '../../components/account-verification-status'
import { ProfileDisplay } from '../../components/profile-display'
import { ReferralCodeSection } from '../rewards/components/ReferralCodeSection'
import { showToast } from '@/common/toast'
import { translateError } from '@/utils/translate-error'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'

export const UserProfile = () => {
	const { logout } = useAuth()
	const [showConfirm, setShowConfirm] = useState<boolean>(false)
	const {
		data: profile,
		isLoading,
		isError,
		failureReason,
		refetch,
	} = useGetUserProfile()
	const sendVerificationMutation = useSendVerificationEmail()
	const { data: referralCode } = useGetOrCreateReferralCode(profile?.verified || false)

	useEffect(() => {
		refetch()
	}, [])

	const onClickLogout = () => {
		logout()
		setTimeout(() => {
			location.reload()
		}, 1000)
	}

	const handleSendVerificationEmail = async () => {
		try {
			await sendVerificationMutation.mutateAsync()
			showToast('ایمیل تایید با موفقیت ارسال شد!', 'success')
		} catch (err: any) {
			showToast(translateError(err) as string, 'error')
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
					onClick={() => onClickLogout()}
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
			<ProfileDisplay />
			{profile?.email && !profile?.verified && (
				<AccountVerificationStatus
					sendVerificationMutation={sendVerificationMutation}
					onSendVerificationEmail={handleSendVerificationEmail}
				/>
			)}

			{referralCode?.referralCode && (
				<ReferralCodeSection
					code={referralCode.referralCode}
					className="!p-2 !px-4"
				/>
			)}

			<SectionPanel title="حساب کاربری" delay={0.3} size="xs">
				<div className="p-2 space-y-3 transition-colors rounded-lg">
					<p className={'text-sm font-light text-content'}>
						برای خروج از حساب کاربری خود، روی دکمه زیر کلیک کنید.
					</p>
					<Button
						onClick={() => setShowConfirm(true)}
						className="text-white/90 btn-error rounded-2xl"
						size="md"
					>
						<FiLogOut size={16} />
						خروج از حساب کاربری
					</Button>{' '}
				</div>
			</SectionPanel>

			<ConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={() => onClickLogout()}
				message="مطمعنی میخای از حسابت خارج بشی؟"
				title="خروج از حساب کاربری"
				confirmText="بله، خروج"
			></ConfirmationModal>
		</div>
	)
}

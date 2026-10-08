import { t } from '@/common/i18n'
import { useEffect } from 'react'
import { Button, SectionPanel, Spinner } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useGetOrCreateReferralCode } from '@/services/user/referrals-service.hook'
import {
	useGetUserProfile,
	useSendVerificationEmail,
} from '@/services/user/user-service.hook'
import { AccountVerificationStatus } from '../components/account-verification-status'
import { ProfileDisplay } from '../components/profile-display'
import { ReferralCodeSection } from '../components/referral-code-section'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { ConfirmationModal } from '@/components/ui'
import { VipBannerCard } from './components/vip-banner-card'
import { Icon } from '@/icons'

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

	const onClickLogout = async () => {
		await logout()
		location.reload()
	}

	const handleSendVerificationEmail = async () => {
		try {
			await sendVerificationMutation.mutateAsync()
			showToast(t('setting.userProfile.verificationEmailSent'), 'success')
		} catch (err: any) {
			showToast(translateError(err) as string, 'error')
		}
	}

	const getMessageError = () => {
		// @ts-expect-error
		if (failureReason?.status === 401) {
			return t('setting.userProfile.reLoginRequired')
		}

		return t('setting.userProfile.loadError')
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Spinner size="2xl" />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<p className={'mb-4 text-center text-fg'}>{getMessageError()}</p>
				<Button
					onClick={() => onClickLogout()}
					color={'danger'}
					rounded={'2xl'}
					size="md"
				>
					<Icon name="logOut" size={16} />
					{t('setting.userProfile.logoutTitle')}
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<VipBannerCard />
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
					className="p-2! px-4!"
				/>
			)}

			<SectionPanel title={t('setting.userProfile.logoutAction')} size="sm">
				<div className="space-y-3">
					<p className={'text-sm font-light text-fg'}>
						{t('setting.userProfile.logoutHint')}
					</p>
					<Button
						onClick={() => setShowConfirm(true)}
						size="md"
						color={'danger'}
						rounded={'2xl'}
					>
						<Icon name="logOut" size={16} />
						{t('setting.userProfile.logoutTitle')}
					</Button>
				</div>
			</SectionPanel>

			<ConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				onConfirm={() => onClickLogout()}
				icon={<Icon name="logOut" />}
				message={t('setting.userProfile.logoutConfirm')}
				title={t('setting.userProfile.logoutTitle')}
				confirmText={t('setting.userProfile.logoutConfirmButton')}
				cancelText={t('ui.common.cancel')}
			></ConfirmationModal>
		</div>
	)
}

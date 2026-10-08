import { lazy, Suspense, useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { ConfirmationModal, Dropdown, Modal, Spinner } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { ProfileDropdownMenu } from './components/profile-dropdown-menu'
import { ProfileTrigger } from './components/profile-trigger'
import { t } from '@/common/i18n'

const AuthForm = lazy(() => import('@/features/setting/account/auth-form/auth-form'))

const WelcomeWizard = lazy(() =>
	import('./components/welcome-wizard').then((module) => ({
		default: module.WelcomeWizard,
	}))
)

export function ProfileNav() {
	const { user, isAuthenticated, isVip, profilePercentage, logout } = useAuth()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [openedWizard, setOpenedWizard] = useState(false)

	const handleConfirmLogout = async () => {
		Analytics.event('navbar_logout')
		setShowLogoutModal(false)
		await logout()
		location.reload()
	}

	const authModalCloseHandler = () => setShowAuthModal(false)

	useEffect(() => {
		if (isAuthenticated && showAuthModal) {
			setShowAuthModal(false)
		}
	}, [isAuthenticated, showAuthModal])

	useEffect(() => {
		const event = listenEvent('openProfile', (active) => {
			if (!isAuthenticated) {
				setShowAuthModal(true)
			} else {
				callEvent('openSettings', (active as any) || 'profile')
			}
		})

		const eventClose = listenEvent('close_all_modals', () => {
			authModalCloseHandler()
		})

		const openWizardEvent = listenEvent('openWizardModal', () => {
			authModalCloseHandler()
			setOpenedWizard(true)
		})

		return () => {
			event()
			eventClose()
			openWizardEvent()
		}
	}, [isAuthenticated])

	return (
		<>
			<Dropdown
				trigger={
					<ProfileTrigger
						user={user}
						isAuthenticated={isAuthenticated}
						profilePercentage={profilePercentage}
						onClick={() => Analytics.event('navbar_profile_opened')}
					/>
				}
			>
				<ProfileDropdownMenu
					user={user}
					isAuthenticated={isAuthenticated}
					isVip={Boolean(isVip)}
					onRequestAuth={() => setShowAuthModal(true)}
					onRequestLogout={() => setShowLogoutModal(true)}
				/>
			</Dropdown>

			<Modal
				isOpen={showAuthModal}
				onClose={authModalCloseHandler}
				size="sm"
				closeLabel={t('ui.common.close')}
			>
				<Suspense
					fallback={
						<div className="flex justify-center py-16">
							<Spinner size="lg" />
						</div>
					}
				>
					<AuthForm />
				</Suspense>
			</Modal>

			<ConfirmationModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleConfirmLogout}
				title={t('navbar.logout.title')}
				message={t('navbar.logout.message')}
				confirmText={t('navbar.logout.confirm')}
				cancelText={t('navbar.logout.cancel')}
				variant="danger"
			/>

			{openedWizard && (
				<Suspense fallback={null}>
					<WelcomeWizard
						isOpen={openedWizard}
						onClose={() => setOpenedWizard(false)}
					/>
				</Suspense>
			)}
		</>
	)
}

import { useState, useEffect } from 'react'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { ConfirmationModal, Dropdown, Modal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import AuthForm from '../../setting/tabs/account/auth-form/auth-form'
import { ProfileDropdownMenu } from './components/profile-dropdown-menu'
import { ProfileTrigger } from './components/profile-trigger'
import { WelcomeWizard } from './welcome-wizard'

export function ProfileNav() {
	const { user, isAuthenticated, isVip, profilePercentage, logout } = useAuth()
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [openedWizard, setOpenedWizard] = useState(false)

	const handleConfirmLogout = () => {
		logout()
		setShowLogoutModal(false)
		setTimeout(() => {
			location.reload()
		}, 1000)
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
				direction="rtl"
				title=" "
			>
				<AuthForm />
			</Modal>

			<ConfirmationModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleConfirmLogout}
				title="خروج از حساب"
				message="مطمئنی می‌خوای از حسابت خارج بشی؟"
				confirmText="خروج"
				cancelText="بی‌خیال"
				variant="danger"
			/>

			{openedWizard && (
				<WelcomeWizard
					isOpen={openedWizard}
					onClose={() => setOpenedWizard(false)}
				/>
			)}
		</>
	)
}

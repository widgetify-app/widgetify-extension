import { useState, useEffect } from 'react'
import { LuCircleUser } from 'react-icons/lu'
import { listenEvent } from '@/common/utils/call-event'
import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { UserAccountModal } from '../../setting/tabs/account/user-account.modal'
import { WelcomeWizard } from '@/components/welcome-wizard'

const renderUserAvatar = (user: any) => {
	if (user?.avatar) {
		return <AvatarComponent url={user.avatar} size="xs" className="!w-5 !h-5" />
	}

	const initial = user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'
	return <span className="text-2xl font-bold text-content">{initial}</span>
}

const renderPendingNotification = (pendingCount: number) => (
	<div className="absolute flex items-center justify-center w-2 h-2 text-[.4rem] font-bold text-white bg-red-500 rounded-full bottom-1 right-2 p-0.5 text-center">
		{pendingCount}
	</div>
)

const getTooltipContent = (user: any) => {
	return user?.inCache ? (
		<span className="text-error">خطا در بارگیری پروفایل</span>
	) : (
		'پروفایل کاربری'
	)
}

export function ProfileNav() {
	const { user, isAuthenticated, profilePercentage } = useAuth()
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [openedWizard, setOpenedWizard] = useState(false)

	const handleProfileClick = () => {
		setShowSettingsModal(true)
	}

	const modalCloseHandler = () => setShowSettingsModal(false)

	const containerClasses = `relative flex justify-center items-center h-8 px-1 transition-all duration-300 cursor-pointer w-8 rounded-full hover:opacity-80 group hover:bg-primary/10 ${
		user?.inCache ? `ring-1 ring-error relative overflow-visible` : ''
	}`

	const hasPendingRequests = (user?.friendshipStats?.pending ?? 0) > 0
	const isAuth = user || isAuthenticated

	useEffect(() => {
		const event = listenEvent('openProfile', () => {
			handleProfileClick()
		})

		const eventClose = listenEvent('close_all_modals', () => {
			modalCloseHandler()
		})

		const openWizardEvent = listenEvent('openWizardModal', () => {
			modalCloseHandler()
			setOpenedWizard(true)
		})

		return () => {
			event()
			eventClose()
			openWizardEvent()
		}
	}, [])

	return (
		<>
			{!isAuth ? (
				<Tooltip content="ورود به حساب کاربری">
					<div
						className="relative p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
						id="profile-and-friends-list"
						onClick={handleProfileClick}
					>
						<LuCircleUser size={20} />
					</div>
				</Tooltip>
			) : (
				<Tooltip content={getTooltipContent(user)}>
					{profilePercentage ? (
						<div
							className="absolute radial-progress text-primary/80"
							style={{
								// @ts-expect-error
								'--value': profilePercentage,
								'--size': '2rem',
							}}
							aria-valuenow={0}
							role="progressbar"
						></div>
					) : null}
					<div className={`${containerClasses} `} onClick={handleProfileClick}>
						{renderUserAvatar(user)}
						{hasPendingRequests &&
							renderPendingNotification(
								user?.friendshipStats?.pending || 0
							)}
					</div>
				</Tooltip>
			)}

			<UserAccountModal
				isOpen={showSettingsModal}
				selectedTab="profile"
				onClose={modalCloseHandler}
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

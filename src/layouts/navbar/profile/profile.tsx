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
		return <AvatarComponent url={user.avatar} className="w-8! h-8!" />
	}

	const initial = user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'
	return <span className="text-2xl font-bold text-content">{initial}</span>
}

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
	const [activeTab, setActiveTab] = useState<string>()

	const handleProfileClick = () => {
		setShowSettingsModal(true)
	}

	const modalCloseHandler = () => setShowSettingsModal(false)

	const isAuth = user || isAuthenticated

	useEffect(() => {
		const event = listenEvent('openProfile', (active) => {
			setActiveTab(active)
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
						<LuCircleUser size={15} />
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
					<div
						className={`relative w-8 flex justify-center items-center  transition-all duration-300 cursor-pointer rounded-full hover:opacity-80 group hover:bg-primary/10 ${user?.inCache && 'ring-2 ring-error/40 relative overflow-visible'}`}
						onClick={handleProfileClick}
					>
						{renderUserAvatar(user)}
					</div>
				</Tooltip>
			)}

			<UserAccountModal
				isOpen={showSettingsModal}
				selectedTab={activeTab}
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

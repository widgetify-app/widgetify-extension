import { useState, useEffect } from 'react'
import { listenEvent } from '@/common/utils/call-event'
import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { UserAccountModal } from '../../setting/tabs/account/user-account.modal'
import { WelcomeWizard } from '@/components/welcome-wizard'
import { Icon } from '@/src/icons'

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

	const handleProfileClick = (active?: string) => {
		setShowSettingsModal(true)
		if (active) setActiveTab(active)
	}

	const modalCloseHandler = () => setShowSettingsModal(false)

	const isAuth = user || isAuthenticated

	useEffect(() => {
		const event = listenEvent('openProfile', (active) => {
			handleProfileClick(active)
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
						className="relative p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
						id="profile-and-friends-list"
						onClick={() => handleProfileClick()}
					>
						<Icon name="user" size={15} />
					</div>
				</Tooltip>
			) : (
				<Tooltip
					content={
						profilePercentage
							? 'پروفایلت رو کامل کن!'
							: getTooltipContent(user)
					}
					className="cursor-pointer"
				>
					{profilePercentage ? (
						<div
							className="absolute z-10 outline-2 outline-primary/40 radial-progress text-primary/80"
							style={{
								// @ts-expect-error
								'--value': profilePercentage,
								'--size': '2rem',
							}}
							aria-valuenow={0}
							role="progressbar"
							onClick={() => handleProfileClick('profile')}
						></div>
					) : null}
					<div
						className={`relative w-8 flex justify-center items-center  transition-all duration-300 cursor-pointer rounded-full hover:opacity-80 group hover:bg-primary/10 ${user?.inCache && 'ring-2 ring-error/40 relative overflow-visible'}`}
						onClick={() => handleProfileClick('profile')}
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

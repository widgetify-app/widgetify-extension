import { useState } from 'react'
import { LuCircleUser } from 'react-icons/lu'
import { listenEvent } from '@/common/utils/call-event'
import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { UserAccountModal } from '../../setting/tabs/account/user-account.modal'

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
	const { user, isAuthenticated } = useAuth()
	const [showSettingsModal, setShowSettingsModal] = useState(false)

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

		return () => {
			event()
		}
	}, [])

	return (
		<>
			{!isAuth ? (
				<Tooltip content="ورود به حساب کاربری">
					<div
						className="relative flex items-center justify-center w-8 h-8 px-1 transition-all duration-300 rounded-full cursor-pointer hover:opacity-80 group hover:bg-primary/10"
						id="profile-and-friends-list"
						onClick={handleProfileClick}
					>
						<LuCircleUser
							size={20}
							className="text-muted group-hover:!text-primary"
						/>
					</div>
				</Tooltip>
			) : (
				<Tooltip content={getTooltipContent(user)}>
					<div className={containerClasses} onClick={handleProfileClick}>
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
		</>
	)
}

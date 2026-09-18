import { useEffect, useState } from 'react'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { useAuth } from '@/context/auth.context'
import { BottomSheet } from '@/components/ui'
import { FriendsDirectView } from '@/layouts/friends/components/friends-direct-view'
import { callEvent, listenEvent } from '@/common/utils/call-event'
import { FriendRequestsButton } from '@/layouts/friends/components/buttons/friend-requests.button'
import Analytics from '@/analytics'
import { Icon } from '@/icons'

const renderPendingNotification = (pendingCount: number) => (
	<div className="absolute flex items-center justify-center w-2 h-2 text-[.4rem] z-20 font-bold text-white bg-error rounded-full top-1 right-1 p-0.5 text-center">
		{pendingCount}
	</div>
)
export function FriendsListNavbar() {
	const { user, isAuthenticated } = useAuth()

	const [firstAuth, setFirstAuth] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const handleAuthModalClose = () => setFirstAuth(false)

	const clickToOpenSheet = () => {
		if (isOpen === false) {
			//current state
			Analytics.event('friends_navbar_opened')
		}

		setIsOpen(!isOpen)
	}

	useEffect(() => {
		const event = listenEvent('close_friends_bottomSheet', () => setIsOpen(false))
		return () => {
			event()
		}
	}, [])

	if (!isAuthenticated) {
		return null
	}

	const hasPendingRequests = (user?.friendshipStats?.pending ?? 0) > 0

	return (
		<>
			<div
				className="relative p-2 transition-all cursor-pointer nav-btn text-subtle hover:text-content active:scale-90"
				onClick={() => clickToOpenSheet()}
			>
				<Icon name="friends" size={15} />
				{hasPendingRequests &&
					renderPendingNotification(user?.friendshipStats?.pending || 0)}
			</div>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="medium">
				<div className="pt-2 h-[calc(50vh-2rem)]">
					<FriendsDirectView />
				</div>
			</BottomSheet>
			<AuthRequiredModal
				isOpen={firstAuth}
				onClose={handleAuthModalClose}
				title="ورود به حساب کاربری"
				message="برای دسترسی به بخش مدیریت دوستان اول وارد حسابت شو"
				loginButtonText="ورود به حساب"
				cancelButtonText="فعلا نه"
			/>
		</>
	)
}

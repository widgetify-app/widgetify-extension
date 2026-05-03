import { useState } from 'react'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { useAuth } from '@/context/auth.context'
import { HiUserGroup, HiUserPlus } from 'react-icons/hi2'
import { BottomSheet } from '@/components/bottom-sheet/bottom-sheet'
import { ActiveFriendsHorizontal } from '@/layouts/friends/components/activities'
import { callEvent } from '@/common/utils/call-event'
import { FriendRequestsButton } from '@/layouts/friends/components/buttons/friend-requests.button'

const renderPendingNotification = (pendingCount: number) => (
	<div className="absolute flex items-center justify-center w-2 h-2 text-[.4rem] z-20 font-bold text-white bg-red-500 rounded-full top-1 right-1 p-0.5 text-center">
		{pendingCount}
	</div>
)
export function FriendsListNavbar() {
	const { user, isAuthenticated } = useAuth()

	const [firstAuth, setFirstAuth] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const handleAuthModalClose = () => setFirstAuth(false)
	const handleOpenSettings = () => {
		if (!isAuthenticated) {
			setFirstAuth(true)
			return
		}
		callEvent('openProfile', 'friends')
	}
	if (!isAuthenticated) {
		return null
	}

	const hasPendingRequests = (user?.friendshipStats?.pending ?? 0) > 0

	return (
		<>
			<div
				className="relative p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
				onClick={() => setIsOpen(!isOpen)}
			>
				<HiUserGroup size={15} />
				{hasPendingRequests &&
					renderPendingNotification(user?.friendshipStats?.pending || 0)}
			</div>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} size="small">
				<div className="absolute flex items-center gap-1 w-fit left-4 top-2">
					<button
						onClick={(e) => {
							e.stopPropagation()
							handleOpenSettings()
							setIsOpen(false)
						}}
						className="flex items-center gap-1 px-2 py-1.5 transition-all border cursor-pointer rounded-xl bg-content text-content border-content active:scale-95 group group-hover:opacity-85"
					>
						<HiUserPlus
							size={14}
							className="text-base-content/90 group-hover:text-base-content/70"
						/>
					</button>
					<FriendRequestsButton
						size="small"
						pendingCount={user?.friendshipStats?.pending || 0}
					/>
				</div>
				<div className="mt-4">
					<ActiveFriendsHorizontal />
				</div>
			</BottomSheet>
			{firstAuth && (
				<AuthRequiredModal
					isOpen={firstAuth}
					onClose={handleAuthModalClose}
					title="ورود به حساب کاربری"
					message="برای دسترسی به بخش مدیریت دوستان، ابتدا وارد حساب کاربری خود شوید."
					loginButtonText="ورود به حساب"
					cancelButtonText="بعداً"
				/>
			)}
		</>
	)
}

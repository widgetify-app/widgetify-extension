import { useState, useRef } from 'react'
import { FiSettings, FiUserPlus } from 'react-icons/fi'
import { callEvent } from '@/common/utils/call-event'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { ClickableTooltip } from '@/components/clickableTooltip'
import { useAuth } from '@/context/auth.context'
import { useGetFriends } from '@/services/hooks/friends/friendService.hook'
import { FriendItem } from './friend.item'
import { HiUserGroup } from 'react-icons/hi2'

const renderFriendsDropdownContent = (
	friends: any[],
	activeProfileId: string | null,
	setActiveProfileId: (id: string | null) => void,
	onOpenSettings: () => void,
	setIsOpen: (isOpen: boolean) => void
) => (
	<div className="py-2 bg-content bg-glass min-w-[280px] rounded-2xl">
		<div className="px-3 pb-2 mb-2 border-b border-content">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">دوستان</h3>
				<button
					onClick={(e) => {
						e.stopPropagation()
						onOpenSettings()
						setIsOpen(false)
					}}
					className="p-1 transition-colors rounded-md cursor-pointer hover:bg-primary/10 group"
				>
					<FiSettings
						size={14}
						className="text-muted group-hover:!text-primary"
					/>
				</button>
			</div>
		</div>

		{friends.length === 0 ? (
			<div className="px-3 py-4 text-sm text-center text-muted">
				<FiUserPlus size={24} className="mx-auto mb-2 opacity-50" />
				<p>هنوز دوستی اضافه نکرده‌اید</p>
				<button
					onClick={(e) => {
						e.stopPropagation()
						onOpenSettings()
						setIsOpen(false)
					}}
					className="mt-2 text-xs text-primary hover:underline"
				>
					اضافه کردن دوست
				</button>
			</div>
		) : (
			<div className="overflow-y-auto max-h-64">
				<div className="grid grid-cols-2 gap-2 px-1 pb-1 md:grid-cols-3">
					{friends.map((friend) => (
						<div key={friend.id} className="flex justify-center">
							<FriendItem
								user={friend.user}
								activeProfileId={activeProfileId}
								setActiveProfileId={setActiveProfileId}
							/>
						</div>
					))}
				</div>
			</div>
		)}
	</div>
)

export function FriendsList() {
	const { isAuthenticated } = useAuth()

	const [firstAuth, setFirstAuth] = useState(false)
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)

	const { data: friendsData } = useGetFriends({
		status: 'ACCEPTED',
		enabled: isAuthenticated,
	})

	const friends = friendsData?.data.friends || []

	const handleOpenSettings = () => {
		callEvent('closeAllDropdowns')
		if (!isAuthenticated) {
			setFirstAuth(true)
			return
		}
		callEvent('openProfile')
	}

	const handleAuthModalClose = () => setFirstAuth(false)

	if (!isAuthenticated) {
		return null
	}

	return (
		<>
			<div
				ref={triggerRef}
				className="relative p-2 transition-all cursor-pointer nav-btn text-white/40 hover:text-white active:scale-90"
			>
				<HiUserGroup size={18} />
			</div>

			<ClickableTooltip
				triggerRef={triggerRef}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				content={renderFriendsDropdownContent(
					friends,
					activeProfileId,
					setActiveProfileId,
					handleOpenSettings,
					setIsOpen
				)}
				contentClassName="!p-0"
				closeOnClickOutside={true}
			/>

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

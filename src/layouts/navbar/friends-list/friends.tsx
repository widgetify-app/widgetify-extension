import { useState } from 'react'
import { FiSettings, FiUserPlus } from 'react-icons/fi'
import { HiUserGroup } from 'react-icons/hi'
import { callEvent } from '@/common/utils/call-event'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { Dropdown } from '@/components/dropdown'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGetFriends } from '@/services/hooks/friends/friendService.hook'
import { UserAccountModal } from '../../setting/tabs/account/user-account.modal'
import { FriendItem } from './friend.item'

const renderFriendsTrigger = () => (
	<Tooltip content="دوستان" position="bottom">
		<div className="relative flex items-center justify-center w-8 h-8 px-1 transition-all duration-300 rounded-full cursor-pointer hover:opacity-80 group hover:bg-primary/10">
			<HiUserGroup size={18} className="text-muted group-hover:!text-primary" />
		</div>
	</Tooltip>
)

const renderFriendsDropdownContent = (
	friends: any[],
	activeProfileId: string | null,
	setActiveProfileId: (id: string | null) => void,
	onOpenSettings: () => void
) => (
	<div className="py-2 bg-content bg-glass">
		<div className="px-3 pb-2 mb-2 border-b border-content">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">دوستان</h3>
				<button
					onClick={(e) => {
						e.stopPropagation()
						onOpenSettings()
					}}
					className="p-1 transition-colors rounded-md cursor-pointer hover:bg-primary/10 group"
					title="تنظیمات دوستان"
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
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)

	const { data: friendsData, refetch: refetchFriends } = useGetFriends({
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
		setShowSettingsModal(true)
	}

	const handleSettingsModalClose = () => {
		setShowSettingsModal(false)
		refetchFriends()
	}
	const handleAuthModalClose = () => setFirstAuth(false)

	if (!isAuthenticated) {
		return null
	}

	return (
		<>
			<Dropdown
				trigger={renderFriendsTrigger()}
				position="bottom-right"
				width="280px"
			>
				{renderFriendsDropdownContent(
					friends,
					activeProfileId,
					setActiveProfileId,
					handleOpenSettings
				)}
			</Dropdown>

			<UserAccountModal
				isOpen={showSettingsModal}
				onClose={handleSettingsModalClose}
			/>

			<AuthRequiredModal
				isOpen={firstAuth}
				onClose={handleAuthModalClose}
				title="ورود به حساب کاربری"
				message="برای دسترسی به بخش مدیریت دوستان، ابتدا وارد حساب کاربری خود شوید."
				loginButtonText="ورود به حساب"
				cancelButtonText="بعداً"
			/>
		</>
	)
}

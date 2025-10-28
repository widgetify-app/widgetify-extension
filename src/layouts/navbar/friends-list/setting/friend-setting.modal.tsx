import { BiUserCircle } from 'react-icons/bi'
import { FiGift, FiUserCheck, FiUsers } from 'react-icons/fi'
import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { useAuth } from '@/context/auth.context'
import { AllFriendsTab, FriendRequestsTab, ProfileTab, ReferralsTab } from './tabs'

interface FriendSettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab?: string | null
}

export const FriendSettingModal = ({
	isOpen,
	onClose,
	selectedTab,
}: FriendSettingModalProps) => {
	const { user } = useAuth()

	const tabs: TabItem[] = [
		{
			label: 'پروفایل من',
			value: 'profile',
			icon: <BiUserCircle size={20} />,
			element: user ? (
				<ProfileTab />
			) : (
				<div className="p-4 text-center text-content">
					برای مشاهده پروفایل خود ابتدا وارد حساب کاربری شوید
				</div>
			),
		},
		{
			label: 'همه دوستان',
			value: 'all',
			icon: <FiUsers size={20} />,
			element: <AllFriendsTab />,
		},
		{
			label: 'درخواست‌ها',
			value: 'requests',
			icon: <FiUserCheck size={20} />,
			element: <FriendRequestsTab />,
		},
		{
			label: 'دعوت‌نامه‌ها',
			value: 'referrals',
			icon: <FiGift size={20} />,
			element: <ReferralsTab />,
		},
	]

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			title="مدیریت دوستان"
			direction="rtl"
		>
			<TabManager
				tabOwner="user"
				tabs={tabs}
				defaultTab="all"
				selectedTab={selectedTab}
				direction="rtl"
			/>
		</Modal>
	)
}

import { BiUserCircle } from 'react-icons/bi'
import { FiGift, FiUserCheck, FiUsers } from 'react-icons/fi'
import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { AccountTab } from '@/layouts/setting/tabs/account/account'
import { AllFriendsTab, FriendRequestsTab, TasksTab } from './tabs'

interface FriendSettingModalProps {
	isOpen: boolean
	onClose: () => void
	selectedTab?: string | null
}
const tabs: TabItem[] = [
	{
		label: 'پروفایل من',
		value: 'profile',
		icon: <BiUserCircle size={20} />,
		element: <AccountTab />,
	},
	{
		label: 'ماموریت‌ها و پاداش',
		value: 'tasks',
		icon: <FiGift size={20} />,
		element: <TasksTab />,
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
]
export const FriendSettingModal = ({
	isOpen,
	onClose,
	selectedTab,
}: FriendSettingModalProps) => {
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

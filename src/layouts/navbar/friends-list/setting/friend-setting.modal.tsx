import Modal from '@/components/modal'
import { type TabItem, TabManager } from '@/components/tab-manager'
import { useAuth } from '@/context/auth.context'
import { useTheme } from '@/context/theme.context'
import { BiUserCircle } from 'react-icons/bi'
import { FiUserCheck, FiUsers } from 'react-icons/fi'
import { AllFriendsTab, FriendRequestsTab, ProfileTab } from './tabs'

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
  const { theme } = useTheme()
  const { user } = useAuth()

  const tabs: TabItem[] = [
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
      label: 'پروفایل من',
      value: 'profile',
      icon: <BiUserCircle size={20} />,
      element: user ? (
        <ProfileTab />
      ) : (
        <div className="p-4 text-center text-gray-500">
          برای مشاهده پروفایل خود ابتدا وارد حساب کاربری شوید
        </div>
      ),
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
        tabs={tabs}
        defaultTab="all"
        selectedTab={selectedTab}
        theme={theme}
        direction="rtl"
      />
    </Modal>
  )
}

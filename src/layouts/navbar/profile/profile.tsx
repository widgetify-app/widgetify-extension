import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { FriendSettingModal } from '../friends-list/setting/friend-setting.modal'
export function ProfileNav() {
	const { user, isAuthenticated } = useAuth()
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const handleProfileClick = () => {
		if (isAuthenticated) setShowSettingsModal(true)
	}

	if (!user) {
		return null
	}

	return (
		<>
			<Tooltip
				content={
					user.inCache ? (
						<span className="text-error">خطا در بارگیری پروفایل</span>
					) : (
						'پروفایل کاربری'
					)
				}
			>
				<div
					className={`flex items-center justify-center w-8 h-8 overflow-hidden transition-all border cursor-pointer border-content rounded-xl bg-content backdrop-blur-sm hover:opacity-80 ${user.inCache && 'ring-2 ring-error'} relative overflow-visible`}
					onClick={handleProfileClick}
				>
					{user?.avatar ? (
						<AvatarComponent url={user.avatar} size="xs" />
					) : (
						<span className="text-2xl font-bold text-content">
							{user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
						</span>
					)}
					{user?.friendshipStats?.pending > 0 && (
						<div className="absolute z-50 flex items-center justify-center w-4 h-4 text-[.6rem] font-bold text-white bg-red-500 rounded-full -bottom-1 -right-1 p-0.5 text-center">
							{user?.friendshipStats.pending}
						</div>
					)}
				</div>
			</Tooltip>
			<FriendSettingModal
				isOpen={showSettingsModal}
				selectedTab={'profile'}
				onClose={() => {
					setShowSettingsModal(false)
				}}
			/>
		</>
	)
}

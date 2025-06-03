import { FiChevronLeft, FiUsers } from 'react-icons/fi'
import { LiaUsersCogSolid } from 'react-icons/lia'
import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
//@ts-ignore
import 'swiper/css'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGetFriends } from '@/services/hooks/friends/friendService.hook'
import { useGetUserProfile } from '@/services/hooks/user/userService.hook'
import { useState } from 'react'
import { FriendItem } from './friend.item'
import { FriendSettingModal } from './setting/friend-setting.modal'

export function FriendsList() {
	const { data: user } = useGetUserProfile()
	const [showFriendsList, setShowFriendsList] = useState(false)
	const [firstAuth, setFirstAuth] = useState<boolean>(false)
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)
	const { isAuthenticated } = useAuth()

	const { data: friendsData, refetch: refetchFriends } = useGetFriends({
		status: 'ACCEPTED',
		enabled: isAuthenticated,
	})

	const friends = friendsData?.data.friends || []

	const handleOpenSettingsModal = () => {
		if (!isAuthenticated) {
			setFirstAuth(true)
			return
		}
		setShowSettingsModal(true)
	}
	return (
		<>
			<div
				className={
					'relative flex items-center  overflow-hidden px-2 gap-2 h-8 border-content transition-all border rounded-xl bg-content backdrop-blur-sm'
				}
				style={{ width: showFriendsList ? '190px' : '70px' }}
			>
				{showFriendsList && (
					<button
						className="top-0 left-0 z-10 flex items-center justify-center transition-opacity cursor-pointer text-muted opacity-80"
						onClick={() => setShowFriendsList(!showFriendsList)}
					>
						<FiChevronLeft size={16} />
					</button>
				)}
				{!showFriendsList && (
					<div className="flex items-center justify-around w-full">
						<Tooltip content="نمایش دوستان" position="bottom">
							<button
								className="p-0.5 cursor-pointer text-muted border-l border-gray-300/50 hover:opacity-80 hover:scale-105"
								onClick={() => setShowFriendsList(!showFriendsList)}
							>
								<FiUsers className="ml-1" size={16} />
								{}
							</button>
						</Tooltip>
						<span className="h-full w-0.5 px-0.5"></span>
						<Tooltip content="مدیریت دوستان">
							<button
								className="p-0.5 cursor-pointer relative text-muted hover:opacity-80 hover:scale-105"
								onClick={handleOpenSettingsModal}
							>
								<LiaUsersCogSolid size={18} />
								{user && user?.friendshipStats?.pending > 0 && (
									<div className="absolute flex items-center justify-center w-4 h-4 text-[.6rem] font-bold text-white bg-red-500 rounded-full -bottom-1 -right-1 p-0.5 text-center">
										{user?.friendshipStats.pending}
									</div>
								)}
							</button>
						</Tooltip>
					</div>
				)}{' '}
				<Swiper
					modules={[FreeMode, Navigation]}
					spaceBetween={2}
					slidesPerView={4}
					grabCursor={true}
					className="w-full user-list-slider"
					dir="ltr"
					navigation={{
						nextEl: '.user-list-next',
						prevEl: '.user-list-prev',
					}}
				>
					{showFriendsList
						? friends.map((friend) => (
								<SwiperSlide key={friend.id}>
									<FriendItem
										user={friend.user}
										activeProfileId={activeProfileId}
										setActiveProfileId={setActiveProfileId}
									/>
								</SwiperSlide>
							))
						: null}
				</Swiper>
			</div>

			<FriendSettingModal
				isOpen={showSettingsModal}
				onClose={() => {
					setShowSettingsModal(false)
					refetchFriends()
				}}
			/>
			<AuthRequiredModal
				isOpen={firstAuth}
				onClose={() => setFirstAuth(false)}
				title="ورود به حساب کاربری"
				message="برای دسترسی به بخش مدیریت دوستان، ابتدا وارد حساب کاربری خود شوید."
				loginButtonText="ورود به حساب"
				cancelButtonText="بعداً"
			/>
		</>
	)
}

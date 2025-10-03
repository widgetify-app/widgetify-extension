import { FiChevronLeft, FiUsers } from 'react-icons/fi'
import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
//@ts-expect-error
import 'swiper/css'
import { useState } from 'react'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { useGetFriends } from '@/services/hooks/friends/friendService.hook'
import { FriendItem } from './friend.item'
import { FriendSettingModal } from './setting/friend-setting.modal'

export function FriendsList() {
	const { isAuthenticated } = useAuth()

	const [showFriendsList, setShowFriendsList] = useState(false)
	const [firstAuth, setFirstAuth] = useState<boolean>(false)
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null)

	const { data: friendsData, refetch: refetchFriends } = useGetFriends({
		status: 'ACCEPTED',
		enabled: isAuthenticated,
	})

	const friends = friendsData?.data.friends || []

	return (
		<>
			<div
				className={
					'relative flex items-center justify-center overflow-hidden h-8 border-content transition-all border rounded-xl bg-content backdrop-blur-sm'
				}
				style={{ width: showFriendsList ? '190px' : '35px' }}
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
					<Tooltip content="نمایش دوستان" position="bottom">
						<div className="flex items-center justify-around w-full h-full">
							<button
								className="cursor-pointer text-muted hover:opacity-80 hover:scale-105"
								onClick={() => setShowFriendsList(!showFriendsList)}
							>
								<FiUsers size={18} />
								{}
							</button>
						</div>
					</Tooltip>
				)}
				{showFriendsList && (
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
				)}
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

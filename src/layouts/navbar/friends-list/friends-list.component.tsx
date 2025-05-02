import { Colors } from '@/common/constant/colors.constant'
import { FiChevronLeft, FiUsers } from 'react-icons/fi'
import { LiaUsersCogSolid } from 'react-icons/lia'
import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
//@ts-ignore
import 'swiper/css'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import Tooltip from '@/components/toolTip'
import { useAuth } from '@/context/auth.context'
import { getMainClient } from '@/services/api'
import { useEffect, useState } from 'react'
import { FriendItem } from './friend.item'
import { FriendSettingModal } from './setting/friend-setting.modal'

interface FriendUser {
	name: string
	avatar: string
	username: string
	userId: string
	extras?: {
		activity?: string
		selectedWallpaper?: string
	}
}

interface Friend {
	id: string
	user: FriendUser
	status: 'PENDING' | 'ACCEPTED'
}

interface FriendsResponse {
	data: {
		friends: Friend[]
		totalPages: number
	}
}

export function FriendsList() {
	const [friends, setFriends] = useState<Friend[]>([])
	const [showFriendsList, setShowFriendsList] = useState(false)
	const [firstAuth, setFirstAuth] = useState<boolean>(false)

	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated) {
			fetchFriends()
		}
	}, [isAuthenticated])

	const fetchFriends = async () => {
		if (!isAuthenticated) return

		try {
			const api = await getMainClient()
			const response = await api.get<FriendsResponse>('/friends?status=ACCEPTED')
			setFriends(response.data.data.friends)
		} catch (err) {
			console.error('Failed to fetch friends:', err)
		} finally {
		}
	}

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
				className={`relative flex items-center overflow-hidden px-2 gap-2 h-10 text-gray-300 transition-all border rounded-xl ${Colors.bgItemGlass}`}
				style={{ width: showFriendsList ? '190px' : '70px' }}
			>
				{showFriendsList && (
					<button
						className="top-0 left-0 z-10 flex items-center justify-center transition-opacity cursor-pointer opacity-80"
						onClick={() => setShowFriendsList(!showFriendsList)}
					>
						<FiChevronLeft size={16} />
					</button>
				)}

				{!showFriendsList && (
					<div className="flex w-full gap-2">
						<Tooltip content="نمایش دوستان" position="bottom">
							<button
								className="m-auto p-0.5 cursor-pointer"
								onClick={() => setShowFriendsList(!showFriendsList)}
							>
								<FiUsers className="ml-1" size={18} />
							</button>
						</Tooltip>
						<Tooltip content="مدیریت دوستان">
							<button
								className="m-auto p-0.5 cursor-pointer"
								onClick={handleOpenSettingsModal}
							>
								<LiaUsersCogSolid size={18} />
							</button>
						</Tooltip>
					</div>
				)}
				<Swiper
					modules={[FreeMode, Navigation]}
					spaceBetween={8}
					slidesPerView={3}
					freeMode={true}
					className="user-list-slider"
					dir="ltr"
					navigation={{
						nextEl: '.user-list-next',
						prevEl: '.user-list-prev',
					}}
				>
					{showFriendsList
						? friends.map((friend) => (
								<SwiperSlide key={friend.id} className="w-14 pt-0.5">
									<FriendItem user={friend.user} />
								</SwiperSlide>
							))
						: null}
					{/* <div className="absolute top-0 left-0 z-10 w-4 h-full pointer-events-none swiper-shadow-left"></div>
          <div className="absolute top-0 right-0 z-10 w-4 h-full pointer-events-none swiper-shadow-right"></div> */}
					{/* <div className="absolute left-0 z-10 flex items-center justify-center w-4 h-4 transition-opacity -translate-y-1/2 opacity-0 cursor-pointer top-1/2 user-list-prev user-list-slider-hover:opacity-70">
            <FiChevronLeft size={16} />
          </div>
          <div className="absolute right-0 z-10 flex items-center justify-center w-4 h-4 transition-opacity -translate-y-1/2 opacity-0 cursor-pointer top-1/2 user-list-next user-list-slider-hover:opacity-70">
            <FiChevronRight size={16} />
          </div> */}
				</Swiper>
			</div>

			<FriendSettingModal
				isOpen={showSettingsModal}
				onClose={() => {
					setShowSettingsModal(false)
					// Refresh friends list after closing the settings modal
					fetchFriends()
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

import { Colors } from '@/common/constant/colors.constant'
import { FiChevronLeft, FiUsers } from 'react-icons/fi'
import { LiaUsersCogSolid } from 'react-icons/lia'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation } from 'swiper/modules'
//@ts-ignore
import 'swiper/css'
import { FriendItem } from './friend.item'
import { useState } from 'react'
import Tooltip from '@/components/toolTip'

interface FriendUser {
	id: number
	name: string
	avatar: string
	activity?: string
}

export function FriendsList() {
	const users: FriendUser[] = [
		{
			id: 1,
			name: 'sajjadmrx',
			avatar: 'https://avatar.iran.liara.run/public/39',
			activity: '🏫 At Work',
		},
		{ id: 2, name: 'aliex', avatar: 'https://avatar.iran.liara.run/public/12' },
		{ id: 3, name: 'jaawsem', avatar: 'https://avatar.iran.liara.run/public/45' },
		{ id: 4, name: 'mohmammad213', avatar: 'https://avatar.iran.liara.run/public/23' },
		{ id: 5, name: 'salaar1231', avatar: 'https://avatar.iran.liara.run/public/56' },
	]
	const [showFriendsList, setShowFriendsList] = useState(false)

	return (
		<>
			<div
				className={`relative flex items-center overflow-hidden px-2 gap-2 h-10 text-gray-300 transition-all border rounded-xl ${Colors.bgItemGlass}`}
				style={{ width: showFriendsList ? '190px' : '70px' }}
			>
				{showFriendsList && (
					<button
						className="left-0 top-0 z-10  flex items-center justify-center opacity-80 transition-opacity cursor-pointer"
						onClick={() => setShowFriendsList(!showFriendsList)}
					>
						<FiChevronLeft size={16} />
					</button>
				)}

				{!showFriendsList && (
					<div className="flex gap-2  w-full">
						<Tooltip content="نمایش دوستان" position="bottom">
							<button
								className="m-auto p-0.5 cursor-pointer"
								onClick={() => setShowFriendsList(!showFriendsList)}
							>
								<FiUsers className="ml-1" size={18} />
							</button>
						</Tooltip>
						<Tooltip content="مدیریت دوستان">
							<button className="m-auto p-0.5 cursor-pointer">
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
						? users.map((user) => (
								<SwiperSlide key={user.id} className="w-14 pt-0.5">
									<FriendItem user={user} />
								</SwiperSlide>
							))
						: null}
					{/* <div className="absolute left-0 top-0 z-10 h-full w-4 pointer-events-none swiper-shadow-left"></div>
					<div className="absolute right-0 top-0 z-10 h-full w-4 pointer-events-none swiper-shadow-right"></div> */}
					{/* <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-4 h-4 flex items-center justify-center opacity-0 transition-opacity user-list-prev user-list-slider-hover:opacity-70 cursor-pointer">
						<FiChevronLeft size={16} />
					</div>
					<div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-4 h-4 flex items-center justify-center opacity-0 transition-opacity user-list-next user-list-slider-hover:opacity-70 cursor-pointer">
						<FiChevronRight size={16} />
					</div> */}
				</Swiper>
			</div>
		</>
	)
}

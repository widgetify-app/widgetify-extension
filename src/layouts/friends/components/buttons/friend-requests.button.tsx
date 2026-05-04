import { FiInbox } from 'react-icons/fi'
import { FriendRequestsBottomSheet } from '../friend-requests.bottomSheet'
import { HiOutlineInbox } from 'react-icons/hi2'

interface Prop {
	size: 'small' | 'large'
	pendingCount?: number
}
export function FriendRequestsButton({ size, pendingCount }: Prop) {
	const [isRequestsOpen, setIsRequestsOpen] = useState(false)

	return (
		<>
			{size === 'large' ? (
				<button
					onClick={() => setIsRequestsOpen(true)}
					className="flex items-center relative gap-2 px-3 py-1.5 transition-all border cursor-pointer rounded-xl bg-content text-content border-content active:scale-95"
					aria-label="درخواست‌های دوستی"
				>
					<FiInbox className="w-4 h-4" />
					<span className="text-sm font-medium">درخواست‌ها</span>
					{pendingCount ? (
						<div className="absolute flex items-center justify-center w-3 h-3 text-[.5rem] z-20 font-bold text-white bg-red-500 rounded-full -top-1 -right-1 p-0.5 text-center ">
							{pendingCount}
						</div>
					) : (
						''
					)}
				</button>
			) : (
				<button
					onClick={() => setIsRequestsOpen(true)}
					className="flex relative items-center gap-1 px-2 py-1.5 transition-all border cursor-pointer rounded-xl bg-content text-content border-content active:scale-95 group group-hover:opacity-85"
				>
					<HiOutlineInbox className="w-4 h-4 text-base-content/90 group-hover:text-base-content/70" />
					{pendingCount ? (
						<div className="absolute flex items-center justify-center w-3 h-3 text-[.5rem] z-20 font-bold text-white bg-red-500 rounded-full -top-1 -right-1 p-0.5 text-center ">
							{pendingCount}
						</div>
					) : (
						''
					)}
				</button>
			)}

			{isRequestsOpen && (
				<FriendRequestsBottomSheet
					isOpen
					onClose={() => setIsRequestsOpen(false)}
				/>
			)}
		</>
	)
}

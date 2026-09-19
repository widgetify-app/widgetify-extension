import { useState } from 'react'
import { FriendRequestsBottomSheet } from '../friend-requests.bottom-sheet'
import { Icon } from '@/icons'

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
					className="flex items-center relative gap-1.5 px-2.5 py-1 text-xs font-medium transition-all rounded-lg text-content hover:bg-hovered active:scale-95 cursor-pointer"
					aria-label="درخواست‌های دوستی"
				>
					<Icon name="inbox" size={14} />
					<span>درخواست‌ها</span>
					{pendingCount ? (
						<div className="flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-error rounded-full text-center">
							{pendingCount}
						</div>
					) : null}
				</button>
			) : (
				<button
					onClick={() => setIsRequestsOpen(true)}
					className="flex relative items-center justify-center w-8 h-8 transition-all rounded-xl bg-subtle hover:bg-hovered active:scale-90 cursor-pointer border border-subtle text-muted hover:text-content"
					aria-label="درخواست‌های دوستی"
					title="درخواست‌های دوستی"
				>
					<Icon
						name="outlineInbox"
						size={15}
						className="text-muted hover:text-content"
					/>
					{pendingCount ? (
						<div className="absolute flex items-center justify-center w-2 h-2 z-20 font-bold text-white bg-error rounded-full top-1 right-1" />
					) : null}
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

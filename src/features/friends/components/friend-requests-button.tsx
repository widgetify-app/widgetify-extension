import { useState } from 'react'
import { FriendRequestsBottomSheet } from './friend-requests-bottom-sheet'
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
					type="button"
					onClick={() => setIsRequestsOpen(true)}
					className="flex items-center relative gap-1.5 px-2.5 py-1 text-xs font-medium transition-ui rounded-lg text-fg hover:bg-fill-2 active:scale-95 cursor-pointer"
				>
					<Icon name="inbox" size={14} />
					<span>درخواست‌ها</span>
					{pendingCount ? (
						<div className="flex items-center justify-center min-w-4 h-4 px-1 text-3xs font-bold text-on-danger bg-danger rounded-full text-center">
							{pendingCount}
						</div>
					) : null}
				</button>
			) : (
				<button
					type="button"
					onClick={() => setIsRequestsOpen(true)}
					className="flex relative items-center justify-center w-8 h-8 transition-ui rounded-xl bg-fill hover:bg-fill-2 active:scale-90 cursor-pointer border border-line text-fg-muted hover:text-fg-strong"
					aria-label="درخواست‌های دوستی"
				>
					<Icon
						name="inbox"
						size={16}
						className="text-fg-muted hover:text-fg-strong"
					/>
					{pendingCount ? (
						<div className="absolute flex items-center justify-center w-2 h-2 z-20 font-bold text-on-danger bg-danger rounded-full top-1 right-1" />
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

import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { UserCardPortal } from '@/components/user/user-card-portal'
import type { FriendUser } from '@/services/getMethodHooks/friends/friendService.hook'
import { useRef, useState } from 'react'

interface FriendItemProps {
	user: FriendUser
}

export function FriendItem({ user }: FriendItemProps) {
	const [showProfile, setShowProfile] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div className="relative">
			<Tooltip content={user.extras?.activity || undefined}>
				<div
					ref={containerRef}
					className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105"
					onClick={() => setShowProfile(!showProfile)}
				>
					<AvatarComponent url={user.avatar} placeholder={user.username} size="xs" />
					<p className="w-full text-xs text-center truncate">{user.username}</p>
				</div>
			</Tooltip>

			<UserCardPortal
				user={user}
				isOpen={showProfile}
				onClose={() => setShowProfile(false)}
				triggerRef={containerRef as React.RefObject<HTMLElement>}
			/>
		</div>
	)
}

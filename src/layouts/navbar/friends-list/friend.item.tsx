import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import { UserCardPortal } from '@/components/user/user-card-portal'
import type { FriendUser } from '@/services/getMethodHooks/friends/friendService.hook'
import { useRef } from 'react'

interface FriendItemProps {
	user: FriendUser
	activeProfileId: string | null
	setActiveProfileId: (id: string | null) => void
}

export function FriendItem({
	user,
	activeProfileId,
	setActiveProfileId,
}: FriendItemProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const isActive = activeProfileId === user.userId

	const handleClick = () => {
		if (isActive) {
			setActiveProfileId(null)
		} else {
			setActiveProfileId(user.userId)
		}
	}

	return (
		<div className="relative">
			<Tooltip content={user.extras?.activity || undefined}>
				<div
					ref={containerRef}
					className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105"
					onClick={handleClick}
				>
					<AvatarComponent url={user.avatar} placeholder={user.username} size="xs" />
					<p className="w-full text-xs text-center truncate">{user.username}</p>
				</div>
			</Tooltip>

			<UserCardPortal
				user={user}
				isOpen={isActive}
				onClose={() => setActiveProfileId(null)}
				triggerRef={containerRef as React.RefObject<HTMLElement>}
			/>
		</div>
	)
}

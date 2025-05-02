import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import type { FriendUser } from '@/services/getMethodHooks/friends/friendService.hook'

interface FriendItemProps {
	user: FriendUser
}
export function FriendItem({ user }: FriendItemProps) {
	return (
		<>
			<Tooltip content={user.extras?.activity || undefined}>
				<div
					className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105"
					onClick={() => alert('user')}
				>
					<AvatarComponent url={user.avatar} placeholder={user.username} size="xs" />
					<p className="w-full text-xs text-center truncate">{user.username}</p>
				</div>
			</Tooltip>
		</>
	)
}

import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import type { FriendUser } from '@/services/getMethodHooks/friends/friendService.hook'

interface FriendItemProps {
	user: FriendUser
}
export function FriendItem({ user }: FriendItemProps) {
	return (
		<>
			<Tooltip content={user.name}>
				<div
					className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105"
					onClick={() => alert('user')}
				>
					<div className="w-6 h-6 overflow-hidden border rounded-full border-gray-600/40">
						<AvatarComponent url={user.avatar} placeholder={user.username} size="sm" />
					</div>
					<p className="w-full text-xs text-center truncate">{user.username}</p>
				</div>
			</Tooltip>
		</>
	)
}

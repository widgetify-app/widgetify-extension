import { AvatarComponent } from '@/components/avatar.component'
import Tooltip from '@/components/toolTip'
import type { FriendUser } from '@/services/hooks/friends/friendService.hook'

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
	const isActive = activeProfileId === user.userId

	const handleClick = () => {
		if (isActive) {
			setActiveProfileId(null)
		} else {
			setActiveProfileId(user.userId)
		}
	}

	return (
		<div className="relative flex justify-center">
			<Tooltip
				content={
					<div className="flex flex-col items-center justify-center h-auto gap-2 max-w-32 min-w-32">
						<div className="flex items-center justify-center w-full gap-2 pb-1 border-b border-gray-300/50">
							<p className="text-xs text-center truncate" dir="ltr">
								{user.username}
							</p>
							<AvatarComponent
								url={user.avatar}
								placeholder={user.username}
								size="xs"
							/>
						</div>
						<div className="flex items-center justify-center w-full">
							<p className="w-full text-xs wrap-break-word">
								{user.extras?.activity || undefined}
							</p>
						</div>
					</div>
				}
			>
				<div
					className="flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:scale-105 group"
					onClick={handleClick}
				>
					<AvatarComponent
						url={user.avatar}
						placeholder={user.username}
						size="xs"
					/>
					<span
						className={`mt-1 text-xs text-center truncate w-14 ${
							isActive
								? 'text-primary font-medium'
								: 'text-muted group-hover:!text-primary/50'
						}`}
						dir="ltr"
					>
						{user.name}
					</span>
				</div>
			</Tooltip>
		</div>
	)
}

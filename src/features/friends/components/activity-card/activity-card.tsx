import { AvatarComponent } from '@/components/ui'
import type { AttachmentReaction } from '@/services/friends/friend-service.hook'
import { ActivityBubble } from './activity-bubble'
import { ActivityReactionSelector } from './activity-reaction-selector'

interface ActivityCardProps {
	id: string
	avatar: string
	name: string
	activity: string
	onClick?: () => void
	isSelf: boolean
	reactions: AttachmentReaction[]
	index: number
}

export const ActivityCard = ({
	index,
	id,
	avatar,
	name,
	activity,
	onClick,
	isSelf,
	reactions,
}: ActivityCardProps) => {
	const content = (
		<>
			<div className="relative flex flex-col items-center">
				<ActivityBubble
					isInteractive={Boolean(onClick)}
					badge={
						isSelf ? null : (
							<ActivityReactionSelector
								reactions={reactions}
								activityId={id}
								index={index}
							/>
						)
					}
				>
					<p
						className="line-clamp-3 wrap-break-word text-shadow-2xs"
						dir="auto"
					>
						{activity}
					</p>
				</ActivityBubble>

				<div className="-mt-3">
					<div
						className={`
							rounded-full transition-ui ring-2 ring-surface-3
							${onClick ? '' : ''}
						`}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="sm"
							className="object-cover w-16 h-16 rounded-full"
						/>
					</div>
				</div>
			</div>

			<p className="w-full px-1 mt-2 text-xs font-medium text-center truncate text-fg">
				{name}
			</p>
		</>
	)

	const className = 'flex flex-col items-center justify-end pt-4 shrink-0 group'

	if (!onClick) return <div className={className}>{content}</div>

	return (
		<button type="button" onClick={onClick} className={className}>
			{content}
		</button>
	)
}

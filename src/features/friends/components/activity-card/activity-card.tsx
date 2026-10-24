import { t } from '@/common/i18n'
import { AvatarComponent } from '@/components/ui'
import type { AttachmentReaction } from '@/services/friends/friend-service.hook'
import { ProfileCardTrigger } from '../profile-card/profile-card-trigger'
import { ActivityBubble } from './activity-bubble'
import { ActivityReactionSelector } from './activity-reaction-selector'

interface ActivityCardProps {
	id: string
	avatar: string
	name: string
	activity: string
	color?: string | null
	onClick?: () => void
	isSelf: boolean
	reactions: AttachmentReaction[]
	index: number
	caption?: string
	isNew?: boolean
	username?: string
}

export const ActivityCard = ({
	index,
	id,
	avatar,
	name,
	activity,
	color,
	onClick,
	isSelf,
	reactions,
	caption,
	isNew = false,
	username,
}: ActivityCardProps) => {
	const identity = (
		<>
			<div className="rounded-full ring-2 ring-surface-3">
				<AvatarComponent
					url={avatar}
					placeholder={name}
					size="sm"
					className="object-cover w-16 h-16 rounded-full"
				/>
			</div>
			<p className="flex items-center justify-center w-full gap-1 px-1 mt-2 text-xs font-medium text-center text-fg">
				{isNew && (
					<span
						role="img"
						aria-label={t('friends.activity.new')}
						className="rounded-full size-1.5 shrink-0 bg-brand"
					/>
				)}
				<span className="truncate">{name}</span>
			</p>
		</>
	)

	const content = (
		<>
			<ActivityBubble
				color={color}
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
				<p className="line-clamp-3 wrap-break-word text-shadow-2xs" dir="auto">
					{activity}
				</p>
			</ActivityBubble>

			{username ? (
				<ProfileCardTrigger
					username={username}
					name={name}
					className="flex flex-col items-center w-full -mt-3"
				>
					{identity}
				</ProfileCardTrigger>
			) : (
				<div className="flex flex-col items-center w-full -mt-3">{identity}</div>
			)}

			{caption && (
				<p className="w-full px-1 text-center truncate text-3xs text-fg-faint">
					{caption}
				</p>
			)}
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

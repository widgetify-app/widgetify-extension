import { AvatarComponent } from '@/components/avatar.component'
import { Dropdown } from '@/components/dropdown'
import {
	type AttachmentReaction,
	type ReactionKey,
	useGetActivityReactions,
	useUpsertActivityReaction,
} from '@/services/hooks/friends/friendService.hook'
import { useEffect, useState } from 'react'
import { GetContentFromReactions, RenderReactionContent } from './activity-reaction'
import { safeAwait } from '@/services/api'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'
import { playAlarm } from '@/common/playAlarm'

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
	return (
		<button
			onClick={onClick}
			className="flex flex-col items-center shrink-0 group"
			type="button"
		>
			<div className="relative flex flex-col items-center">
				<div className="relative w-24 h-16">
					<div
						className={`
							w-full h-full text-[10px] px-2 py-1 rounded-2xl 
							leading-tight text-center overflow-hidden transition-all
							bg-content shadow-md text-base-content/80
							${onClick ? 'group-hover:scale-95 cursor-pointer z-10' : ''}
						`}
					>
						<div
							className="flex items-center justify-center w-full h-full overflow-y-auto wrap-break-word scrollbar-none text-shadow-2xs"
							dir="auto"
						>
							{activity}
						</div>
					</div>

					<div className="absolute w-2 h-2 -translate-x-3 rounded-full -bottom-0.5 left-7 bg-base-300/40  z-10" />
					<div className="absolute w-2 h-2 -translate-x-3 rounded-full  -bottom-3.5 left-8 bg-base-300/40 shadow-md  z-10" />
					<div className="absolute z-10 w-2 h-2 -translate-x-3 rounded-full shadow-md bg-base-300 -bottom-6 left-10" />
					{isSelf ? null : (
						<ActivityReactionSelector
							reactions={reactions}
							activityId={id}
							index={index}
						/>
					)}
				</div>

				<div className="-mt-1">
					<div
						className={`
							rounded-full transition-all ring-2 ring-base-300
							${onClick ? '' : ''}
						`}
					>
						<AvatarComponent
							url={avatar}
							placeholder={name}
							size="sm"
							className="object-cover w-12 h-12 rounded-full"
						/>
					</div>
				</div>
			</div>

			<p className="w-full px-1 mt-2 text-xs font-medium text-center truncate text-content">
				{name}
			</p>
		</button>
	)
}

interface Prop {
	reactions: AttachmentReaction[]
	activityId: string
	index: number
}
function ActivityReactionSelector({ reactions, activityId, index }: Prop) {
	const [enable, setEnable] = useState(index < 3)
	const { data, isPending } = useGetActivityReactions(activityId, enable)
	const [selectedReaction, setSelectedReaction] = useState<ReactionKey | null>(null)
	const { mutateAsync, isPending: isUpdating } = useUpsertActivityReaction()
	useEffect(() => {
		if (data?.currentUser?.reaction) {
			setSelectedReaction(data.currentUser.reaction as ReactionKey)
		}

		return () => {
			setEnable(false)
		}
	}, [data])

	const handleReaction = async (reactionKey: ReactionKey) => {
		if (reactionKey === selectedReaction) return

		const [error, _] = await safeAwait(mutateAsync({ activityId, reactionKey }))
		if (error) {
			const content = translateError(error)
			showToast(content as string, 'error')
		} else {
			setSelectedReaction(reactionKey)
			playAlarm('reaction')
		}
	}

	const reacted = !!selectedReaction
	return (
		<Dropdown
			trigger={
				<div
					className={`flex  items-center justify-center w-5 h-5 text-xs text-center transition-all duration-200 rounded-full shadow-sm active:scale-95 bg-base-300/40 ${reacted ? 'opacity-85' : 'opacity-50'}`}
					onClick={() => setEnable(true)}
				>
					{reacted
						? RenderReactionContent(
								GetContentFromReactions(
									selectedReaction || undefined,
									reactions
								)?.content || ''
							)
						: reactions[0]?.content}
				</div>
			}
			className="absolute! top-0! left-0!"
		>
			<div className="flex items-center justify-around w-full h-10 gap-1 px-2 py-1 overflow-x-auto shadow-lg">
				{isPending
					? Array.from({ length: 5 }).map((_, i) => (
							<div
								key={`skeleton-reaction-${i}`}
								className={`transition-transform duration-150 cursor-pointer active:scale-95 focus:outline-none `}
							>
								<div className="w-4 h-4 bg-content/10 rounded-xl skeleton" />
							</div>
						))
					: reactions.map((reaction, index) => (
							<button
								key={index}
								disabled={isUpdating}
								onClick={() => handleReaction(reaction.id)}
								className={`h-5.5 w-5.5 rounded-full ${isUpdating && 'opacity-45'}  ${selectedReaction === reaction.id ? 'bg-primary/30' : 'opacity-85'} transition-transform   duration-150 cursor-pointer active:scale-95 focus:outline-none hover:bg-primary/20`}
							>
								<p
									className={` leading-6.5 ${selectedReaction === reaction.id && 'scale-85'}`}
								>
									{RenderReactionContent(reaction.content)}
								</p>
							</button>
						))}
			</div>
		</Dropdown>
	)
}

import { useEffect, useState } from 'react'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { playAlarm } from '@/common/utils/play-alarm'
import { translateError } from '@/common/utils/translate-error'
import { Dropdown } from '@/components/ui'
import { safeAwait } from '@/services/api'
import {
	type AttachmentReaction,
	type ReactionKey,
	useGetActivityReactions,
	useUpsertActivityReaction,
} from '@/services/friends/friend-service.hook'
import { GetContentFromReactions, RenderReactionContent } from './activity-reaction'

interface ActivityReactionSelectorProps {
	reactions: AttachmentReaction[]
	activityId: string
	index: number
}

const SKELETON_COUNT = 5

export function ActivityReactionSelector({
	reactions,
	activityId,
	index,
}: ActivityReactionSelectorProps) {
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
		if (reactionKey === selectedReaction) {
			callEvent('closeAllDropdowns')
			return
		}

		const [error] = await safeAwait(mutateAsync({ activityId, reactionKey }))
		if (error) {
			showToast(translateError(error) as string, 'error')
			return
		}
		setSelectedReaction(reactionKey)
		playAlarm('reaction')
		callEvent('closeAllDropdowns')
	}

	const reacted = selectedReaction !== null
	const selectedContent = GetContentFromReactions(
		selectedReaction || undefined,
		reactions
	)?.content

	return (
		<Dropdown
			position="top-left"
			trigger={
				<button
					type="button"
					aria-label={t('friends.activity.reactAria')}
					className={cn(
						'grid rounded-full shadow-sm cursor-pointer size-6 place-items-center text-xs transition-ui active:scale-90',
						reacted
							? 'bg-brand-fill-2 ring-1 ring-brand-muted'
							: 'bg-surface-3 text-fg-faint hover:bg-fill-3'
					)}
					onClick={() => setEnable(true)}
				>
					{reacted
						? RenderReactionContent(selectedContent || '')
						: reactions[0]?.content}
				</button>
			}
			className="absolute! -top-2! -left-2!"
			dropdownClassName="rounded-full! bg-surface-3! shadow-lg"
		>
			<div className="flex items-center gap-0.5 px-1.5 py-1">
				{isPending
					? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
							<div
								key={`skeleton-reaction-${i}`}
								className="rounded-full size-9 skeleton"
							/>
						))
					: reactions.map((reaction) => {
							const isSelected = selectedReaction === reaction.id
							return (
								<button
									type="button"
									key={reaction.id}
									disabled={isUpdating}
									aria-pressed={isSelected}
									onClick={() => handleReaction(reaction.id)}
									className={cn(
										'grid text-xl rounded-full cursor-pointer size-9 place-items-center transition-ui hover:scale-125 active:scale-95 disabled:opacity-50 focus-visible:focus-ring',
										isSelected &&
											'bg-brand-fill-2 ring-1 ring-brand-muted'
									)}
								>
									{RenderReactionContent(reaction.content, 'size-6')}
								</button>
							)
						})}
			</div>
		</Dropdown>
	)
}

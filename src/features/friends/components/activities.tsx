import { type ReactNode, useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ScrollRow } from '@/components/ui'
import {
	useGetActivities,
	useGetActivityReactions,
} from '@/services/friends/friend-service.hook'
import { useAuth } from '@/context/auth.context'
import { t } from '@/common/i18n'
import { ActivityCard } from './activity-card/activity-card'
import { ManageActivityModal } from './activity-card/manage-activity-modal'
import { EmptyActivityCard } from './activity-card/empty-activity-card'
import { reactionCaption, rememberSeen, unseenIds } from '../utils/activity-seen'

export const ActiveFriendsHorizontal = ({ trailing }: { trailing?: ReactNode }) => {
	const { user } = useAuth()
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

	const { data: activitiesData, isLoading } = useGetActivities()

	const currentUserActivity = activitiesData?.currentUser
	const ownReactionCount = currentUserActivity?.reactionCount ?? 0
	const newIds = useNewActivityIds(
		activitiesData?.activities?.map((activity) => activity.activityId)
	)

	const { data: ownReactions } = useGetActivityReactions(
		currentUserActivity?.activityId ?? '',
		ownReactionCount > 0
	)

	const caption = reactionCaption(ownReactionCount, ownReactions?.reactions[0]?.name)
	const ownCaption =
		caption?.kind === 'count'
			? t('friends.activity.reactionCount', { count: caption.count })
			: caption?.kind === 'one'
				? t('friends.activity.reactedOne', { name: caption.name })
				: caption?.kind === 'many'
					? t('friends.activity.reactedMany', {
							name: caption.name,
							others: caption.others,
						})
					: undefined

	if (isLoading) {
		return (
			<div className="space-y-2">
				<div className="flex gap-5 px-1 pb-2 overflow-x-auto scrollbar-none">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="flex flex-col items-center shrink-0"
						>
							<div className="z-10 w-24 h-12 bg-surface-3 rounded-xl skeleton" />
							<div className="w-16 h-16 -mt-3 rounded-full bg-surface-3 skeleton" />
							<div className="w-20 h-3 mt-2 rounded-sm bg-surface-3 skeleton" />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-1">
			<ScrollRow gap="md">
				{user &&
					(currentUserActivity ? (
						<ActivityCard
							avatar={user.avatar || ''}
							name={t('friends.you')}
							activity={currentUserActivity.content || ''}
							color={currentUserActivity.color}
							onClick={() => setIsBottomSheetOpen(true)}
							reactions={activitiesData.attachments?.reactions || []}
							isSelf
							id={currentUserActivity.activityId}
							index={5}
							caption={ownCaption}
						/>
					) : (
						<EmptyActivityCard
							avatar={user.avatar || ''}
							name={t('friends.you')}
							onClick={() => setIsBottomSheetOpen(true)}
						/>
					))}

				{activitiesData?.activities?.map((activity, index) => (
					<ActivityCard
						key={activity.activityId}
						index={index}
						id={activity.activityId}
						isSelf={false}
						avatar={activity.avatar || ''}
						name={activity.name}
						activity={activity.content.trim()}
						color={activity.color}
						reactions={activitiesData.attachments?.reactions || []}
						isNew={newIds.includes(activity.activityId)}
						username={activity.username ?? undefined}
					/>
				))}

				{trailing}
			</ScrollRow>

			{user && (
				<ManageActivityModal
					isOpen={isBottomSheetOpen}
					onClose={() => setIsBottomSheetOpen(false)}
					avatar={user.avatar || ''}
					currentActivity={
						currentUserActivity
							? {
									id: currentUserActivity.activityId,
									content: currentUserActivity.content || '',
									color: currentUserActivity.color,
								}
							: null
					}
					reactions={activitiesData?.attachments?.reactions || []}
					templates={activitiesData?.attachments?.templates || []}
				/>
			)}
		</div>
	)
}

function useNewActivityIds(currentIds: string[] | undefined) {
	const [newIds, setNewIds] = useState<string[]>([])
	const key = currentIds?.join(',')

	useEffect(() => {
		if (!currentIds?.length) return

		getFromStorage('seenFriendActivities').then((seen) => {
			setNewIds(unseenIds(currentIds, seen ?? []))
			setToStorage('seenFriendActivities', rememberSeen(seen ?? [], currentIds))
		})
	}, [key])

	return newIds
}

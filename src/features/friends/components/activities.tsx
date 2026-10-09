import { useState } from 'react'
import { ScrollRow } from '@/components/ui'
import { useGetActivities } from '@/services/friends/friend-service.hook'
import { useAuth } from '@/context/auth.context'
import { t } from '@/common/i18n'
import { ActivityCard } from './activity-card/activity-card'
import { ManageActivityModal } from './activity-card/manage-activity-modal'
import { EmptyActivityCard } from './activity-card/empty-activity-card'

export const ActiveFriendsHorizontal = () => {
	const { user } = useAuth()
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

	const { data: activitiesData, isLoading } = useGetActivities()

	const currentUserActivity = activitiesData?.currentUser

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
							onClick={() => setIsBottomSheetOpen(true)}
							reactions={activitiesData.attachments?.reactions || []}
							isSelf
							id={currentUserActivity.activityId}
							index={5}
						/>
					) : (
						<EmptyActivityCard
							avatar={user.avatar || ''}
							name={t('friends.you')}
							onClick={() => setIsBottomSheetOpen(true)}
						/>
					))}

				{activitiesData?.activities?.map((activity, index) => {
					return (
						<ActivityCard
							index={index}
							id={activity.activityId}
							isSelf={false}
							key={`activity-avatar-${index}`}
							avatar={activity.avatar || ''}
							name={activity.name}
							activity={activity.content.trim()}
							reactions={activitiesData.attachments?.reactions || []}
						/>
					)
				})}
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

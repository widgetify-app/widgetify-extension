import { useState } from 'react'
import { useGetActivities } from '@/services/hooks/friends/friendService.hook'
import { useAuth } from '@/context/auth.context'
import { ActivityCard } from './activity-card/activity-card'
import { ManageActivityBottomSheet } from './activity-card/manage-activity.bottomSheet'
import { EmptyActivityCard } from './activity-card/empty-activity-card'
import { Dropdown } from '@/components/dropdown'

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
							<div className="z-10 w-24 h-12 bg-content/10 rounded-xl skeleton" />
							<div className="w-12 h-12 -mt-2 rounded-full bg-content/10 skeleton" />
							<div className="w-20 h-3 mt-2 rounded bg-content/10 skeleton" />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-1">
			<div className="flex h-40 gap-4 px-1 pb-2 mt-1 overflow-x-auto">
				{user &&
					(currentUserActivity ? (
						<Dropdown
							trigger={
								<ActivityCard
									avatar={user.avatar || ''}
									name={'شما'}
									activity={currentUserActivity?.content || ''}
									onClick={() => setIsBottomSheetOpen(true)}
								/>
							}
							position="top-right"
						>
							<ManageActivityBottomSheet
								isOpen={isBottomSheetOpen}
								onClose={() => setIsBottomSheetOpen(false)}
								currentActivity={
									currentUserActivity
										? {
												content:
													currentUserActivity?.content || '',
												id: currentUserActivity?.activityId || '',
											}
										: null
								}
							/>
						</Dropdown>
					) : (
						<Dropdown
							trigger={
								<EmptyActivityCard
									avatar={user.avatar || ''}
									name={'شما'}
									onClick={() => setIsBottomSheetOpen(true)}
								/>
							}
							position="top-right"
						>
							<ManageActivityBottomSheet
								isOpen={isBottomSheetOpen}
								onClose={() => setIsBottomSheetOpen(false)}
								currentActivity={null}
							/>
						</Dropdown>
					))}

				{activitiesData?.activities?.map((activity) => {
					return (
						<ActivityCard
							key={activity.avatar}
							avatar={activity.avatar || ''}
							name={activity.name}
							activity={activity.content.trim()}
						/>
					)
				})}
			</div>
		</div>
	)
}

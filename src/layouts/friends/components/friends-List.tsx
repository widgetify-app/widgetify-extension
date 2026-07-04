import { AvatarComponent } from '@/components/avatar.component'
import { type Friend, useGetFriends } from '@/services/hooks/friends/friendService.hook'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FriendEmptyList } from './empty-list.friend'

interface PaginatedFriendsListProps {
	status: 'PENDING' | 'ACCEPTED'
	itemsPerPage?: number
	// @ts-expect-error
	renderFriendActions: (friend: Friend) => JSX.Element
	emptyMessage: string
	loading?: boolean
	caching: boolean
}

export const FriendsList = ({
	status,
	itemsPerPage = 10,
	renderFriendActions,
	emptyMessage,
	caching,
}: PaginatedFriendsListProps) => {
	const {
		data: friendsData,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useGetFriends({
		status,
		limit: itemsPerPage,
		caching: caching,
	})

	const { containerRef, loadMoreRef } = useInfiniteScroll({
		hasNextPage: hasNextPage ?? false,
		isFetchingNextPage,
		fetchNextPage,
		direction: 'vertical',
		threshold: 0.1,
	})

	const allFriends = friendsData?.pages.flatMap((page) => page.data.friends) || []

	if (isLoading) {
		return (
			<div className="space-y-1">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center justify-between p-3 border rounded-xl border-content bg-background animate-pulse"
					>
						<div className="flex items-center flex-1 min-w-0 gap-3">
							<div className="w-12 h-12 rounded-full skeleton" />
							<div className="flex-1 space-y-2">
								<div className="w-1/3 h-3 rounded skeleton" />
								<div className="w-1/4 h-2 rounded skeleton" />
							</div>
						</div>
						<div className="w-16 h-8 rounded-lg skeleton" />
					</div>
				))}
			</div>
		)
	}

	if (allFriends.length === 0) {
		return <FriendEmptyList emptyMessage={emptyMessage} />
	}

	return (
		<div
			className="h-full px-4 pb-4 mt-3 space-y-2 overflow-y-auto touch-pan-y scrollbar-none"
			ref={containerRef}
		>
			{allFriends.map((friend) => (
				<div
					key={`f-${friend.id}`}
					className="flex items-center justify-between p-3 transition-all duration-200 border rounded-xl border-content hover:shadow-sm"
				>
					<div className="flex items-center flex-1 min-w-0 gap-1.5">
						<div className="relative shrink-0">
							<div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-base-300">
								<AvatarComponent
									url={friend.user.avatar}
									placeholder={friend.user.name}
									size="md"
									className="object-cover w-full h-full"
								/>
							</div>
						</div>

						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium truncate text-content">
								{friend.user.name}
							</div>
							<div className="text-xs truncate text-base-content/60">
								{friend.user.username}@
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 shrink-0">
						{renderFriendActions(friend)}
					</div>
				</div>
			))}

			{hasNextPage && (
				<div ref={loadMoreRef} className="flex flex-col gap-1 shrink-0">
					{isFetchingNextPage && MakeSkeleton(2)}
				</div>
			)}
		</div>
	)
}

function MakeSkeleton(count: number) {
	return [...Array(count)].map((_, catIdx) => (
		<div
			key={`loading-${catIdx}`}
			className="w-full border h-14 rounded-xl skeleton bg-base-content/5 border-content"
		></div>
	))
}

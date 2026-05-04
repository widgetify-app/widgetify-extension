import { AvatarComponent } from '@/components/avatar.component'
import { useGetFriends, type Friend } from '@/services/hooks/friends/friendService.hook'
import { FriendEmptyList } from './empty-list.friend'

interface SelectFriendBottomSheetProps {
	onChange: (friends: Friend[]) => void
	title?: string
	selectedFriendIds?: string[]
}

export function SelectFriendLayout({
	onChange,
	selectedFriendIds = [],
}: SelectFriendBottomSheetProps) {
	const { data: friendsData, isLoading } = useGetFriends({
		status: 'ACCEPTED',
		page: 1,
		limit: 100,
		caching: true,
	})

	const friends = friendsData?.pages.flatMap((page) => page.data.friends) || []

	const handleToggleFriend = (friend: Friend) => {
		const isSelected = selectedFriendIds.includes(friend.id)

		let nextSelectedIds: string[]
		let nextSelectedFriends: Friend[]

		if (isSelected) {
			nextSelectedIds = selectedFriendIds.filter((id) => id !== friend.id)
		} else {
			nextSelectedIds = [...selectedFriendIds, friend.id]
		}

		nextSelectedFriends = friends.filter((f) => nextSelectedIds.includes(f.id))

		onChange(nextSelectedFriends)
	}

	return (
		<div className="h-full pl-0.5 overflow-y-auto">
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="w-6 h-6 border-2 rounded-full border-primary border-t-transparent animate-spin" />
				</div>
			) : friends.length === 0 ? (
				<FriendEmptyList emptyMessage="هنوز دوستی نداری." />
			) : (
				<div className="flex flex-col gap-1">
					{friends.map((friend) => {
						const isSelected = selectedFriendIds.includes(friend.id)

						return (
							<div
								key={friend.id}
								onClick={() => handleToggleFriend(friend)}
								className={`
									w-full flex items-center gap-3 p-2 rounded-2xl
									transition-all duration-200
									border cursor-pointer
									${
										isSelected
											? 'bg-primary/10 border-primary'
											: 'hover:bg-base-content/5 border-base-content/10 hover:border-base-content/20 active:scale-95'
									}
								`}
							>
								<div className="shrink-0">
									<div className="w-8 h-8 overflow-hidden rounded-full ring-2 ring-base-300">
										<AvatarComponent
											url={friend.user.avatar}
											placeholder={friend.user.name}
											size="md"
											className="object-cover w-full h-full"
										/>
									</div>
								</div>

								<div className="flex-1 min-w-0 text-right">
									<div
										className={`font-medium truncate ${
											isSelected ? 'text-primary' : 'text-content'
										}`}
									>
										{friend.user.name}
									</div>
									<div
										className={`text-sm truncate ${
											isSelected
												? 'text-primary/70'
												: 'text-content'
										}`}
										dir="ltr"
									>
										@{friend.user.username}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

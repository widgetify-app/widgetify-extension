import { useState } from 'react'
import { AvatarComponent } from '@/components/avatar.component'
import { useGetFriends, type Friend } from '@/services/hooks/friends/friendService.hook'
import { FiCheck } from 'react-icons/fi'
import Modal from '@/components/modal'

interface SelectFriendBottomSheetProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (friend: Friend) => void
	title?: string
	selectedFriendId?: string
}

export function SelectFriendBottomSheet({
	isOpen,
	onClose,
	onSelect,
	title = 'انتخاب دوست',
	selectedFriendId,
}: SelectFriendBottomSheetProps) {
	const [searchQuery, setSearchQuery] = useState('')

	const { data: friendsData, isLoading } = useGetFriends({
		status: 'ACCEPTED',
		page: 1,
		limit: 100,
		caching: true,
	})

	const friends = friendsData?.pages.flatMap((page) => page.data.friends) || []

	// Filter friends based on search
	const filteredFriends = friends.filter((friend) => {
		const query = searchQuery.toLowerCase().trim()
		if (!query) return true

		return (
			friend.user.name.toLowerCase().includes(query) ||
			friend.user.username.toLowerCase().includes(query)
		)
	})

	const handleSelectFriend = (friend: Friend) => {
		onSelect(friend)
		setSearchQuery('')
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="xl" title={title}>
			<div className="flex flex-col h-full">
				<div className="flex-1 overflow-y-auto scrollbar-none">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="w-6 h-6 border-2 rounded-full border-primary border-t-transparent animate-spin" />
						</div>
					) : filteredFriends.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-content">
								<span className="text-2xl">🔍</span>
							</div>
							<p className="text-content/70">
								{searchQuery
									? 'دوستی با این نام پیدا نشد'
									: 'هنوز دوستی اضافه نکرده‌اید'}
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-1 mt-2">
							{filteredFriends.map((friend) => {
								const isSelected = selectedFriendId === friend.id

								return (
									<button
										key={friend.id}
										onClick={() => handleSelectFriend(friend)}
										className={`
											w-full flex items-center gap-3 p-2 rounded-xl
											transition-all duration-200
											${
												isSelected
													? 'bg-primary/10 border-primary'
													: 'bg-background hover:bg-base-content/5 border border-base-content/10 hover:border-base-content/20 active:scale-95'
											}
										`}
										type="button"
									>
										<div className="shrink-0">
											<div
												className={`
												w-8 h-8 rounded-full overflow-hidden
												${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200' : ''}
											`}
											>
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
													isSelected
														? 'text-primary'
														: 'text-content'
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

										{isSelected && (
											<div className="shrink-0">
												<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
													<FiCheck className="w-4 h-4 text-primary-content" />
												</div>
											</div>
										)}
									</button>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}

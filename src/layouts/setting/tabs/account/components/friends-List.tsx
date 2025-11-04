import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { AvatarComponent } from '@/components/avatar.component'
import { Button } from '@/components/button/button'
import { type Friend, useGetFriends } from '@/services/hooks/friends/friendService.hook'

interface PaginatedFriendsListProps {
	status: 'PENDING' | 'ACCEPTED'
	itemsPerPage?: number
	// @ts-expect-error
	renderFriendActions: (friend: Friend) => JSX.Element
	emptyMessage: string
	loading?: boolean
}

export const FriendsList = ({
	status,
	itemsPerPage = 10,
	renderFriendActions,
	emptyMessage,
	loading = false,
}: PaginatedFriendsListProps) => {
	const [currentPage, setCurrentPage] = useState(1)

	const {
		data: friendsData,
		isLoading,
		isFetching,
	} = useGetFriends({
		status,
		page: currentPage,
		limit: itemsPerPage,
	})

	const friends = friendsData?.data.friends || []
	const totalPages = friendsData?.data.totalPages || 1

	const goToNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1)
		}
	}

	const goToPrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1)
		}
	}

	if (isLoading || loading) {
		return <div className="p-4 text-center">در حال بارگذاری...</div>
	}

	if (friends.length === 0) {
		return <div className="p-4 text-center text-content">{emptyMessage}</div>
	}

	return (
		<div className="space-y-2">
			{friends.map((friend) => (
				<div
					key={friend.id}
					className={
						'flex items-center justify-between p-3 border rounded-lg border-content'
					}
				>
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 mr-3 overflow-hidden rounded-full">
							<AvatarComponent
								url={friend.user.avatar}
								placeholder={friend.user.name}
								size="md"
								className="object-cover w-full h-full"
							/>
						</div>
						<div>
							<div className={'font-medium text-content'}>
								{friend.user.name}
							</div>
							<div className={'text-sm text-content opacity-70'} dir="ltr">
								@{friend.user.username}
							</div>
						</div>
					</div>
					{renderFriendActions(friend)}
				</div>
			))}

			{totalPages > 1 && (
				<div className="flex items-center justify-center mt-4 space-x-2">
					<Button
						onClick={() => goToPrevPage()}
						disabled={currentPage === 1 || isFetching}
						size="xs"
						className="btn-soft"
						isPrimary={currentPage !== 1}
					>
						<FiChevronRight
							size={18}
							className={`${currentPage === 1 ? 'text-muted' : 'text-primary'}`}
						/>
					</Button>
					<span className="mx-2">
						صفحه {currentPage} از {totalPages}
					</span>
					<Button
						onClick={() => goToNextPage()}
						disabled={currentPage === totalPages || isFetching}
						className="btn-soft"
						isPrimary={true}
						size="xs"
					>
						<FiChevronLeft size={18} className="text-primary" />
					</Button>
				</div>
			)}
		</div>
	)
}

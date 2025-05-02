import { getBorderColor, getTextColor, useTheme } from '@/context/theme.context'
import {
	type Friend,
	useGetFriends,
} from '@/services/getMethodHooks/friends/friendService.hook'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface PaginatedFriendsListProps {
	status: 'PENDING' | 'ACCEPTED'
	itemsPerPage?: number
	// @ts-ignore
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
	const { theme } = useTheme()
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
		return <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
	}

	return (
		<div className="space-y-2">
			<div className="space-y-2">
				{friends.map((friend) => (
					<div
						key={friend.id}
						className={`flex items-center justify-between p-3 border rounded-lg ${getBorderColor(theme)}`}
					>
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 mr-3 overflow-hidden rounded-full">
								<img
									src={friend.user.avatar}
									alt={friend.user.name}
									className="object-cover w-full h-full"
								/>
							</div>
							<div>
								<div className={`font-medium ${getTextColor(theme)}`}>
									{friend.user.name}
								</div>
								<div className={`text-sm ${getTextColor(theme)} opacity-70`} dir="ltr">
									@{friend.user.username}
								</div>
							</div>
						</div>
						{renderFriendActions(friend)}
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center mt-4 space-x-2">
					<button
						onClick={goToPrevPage}
						disabled={currentPage === 1 || isFetching}
						className={`p-2 rounded-lg ${
							currentPage === 1
								? 'text-gray-400'
								: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
						}`}
					>
						<FiChevronRight size={18} />
					</button>
					<span className="mx-2">
						صفحه {currentPage} از {totalPages}
					</span>
					<button
						onClick={goToNextPage}
						disabled={currentPage === totalPages || isFetching}
						className={`p-2 rounded-lg ${
							currentPage === totalPages
								? 'text-gray-400'
								: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
						}`}
					>
						<FiChevronLeft size={18} />
					</button>
				</div>
			)}
		</div>
	)
}

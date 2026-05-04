import { UserItem } from './friend-item.todo'

interface Prop {
	owner: {
		name: string
		avatar: string
		isSelf: boolean
	}
	currentTodoCompleted: boolean
	friends: {
		avatar: string
		completed: boolean
		name: string
		isSelf: boolean
	}[]
}
export function TodoFriends({ friends, owner, currentTodoCompleted }: Prop) {
	return (
		<div className="flex items-center py-1 mb-1 -space-x-2 avatar-group">
			{owner && (
				<UserItem
					isOwner
					avatar={owner.avatar}
					completed={currentTodoCompleted}
					name={owner.name}
				/>
			)}
			{friends.map((friend, index) => (
				<UserItem
					isOwner={false}
					key={`t-f-${index}`}
					avatar={friend.avatar}
					name={friend.name}
					completed={friend.completed}
				/>
			))}
		</div>
	)
}

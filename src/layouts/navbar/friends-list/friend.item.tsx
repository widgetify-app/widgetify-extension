import Tooltip from '@/components/toolTip'

interface FriendItemProps {
	user: any
}
export function FriendItem({ user }: FriendItemProps) {
	return (
		<>
			<Tooltip content={user.activity || undefined}>
				<div
					className="flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-105"
					onClick={() => alert('user')}
				>
					<div className="w-6 h-6 overflow-hidden rounded-full border border-gray-600/40">
						<img
							className="object-cover w-full h-full"
							src={user.avatar}
							alt={user.name}
						/>
					</div>
					<p className="w-full text-xs truncate text-center">{user.name}</p>
				</div>
			</Tooltip>
		</>
	)
}

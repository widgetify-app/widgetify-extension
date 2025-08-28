import { AvatarComponent } from '@/components/avatar.component'
import { UserCardPortal } from '@/components/user/user-card-portal'
import type { TopUser } from '@/services/hooks/pomodoro/getTopUsers.hook'

interface TopUserItemProps {
	user: TopUser
	index: number
	setActiveProfileId: (id: string | null) => void
	activeProfileId: string | null
}
export function TopUserItem({
	user,
	index,
	activeProfileId,
	setActiveProfileId,
}: TopUserItemProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const isActive = activeProfileId === user.id

	const rank = index + 1
	const style = rank <= 3 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
	return (
		<>
			<div
				className="flex items-center gap-3 p-2 transition-all cursor-pointer rounded-2xl bg-content hover:scale-95"
				onClick={() => setActiveProfileId(user.id)}
				ref={containerRef}
			>
				<AvatarComponent url={user.avatar} size="sm" />
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium truncate text-content">
						{user.name}
					</p>
					<p className="text-xs text-muted">{user.duration} دقیقه تمرکز</p>
				</div>

				<div
					className={`flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 ${style}`}
				>
					<span className="text-xs font-bold">{rank}</span>
				</div>
			</div>

			<UserCardPortal
				user={{
					avatar: user.avatar,
					name: user.name,
					username: user.username,
					friendshipStatus: user.friendshipStatus,
					isSelf: user.isSelf,
				}}
				isOpen={isActive}
				onClose={() => setActiveProfileId(null)}
				triggerRef={containerRef as React.RefObject<HTMLElement>}
			/>
		</>
	)
}

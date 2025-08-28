import { AvatarComponent } from '@/components/avatar.component'
import type { TopUser } from '@/services/hooks/pomodoro/getTopUsers.hook'

interface TopUserItemProps {
	user: TopUser
	index: number
}
export function TopUserItem({ user, index }: TopUserItemProps) {
	const rank = index + 1
	const style = rank <= 3 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
	return (
		<div
			key={user.user}
			className="flex items-center gap-3 p-2 rounded-2xl bg-content"
		>
			<AvatarComponent url={user.avatar} size="sm" />
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate text-content">{user.user}</p>
				<p className="text-xs text-muted">{user.duration} دقیقه تمرکز</p>
			</div>

			<div
				className={`flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 ${style}`}
			>
				<span className="text-xs font-bold">{rank}</span>
			</div>
		</div>
	)
}

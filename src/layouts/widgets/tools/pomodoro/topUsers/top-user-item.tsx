import { FaCrown } from 'react-icons/fa'
import { AvatarComponent } from '@/components/avatar.component'
import { UserCardPortal } from '@/components/user/user-card-portal'
import type { TopUser } from '@/services/hooks/pomodoro/getTopUsers.hook'

interface TopUserItemProps {
	user: TopUser
	rank: number
	setActiveProfileId: (id: string | null) => void
	activeProfileId: string | null
}
export function TopUserItem({
	user,
	rank,
	activeProfileId,
	setActiveProfileId,
}: TopUserItemProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const isActive = activeProfileId === user.id
	const crownColors: Record<number, string> = {
		1: 'text-yellow-400',
		2: 'text-gray-400',
		3: 'text-amber-600',
	}

	const style = rank <= 3 ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'

	const convertToHours = (duration: number) => {
		const hours = Math.floor(duration / 60)
		const minutes = duration % 60
		return `${hours} ساعت و ${minutes} دقیقه`
	}

	const duration: string =
		user.duration > 500 ? convertToHours(user.duration) : `${user.duration} دقیقه`

	return (
		<>
			<div
				className={`relative flex items-center gap-2 p-2 transition-all cursor-pointer rounded-2xl bg-content hover:scale-95  shadow-md hover:shadow-none`}
				onClick={() => setActiveProfileId(user.id)}
				ref={containerRef}
			>
				{rank <= 3 && (
					<FaCrown
						className={`absolute top-1 rotate-12 right-1 w-4 h-4 ${crownColors[rank]} shadow-md`}
					/>
				)}
				<AvatarComponent
					url={user.avatar}
					size="sm"
					className="outline-2 outline-offset-0 outline-primary/30"
				/>
				<div className="relative flex-1 min-w-0">
					<p className="text-sm font-medium truncate text-content">
						{user.name}
					</p>
					<p className="text-xs text-muted">{duration}</p>
				</div>

				<div
					className={`flex items-center justify-center flex-shrink-0 rounded-full w-7 h-7 ${style} ${user.isSelf && 'outline-2 outline-dashed'}`}
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

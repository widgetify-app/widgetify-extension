import { AvatarComponent } from '@/components/ui'
import { UserCardPortal } from '../components/user-card-portal'
import type { TopUser } from '@/services/hooks/pomodoro/get-top-users.hook'
import { Icon } from '@/icons'

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
		1: 'text-medal-gold',
		2: 'text-medal-silver',
		3: 'text-medal-bronze',
	}

	const style =
		rank <= 3 ? 'bg-success-subtle text-success' : 'bg-brand-subtle text-primary'

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
				className={`relative flex items-center gap-2 p-2 cursor-pointer rounded-2xl bg-content transition-ui hover:scale-95 shadow-md hover:shadow-none`}
				onClick={() => setActiveProfileId(user.id)}
				ref={containerRef}
			>
				{rank <= 3 && (
					<Icon
						name="crown"
						className={`absolute top-1 rotate-12 right-1 w-4 h-4 ${crownColors[rank]} shadow-md`}
					/>
				)}
				<AvatarComponent
					url={user.avatar}
					size="sm"
					className="outline-2 outline-offset-0 outline-brand-muted"
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

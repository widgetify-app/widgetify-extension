import { AvatarComponent } from '@/components/ui'
import { UserCardPortal } from '../../components/user-card-portal'
import type { TopUser } from '@/services/pomodoro/get-top-users.hook'
import { cn } from '@/common/utils/cn'

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
	const containerRef = useRef<HTMLButtonElement>(null)
	const isActive = activeProfileId === user.id
	const convertToHours = (duration: number) => {
		const hours = Math.floor(duration / 60)
		const minutes = duration % 60
		return `${hours} ساعت و ${minutes} دقیقه`
	}

	const duration: string =
		user.duration > 500 ? convertToHours(user.duration) : `${user.duration} دقیقه`

	return (
		<>
			<button
				type="button"
				className={cn(
					'flex items-center w-full gap-2.5 px-2 text-start rounded-xl cursor-pointer min-h-9.5 transition-ui focus-visible:focus-ring',
					user.isSelf ? 'bg-brand-fill' : 'hover:bg-fill'
				)}
				onClick={() => setActiveProfileId(user.id)}
				ref={containerRef}
			>
				<span className="w-4 font-bold text-center text-2xs text-fg-faint tabular-nums">
					{rank}
				</span>
				<AvatarComponent url={user.avatar} size="sm" />
				<span className="flex-1 min-w-0 text-xs font-semibold truncate text-fg">
					{user.name}
				</span>
				<span className="text-3xs text-fg-faint whitespace-nowrap">
					{duration}
				</span>
			</button>

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

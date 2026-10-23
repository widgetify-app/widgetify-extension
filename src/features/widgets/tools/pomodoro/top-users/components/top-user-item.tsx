import { t } from '@/common/i18n'
import { AvatarComponent } from '@/components/ui'
import { ProfileCardTrigger } from '@/features/friends/friends'
import type { TopUser } from '@/services/pomodoro/get-top-users.hook'
import { cn } from '@/common/utils/cn'

interface TopUserItemProps {
	user: TopUser
	rank: number
}
export function TopUserItem({ user, rank }: TopUserItemProps) {
	const convertToHours = (duration: number) => {
		const hours = Math.floor(duration / 60)
		const minutes = duration % 60
		return t('widgets.pomodoro.leaderboard.hoursMinutes', {
			p0: hours,
			p1: minutes,
		})
	}

	const duration: string =
		user.duration > 500
			? convertToHours(user.duration)
			: t('widgets.pomodoro.leaderboard.minutesOnly', {
					p0: user.duration,
				})

	const rowClassName = cn(
		'flex items-center w-full gap-2.5 px-2 text-start rounded-xl min-h-9.5 transition-ui',
		user.isSelf ? 'bg-brand-fill' : 'hover:bg-fill'
	)

	const row = (
		<>
			<span className="w-4 font-bold text-center text-2xs text-fg-faint tabular-nums">
				{rank}
			</span>
			<AvatarComponent url={user.avatar} size="sm" />
			<span className="flex-1 min-w-0 text-xs font-semibold truncate text-fg">
				{user.name}
			</span>
			<span className="text-3xs text-fg-faint whitespace-nowrap">{duration}</span>
		</>
	)

	if (!user.username) return <div className={rowClassName}>{row}</div>

	return (
		<ProfileCardTrigger
			username={user.username}
			name={user.name}
			className={rowClassName}
		>
			{row}
		</ProfileCardTrigger>
	)
}

import { Button } from '@/components/button/button'
import type { Friend } from '@/services/hooks/friends/friendService.hook'
import { Icon } from '@/src/icons'

type Props = {
	friend: Friend
	onClick: (friendId: string) => void
	disabled?: boolean
	label?: string
}

export function RemoveFriendButton({ friend, onClick, disabled, label }: Props) {
	return (
		<Button
			type="button"
			onClick={() => onClick(friend.id)}
			disabled={disabled}
			size="sm"
			className="
				flex items-center justify-center gap-1
				h-9 px-3
				text-error bg-error/10 border border-error/20
				rounded-lg transition-all
				hover:bg-error/20 hover:scale-[1.03]
				active:scale-[0.97]
				disabled:opacity-50 disabled:cursor-not-allowed
			"
		>
			<Icon name="userX" size={16} />
			<span className="text-xs font-medium">{label || 'حذف'}</span>
		</Button>
	)
}

import { Button } from '@/components/ui'
import type { Friend } from '@/services/friends/friend-service.hook'
import { Icon } from '@/icons'
import { t } from '@/common/i18n'

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
			variant="outline"
			color="danger"
			rounded="lg"
			className="
				gap-1
				h-9 px-3
				hover:scale-[1.03]
				active:scale-[0.97]
				disabled:cursor-not-allowed
			"
		>
			<Icon name="userX" size={16} />
			<span className="text-xs font-medium">{label || t('friends.remove')}</span>
		</Button>
	)
}

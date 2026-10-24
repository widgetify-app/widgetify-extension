import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { useCongratulateFriend } from '@/services/friends/friend-service.hook'

interface CongratulateButtonProps {
	username: string
	name: string
	className?: string
}

export function CongratulateButton({
	username,
	name,
	className,
}: CongratulateButtonProps) {
	const congratulate = useCongratulateFriend()

	return (
		<Button
			size="xs"
			rounded="lg"
			color="brand"
			className={className}
			aria-label={t('friends.birthday.congratulateAria', { name })}
			loading={congratulate.isPending}
			onClick={() =>
				congratulate.mutate(username, {
					onSuccess: () => {
						Analytics.event('friends_birthday_congratulated')
						showToast(t('friends.birthday.sent', { name }), 'success')
					},
					onError: (error) => {
						const message = translateError(error)
						showToast(
							typeof message === 'string'
								? message
								: t('friends.card.loadFailed'),
							'error'
						)
					},
				})
			}
		>
			<Icon name="gift" size={12} />
			{t('friends.birthday.congratulate')}
		</Button>
	)
}

export function BirthdayBadge() {
	return (
		<span
			role="img"
			aria-label={t('friends.birthday.badge')}
			className="absolute grid rounded-full -bottom-1 -end-1 size-4 place-items-center bg-brand text-on-brand ring-2 ring-surface"
		>
			<Icon name="gift" size={10} />
		</span>
	)
}

import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { Button } from '@/components/ui'
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
			{t('friends.birthday.congratulate')}
		</Button>
	)
}

export function BirthdayBadge() {
	return (
		<span
			role="img"
			aria-label={t('friends.birthday.badge')}
			className="absolute -bottom-1 -end-1 text-xs leading-none"
		>
			🎂
		</span>
	)
}

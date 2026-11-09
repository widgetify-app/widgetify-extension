import { t } from '@/common/i18n'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { SettingRow, ToggleSwitch } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import {
	useGetFriendPrivacy,
	useUpdateFriendPrivacy,
} from '@/services/friends/friend-service.hook'

export function HiddenModeSwitch() {
	const { isAuthenticated } = useAuth()
	const { data, isLoading } = useGetFriendPrivacy(isAuthenticated)
	const update = useUpdateFriendPrivacy()
	const hidden = data?.hiddenFromSuggestions ?? false

	const onToggle = () => {
		if (!isAuthenticated) {
			showToast(t('setting.privacy.autocompleteLoginRequired'), 'error')
			return
		}

		update.mutate(
			{ hiddenFromSuggestions: !hidden },
			{
				onSuccess: (result) =>
					Analytics.event('friends_visibility_changed', {
						hidden: result.hiddenFromSuggestions,
					}),
				onError: () => showToast(t('friends.privacy.saveFailed'), 'error'),
			}
		)
	}

	return (
		<SettingRow
			label={t('friends.privacy.hiddenTitle')}
			hint={t('friends.privacy.hiddenHint')}
		>
			<ToggleSwitch
				label={t('friends.privacy.hiddenTitle')}
				enabled={hidden}
				onToggle={onToggle}
				disabled={isAuthenticated && isLoading}
				loading={update.isPending}
			/>
		</SettingRow>
	)
}

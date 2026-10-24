import { t } from '@/common/i18n'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { ToggleSwitch } from '@/components/ui'
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
		<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-fill">
			<div className="flex-1 space-y-1">
				<h3 className="text-sm font-medium text-fg">
					{t('friends.privacy.hiddenTitle')}
				</h3>
				<p className="text-xs font-normal leading-relaxed text-fg-muted">
					{t('friends.privacy.hiddenHint')}
				</p>
			</div>
			<div className="shrink-0 pt-0.5">
				<ToggleSwitch
					label={t('friends.privacy.hiddenTitle')}
					enabled={hidden}
					onToggle={onToggle}
					disabled={isAuthenticated && isLoading}
					loading={update.isPending}
				/>
			</div>
		</div>
	)
}

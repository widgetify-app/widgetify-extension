import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { ToggleSwitch } from '@/components/ui'
import {
	useGetFriendPrivacy,
	useUpdateFriendPrivacy,
} from '@/services/friends/friend-service.hook'

export function HiddenModeSetting() {
	const { data, isLoading } = useGetFriendPrivacy()
	const update = useUpdateFriendPrivacy()
	const hidden = data?.hiddenFromSuggestions ?? false

	const toggle = () =>
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

	return (
		<div className="flex items-center gap-3 p-3 mb-3 border rounded-2xl border-line bg-fill">
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium text-fg-strong">
					{t('friends.privacy.hiddenTitle')}
				</p>
				<p className="text-xs leading-relaxed text-fg-muted">
					{t('friends.privacy.hiddenHint')}
				</p>
			</div>
			<ToggleSwitch
				enabled={hidden}
				label={t('friends.privacy.hiddenTitle')}
				disabled={isLoading}
				loading={update.isPending}
				onToggle={toggle}
			/>
		</div>
	)
}

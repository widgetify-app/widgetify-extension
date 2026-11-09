import { t } from '@/common/i18n'
import Analytics from '@/analytics'
import { autoFormatErrorToast, showToast } from '@/common/toast'
import { SettingRow, ToggleSwitch } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/extension/update-setting.hook'

export function SearchAutocompleteSwitch() {
	const { isAuthenticated, user } = useAuth()
	const { mutateAsync, isPending } = useUpdateSearchAutocomplete()

	const onToggle = async () => {
		if (!isAuthenticated) {
			showToast(t('setting.privacy.autocompleteLoginRequired'), 'error')
			return
		}

		Analytics.event('search_autocomplete_toggled')
		const [er] = await safeAwait(
			mutateAsync({ isActive: !user?.searchAutocompleteEnabled })
		)
		if (er) {
			autoFormatErrorToast(er)
		}
	}

	return (
		<SettingRow
			label={t('setting.privacy.autocompleteLabel')}
			hint={t('setting.privacy.autocompleteHint')}
		>
			<ToggleSwitch
				label={t('setting.privacy.autocompleteLabel')}
				enabled={user?.searchAutocompleteEnabled || false}
				onToggle={onToggle}
				disabled={isPending}
				loading={isPending}
			/>
		</SettingRow>
	)
}

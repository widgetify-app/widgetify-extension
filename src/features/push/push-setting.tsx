import { useState } from 'react'
import { t } from '@/common/i18n'
import { SettingRow, ToggleSwitch } from '@/components/ui'
import { pushAvailable } from './utils/push'
import { usePushActions } from './hooks/use-push-actions'
import { usePushState } from './hooks/use-push-state'

export function PushSetting() {
	const state = usePushState()
	const { turnOn, turnOff } = usePushActions()
	const [busy, setBusy] = useState(false)

	if (!pushAvailable() || !state.signedIn) return null

	const enabled = state.enabledHere && state.preferenceOn

	const toggle = () => {
		setBusy(true)

		const done = enabled ? turnOff() : turnOn()

		done.finally(() => setBusy(false))
	}

	return (
		<SettingRow label={t('push.setting.title')} hint={t('push.setting.hint')}>
			<ToggleSwitch
				label={t('push.setting.title')}
				enabled={enabled}
				loading={busy || !state.ready}
				onToggle={toggle}
			/>
		</SettingRow>
	)
}

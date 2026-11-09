import { useState } from 'react'
import { t } from '@/common/i18n'
import { SectionPanel, ToggleSwitch } from '@/components/ui'
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
		<SectionPanel title={t('push.setting.title')} size="sm">
			<div className="flex">
				<p className="flex-1 ml-1 text-sm font-light leading-relaxed text-fg-muted">
					{t('push.setting.hint')}
				</p>
				<ToggleSwitch
					label={t('push.setting.title')}
					enabled={enabled}
					loading={busy || !state.ready}
					onToggle={toggle}
				/>
			</div>
		</SectionPanel>
	)
}

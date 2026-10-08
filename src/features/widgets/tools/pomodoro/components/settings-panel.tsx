import { Modal } from '@/components/ui'
import type { PomodoroSettings } from '../types'
import { PomodoroSettingsForm } from './settings-form'
import { t } from '@/common/i18n'

interface PomodoroSettingsPanelProps {
	isOpen: boolean
	onClose: () => void
	settings: PomodoroSettings
	onUpdateSettings: (settings: PomodoroSettings) => void
}

export function PomodoroSettingsPanel({
	isOpen,
	onClose,
	settings,
	onUpdateSettings,
}: PomodoroSettingsPanelProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="sm"
			title={t('widgets.pomodoro.settings.panelTitle')}
			closeLabel={t('ui.common.close')}
		>
			<div className="flex flex-col gap-3">
				<p className="text-xs leading-relaxed text-fg-muted">
					{t('widgets.pomodoro.settings.panelHint')}
				</p>
				<PomodoroSettingsForm settings={settings} onChange={onUpdateSettings} />
			</div>
		</Modal>
	)
}

import { Modal } from '@/components/ui'
import type { PomodoroSettings } from '../types'
import { PomodoroSettingsForm } from './settings-form'

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
		<Modal isOpen={isOpen} onClose={onClose} size="sm" title="تنظیمات تایمر">
			<div className="flex flex-col gap-3">
				<p className="text-xs leading-relaxed text-fg-muted">
					هر تغییری همین الان روی تایمر می‌شینه.
				</p>
				<PomodoroSettingsForm settings={settings} onChange={onUpdateSettings} />
			</div>
		</Modal>
	)
}

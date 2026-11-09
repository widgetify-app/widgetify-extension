import { t } from '@/common/i18n'
import { SettingRow, SettingsGroup, ToggleSwitch } from '@/components/ui'
import { SelectCity } from '@/components/select-city'
import { TimezoneSettings } from './components/timezone-settings'
import { StorageUsage } from './components/storage-usage'
import { useGeneralSetting } from '@/context/general-setting.context'
import Analytics from '@/analytics'
import { PushSetting } from '@/features/push/push-setting'

export function GeneralSettingTab() {
	const { isOptimalMode, updateSetting } = useGeneralSetting()

	const toggleOptimal = () => {
		updateSetting('isOptimalMode', !isOptimalMode)
		Analytics.event('toggle_optimalMode')
	}

	return (
		<div className="flex flex-col gap-5">
			<SettingsGroup title={t('setting.general.groupPlace')}>
				<SelectCity variant="row" />
				<TimezoneSettings />
			</SettingsGroup>
			<SettingsGroup title={t('setting.general.groupBehavior')}>
				<SettingRow
					label={t('setting.general.liteModeLabel')}
					hint={t('setting.general.liteModeHint')}
				>
					<ToggleSwitch
						label={t('setting.general.liteModeLabel')}
						enabled={isOptimalMode}
						onToggle={toggleOptimal}
					/>
				</SettingRow>
				<PushSetting />
			</SettingsGroup>
			<StorageUsage />
		</div>
	)
}

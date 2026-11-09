import { t } from '@/common/i18n'
import { SelectBox, SettingRow, Spinner } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTimezones } from '@/services/timezone/get-timezones.hook'

export function TimezoneSettings() {
	const { selected_timezone: timezone, setTimezone } = useGeneralSetting()
	const { data: timezones, isLoading, error } = useTimezones()
	const handleSelectTimezone = (value: string) => {
		const selectedTimezone = timezones?.find((tz) => tz.value === value)
		if (!selectedTimezone) return
		setTimezone(selectedTimezone)
	}

	return (
		<SettingRow label={t('setting.timezone.label')}>
			{isLoading ? (
				<Spinner size="sm" />
			) : error ? (
				<p className="text-xs text-danger">{t('setting.timezone.loadError')}</p>
			) : (
				<SelectBox
					label={t('setting.timezone.label')}
					optionalText={t('setting.timezone.placeholder')}
					options={(timezones ?? []).map((tz) => ({
						value: tz.value,
						label: `${tz.label} (${tz.offset})`,
					}))}
					value={timezone.value}
					onChange={handleSelectTimezone}
				/>
			)}
		</SettingRow>
	)
}

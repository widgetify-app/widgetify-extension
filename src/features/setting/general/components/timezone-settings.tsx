import { SectionPanel, SelectBox, Spinner } from '@/components/ui'
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
		<SectionPanel title="منطقه‌ی زمانی" delay={0.1} size="sm">
			<div className="space-y-3">
				<p className={'text-sm text-fg-muted'}>منطقه‌ی زمانی‌ت رو انتخاب کن.</p>

				<div className="relative">
					<div className="flex items-center gap-2">
						{isLoading ? (
							<div className="flex justify-center w-full p-3">
								<Spinner size="lg" />
							</div>
						) : error ? (
							<div className="w-full p-3 text-center text-danger">
								نتونستیم فهرست منطقه‌های زمانی رو بیاریم
							</div>
						) : (
							<SelectBox
								label="منطقه‌ی زمانی"
								optionalText="انتخاب منطقه زمانی..."
								options={(timezones ?? []).map((tz) => ({
									value: tz.value,
									label: `${tz.label} (${tz.offset})`,
								}))}
								value={timezone.value}
								onChange={handleSelectTimezone}
								className="w-full text-xs"
							/>
						)}
					</div>
				</div>
			</div>
		</SectionPanel>
	)
}

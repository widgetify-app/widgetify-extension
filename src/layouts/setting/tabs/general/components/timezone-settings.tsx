import { SectionPanel } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useTimezones } from '@/services/hooks/timezone/get-timezones.hook'

export function TimezoneSettings() {
	const { selected_timezone: timezone, setTimezone } = useGeneralSetting()
	const { data: timezones, isLoading, error } = useTimezones()
	const handleSelectTimezone = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTimezone = timezones?.find((tz) => tz.value === e.target.value)
		if (!selectedTimezone) return
		setTimezone(selectedTimezone)
	}

	return (
		<SectionPanel title="منطقه‌ی زمانی" delay={0.1} size="sm">
			<div className="space-y-3">
				<p className={'text-sm text-ds-fg-muted'}>
					منطقه‌ی زمانی مورد نظر خود را انتخاب کنید.
				</p>

				<div className="relative">
					<div className="flex items-center gap-2">
						{isLoading ? (
							<div className="flex justify-center w-full p-3">
								<div className="w-6 h-6 border-2 border-ds-brand rounded-full border-t-ds-brand animate-spin"></div>
							</div>
						) : error ? (
							<div className="w-full p-3 text-center text-ds-danger">
								خطا در دریافت اطلاعات مناطق زمانی
							</div>
						) : (
							<select
								value={timezone.value}
								onChange={handleSelectTimezone}
								className={
									'w-full rounded-lg appearance-none border-ds-surface-3 border select focus:outline-none focus:ring-2 focus:ring-ds-brand'
								}
							>
								{!timezone && (
									<option value="">انتخاب منطقه زمانی...</option>
								)}
								{timezones?.map((tz) => (
									<option
										key={tz.value}
										value={tz.value}
										className={'bg-ds-surface-2 text-ds-fg opacity-55'}
									>
										{tz.label} ({tz.offset})
									</option>
								))}
							</select>
						)}
					</div>
				</div>
			</div>
		</SectionPanel>
	)
}

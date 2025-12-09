import { useRef, useState, useEffect } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { SectionPanel } from '@/components/section-panel'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { SelectCity } from '@/layouts/setting/tabs/general/components/select-city'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import type { WeatherSettings } from './weather.interface'

export function WeatherSetting() {
	const [setting, setSetting] = useState<WeatherSettings>({
		useAI: true,
		forecastCount: 4,
		temperatureUnit: 'metric',
		enableShowName: true,
	})
	const isInitialLoad = useRef(true)

	function updateWeatherSettings(key: keyof WeatherSettings, value: any) {
		setSetting((per) => ({
			...per,
			[key]: value,
		}))
	}

	useEffect(() => {
		async function load() {
			const settingFromStorage = await getFromStorage('weatherSettings')
			if (settingFromStorage) {
				setSetting({ ...settingFromStorage })
			}

			isInitialLoad.current = false
		}
		load()
	}, [])

	useEffect(() => {
		if (isInitialLoad.current) return
		callEvent('weatherSettingsChanged', setting)
		setToStorage('weatherSettings', setting)
	}, [setting])

	return (
		<WidgetSettingWrapper>
			<SelectCity key={'selectCity'} />
			<SectionPanel title="تنظیمات نمایش" size="sm">
				<div className="flex flex-col space-y-4">
					{/* Temperature Unit */}
					<div className="flex flex-col space-y-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="tempUnit"
								className={'text-sm font-medium text-content'}
							>
								واحد دما
							</label>
							<div className="flex overflow-hidden border rounded-md border-white/10">
								{[
									{
										value: 'metric',
										label: '°C',
										persianName: 'سلسیوس',
									},
									{
										value: 'imperial',
										label: '°F',
										persianName: 'فارنهایت',
									},
									{
										value: 'standard',
										label: 'K',
										persianName: 'کلوین',
									},
								].map((option) => (
									<button
										key={option.value}
										className={`px-3 py-1.5 min-w-[40px] text-sm font-medium transition cursor-pointer ${
											setting.temperatureUnit === option.value
												? 'bg-blue-600 text-white'
												: 'bg-base-200'
										}`}
										onClick={() =>
											updateWeatherSettings(
												'temperatureUnit',
												option.value as any
											)
										}
									>
										<span className="ml-1">{option.persianName}</span>
										<span>({option.label})</span>
									</button>
								))}
							</div>
						</div>
						<div className={'text-xs font-light text-right text-muted'}>
							{setting.temperatureUnit === 'metric' &&
								'واحد سلسیوس در بیشتر کشورهای جهان استفاده می‌شود'}
							{setting.temperatureUnit === 'imperial' &&
								'واحد فارنهایت بیشتر در آمریکا استفاده می‌شود'}
							{setting.temperatureUnit === 'standard' &&
								'واحد کلوین در محاسبات علمی استفاده می‌شود'}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<p className={'text-sm text-content'}>نمایش نام شهر</p>
							<div className={'text-xs font-light text-muted'}>
								نمایش یا عدم نمایش نام شهر در بالای ویجت
							</div>
						</div>
						<ToggleSwitch
							enabled={setting.enableShowName}
							onToggle={() =>
								updateWeatherSettings(
									'enableShowName',
									!setting.enableShowName
								)
							}
						/>
					</div>
				</div>
			</SectionPanel>
		</WidgetSettingWrapper>
	)
}

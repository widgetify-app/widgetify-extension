import { SectionPanel } from '@/components/section-panel'
import { useWeatherStore } from '@/context/weather.context'

import { SelectedCityDisplay } from './SelectedCityDisplay'
import { WeatherSettings } from './weather-settings'

export function WeatherOptions() {
	const { selectedCity, weatherSettings, updateWeatherSettings } = useWeatherStore()

	return (
		<div className="w-full max-w-xl mx-auto" dir="rtl">
			<div className="space-y-6">
				{/* Search City Section */}
				<SelectedCityDisplay city={selectedCity} />

				{/* Display Options */}
				<SectionPanel title="تنظیمات نمایش">
					<WeatherSettings
						forecastCount={weatherSettings.forecastCount}
						temperatureUnit={weatherSettings.temperatureUnit}
						useAI={weatherSettings.useAI}
						updateSettings={(key, value) => updateWeatherSettings(key as any, value)}
					/>
				</SectionPanel>
			</div>
		</div>
	)
}

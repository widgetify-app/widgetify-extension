import { SectionPanel } from '@/components/section-panel'
import { useWeatherStore } from '@/context/weather.context'

import { motion } from 'framer-motion'

import { SelectedCityDisplay } from './SelectedCityDisplay'
import { WeatherSettings } from './weather-settings'

export function WeatherOptions() {
	const { selectedCity, weatherSettings, updateWeatherSettings } = useWeatherStore()

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			dir="rtl"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="space-y-6">
				{/* Search City Section */}
				<SelectedCityDisplay city={selectedCity} />

				{/* Display Options */}
				<SectionPanel title="تنظیمات نمایش" delay={0.2}>
					<WeatherSettings
						forecastCount={weatherSettings.forecastCount}
						temperatureUnit={weatherSettings.temperatureUnit}
						useAI={weatherSettings.useAI}
						updateSettings={(key, value) => updateWeatherSettings(key as any, value)}
					/>
				</SectionPanel>
			</div>
		</motion.div>
	)
}

import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import Analytics from '../../../../analytics'
import { type SelectedCity, useWeatherStore } from '../../../../context/weather.context'
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue'
import { useGetRelatedCities } from '../../../../services/getMethodHooks/weather/getRelatedCities'
import type { TemperatureUnit } from '../../../../services/getMethodHooks/weather/weather.interface'
import { CityResultsList } from './CityResultsList'
import { CitySearchInput } from './CitySearchInput'
import { SelectedCityDisplay } from './SelectedCityDisplay'

export function WeatherOptions() {
	const { setSelectedCity, selectedCity, weatherSettings, updateWeatherSettings } =
		useWeatherStore()

	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const debouncedValue = useDebouncedValue(inputValue.length >= 2 ? inputValue : '', 500)

	const {
		data: relatedCities,
		isSuccess,
		isLoading,
		error,
	} = useGetRelatedCities(debouncedValue)

	const handleSelectCity = (city: SelectedCity) => {
		setSelectedCity(city)

		Analytics.featureUsed('weather_city_selected', {
			city_name: city.name,
			state: city.state,
			latitude: city.lat,
			longitude: city.lon,
		})

		setInputValue('')
		inputRef.current?.blur()
	}

	return (
		<motion.div
			className="w-full max-w-md mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Search Input Area */}
			<div className="relative mb-4">
				<CitySearchInput
					ref={inputRef}
					value={inputValue}
					onChange={setInputValue}
					isLoading={isLoading}
				/>

				<AnimatePresence>
					{selectedCity && <SelectedCityDisplay city={selectedCity} />}
				</AnimatePresence>
			</div>

			{/* Search Results */}
			<AnimatePresence>
				{isSuccess && inputValue.length >= 2 && relatedCities?.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="mb-4"
					>
						<CityResultsList cities={relatedCities} onSelectCity={handleSelectCity} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Error Message */}
			{error && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="p-3 mb-4 text-sm text-right text-red-400 border rounded-lg border-red-400/20 bg-red-500/10"
				>
					خطا در دریافت اطلاعات. لطفا مجدد تلاش کنید.
				</motion.div>
			)}

			{/* Settings Content */}
			<div className="p-4 space-y-5">
				{/* Forecast Count */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<input
							id="forecastCount"
							type="number"
							min={1}
							max={10}
							value={weatherSettings.forecastCount}
							onChange={(e) =>
								updateWeatherSettings(
									'forecastCount',
									Number.parseInt(e.target.value) || 4,
								)
							}
							className="w-20 h-10 px-3 text-center text-white border rounded-md bg-gray-800/60 border-gray-700/30 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						/>
						<label
							htmlFor="forecastCount"
							className="text-sm font-medium text-right text-gray-200"
						>
							تعداد پیش‌بینی‌ها
						</label>
					</div>
				</div>

				{/* Temperature Unit */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<select
							id="tempUnit"
							value={weatherSettings.temperatureUnit}
							onChange={(e) =>
								updateWeatherSettings(
									'temperatureUnit',
									e.target.value as TemperatureUnit,
								)
							}
							className="px-3 py-2 text-right text-white border rounded-md bg-gray-800/60 border-gray-700/30 focus:ring-1 focus:ring-blue-500 focus:outline-none"
							dir="rtl"
						>
							<option value="metric">سلسیوس (°C)</option>
							<option value="imperial">فارنهایت (°F)</option>
							<option value="standard">کلوین (K)</option>
						</select>
						<label
							htmlFor="tempUnit"
							className="text-sm font-medium text-right text-gray-200"
						>
							نوع نمایش درجه هوا
						</label>
					</div>
				</div>

				{/* AI Toggle */}
				<div className="flex items-center justify-between">
					<div className="relative inline-block w-12 h-6">
						<input
							id="useAI"
							type="checkbox"
							checked={weatherSettings.useAI}
							onChange={(e) => updateWeatherSettings('useAI', e.target.checked)}
							className="sr-only"
						/>
						<div
							className={`block w-12 h-6 rounded-full transition-colors ${weatherSettings.useAI ? 'bg-blue-500' : 'bg-gray-400'}`}
							onClick={() => updateWeatherSettings('useAI', !weatherSettings.useAI)}
						></div>
						<div
							className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${weatherSettings.useAI ? 'translate-x-6' : ''}`}
							onClick={() => updateWeatherSettings('useAI', !weatherSettings.useAI)}
						></div>
					</div>
					<label htmlFor="useAI" className="text-sm font-medium text-right text-gray-200">
						استفاده از هوش مصنوعی
					</label>
				</div>
			</div>
		</motion.div>
	)
}

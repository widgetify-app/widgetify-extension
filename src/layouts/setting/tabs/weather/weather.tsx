import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import Analytics from '../../../../analytics'
import { SectionPanel } from '../../../../components/section-panel'
import { type SelectedCity, useWeatherStore } from '../../../../context/weather.context'
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue'
import { useGetRelatedCities } from '../../../../services/getMethodHooks/weather/getRelatedCities'
import { CityResultsList } from './CityResultsList'
import { CitySearchInput } from './CitySearchInput'
import { SelectedCityDisplay } from './SelectedCityDisplay'
import { WeatherSettings } from './weather-settings'

export function WeatherOptions() {
	const { setSelectedCity, selectedCity, weatherSettings, updateWeatherSettings } =
		useWeatherStore()

	const [inputValue, setInputValue] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const debouncedValue = useDebouncedValue(inputValue.length >= 2 ? inputValue : '', 500)

	const { data: relatedCities, isLoading, error } = useGetRelatedCities(debouncedValue)

	const handleSelectCity = (city: SelectedCity) => {
		setSelectedCity(city)
		setIsDropdownOpen(false)

		Analytics.featureUsed('weather_city_selected', {
			city_name: city.name,
			state: city.state,
			latitude: city.lat,
			longitude: city.lon,
		})

		setInputValue('')
		inputRef.current?.blur()
	}

	const handleInputChange = (value: string) => {
		setInputValue(value)
	}

	const handleInputFocus = () => {
		setIsDropdownOpen(true)
	}

	const handleCloseDropdown = () => {
		setIsDropdownOpen(false)
	}

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
				<SectionPanel title="انتخاب شهر" delay={0.1}>
					<div className="space-y-4">
						<div className="relative">
							{/* Search Input */}
							<CitySearchInput
								ref={inputRef}
								value={inputValue}
								onChange={handleInputChange}
								onFocus={handleInputFocus}
								isLoading={isLoading}
							/>

							{/* Search Results Dropdown */}
							<AnimatePresence>
								{isDropdownOpen && inputValue.length >= 2 && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: 10 }}
										className="absolute z-20 w-full mt-1"
									>
										<CityResultsList
											cities={relatedCities || []}
											onSelectCity={handleSelectCity}
											onClickOutside={handleCloseDropdown}
											isLoading={isLoading}
										/>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{/* Selected City Display */}
						<SelectedCityDisplay city={selectedCity} />

						{/* Error Message */}
						{error && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="p-3 text-sm text-right text-red-300 border rounded-lg border-red-400/20 bg-red-900/20 backdrop-blur-sm"
							>
								<div className="font-medium">خطا در دریافت اطلاعات</div>
								<div className="mt-1 text-red-300/80">
									لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
								</div>
							</motion.div>
						)}
					</div>
				</SectionPanel>

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

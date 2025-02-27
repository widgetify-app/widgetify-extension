import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { useWeatherStore } from '../../../../context/weather.context'
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue'
import { useGetRelatedCities } from '../../../../services/getMethodHooks/weather/getRelatedCities'
import { CityResultsList } from './CityResultsList'
import { CitySearchInput } from './CitySearchInput'
import { SelectedCityDisplay } from './SelectedCityDisplay'

export function WeatherOptions() {
	const { setSelectedCity, selectedCity } = useWeatherStore()
	const [inputValue, setInputValue] = useState('')
	const inputRef = useRef(null)

	const debouncedValue = useDebouncedValue(inputValue.length >= 2 ? inputValue : '', 500)

	const {
		data: relatedCities,
		isSuccess,
		isLoading,
		error,
	} = useGetRelatedCities(debouncedValue)

	const handleSelectCity = (city) => {
		setSelectedCity(city)
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
			<div className="relative p-2">
				<CitySearchInput
					ref={inputRef}
					value={inputValue}
					onChange={setInputValue}
					isLoading={isLoading}
				/>

				<AnimatePresence>
					<SelectedCityDisplay city={selectedCity} />
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{isSuccess && relatedCities?.length > 0 && (
					<CityResultsList cities={relatedCities} onSelectCity={handleSelectCity} />
				)}
			</AnimatePresence>

			{error && (
				<div className="p-3 mt-2 text-sm text-red-400 border border-red-400/20 rounded-xl bg-red-500/10">
					خطا در دریافت اطلاعات. لطفا مجدد تلاش کنید.
				</div>
			)}
		</motion.div>
	)
}

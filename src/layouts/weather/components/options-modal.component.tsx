import { useEffect, useRef, useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { useStore } from '../../../context/store.context'
import { useGetRelatedCities } from '../../../services/getMethodHooks/weather/getRelatedCities'

export function WeatherOptions() {
	const { setSelectedCity, selectedCity } = useStore()
	const [inputValue, setInputValue] = useState('')
	const [debouncedValue, setDebouncedValue] = useState('')
	const inputRef = useRef(null)

	const {
		data: relatedCities,
		isSuccess,
		isLoading,
	} = useGetRelatedCities(debouncedValue)

	// Debounce input changes
	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputValue.length >= 2) {
				setDebouncedValue(inputValue)
			}
		}, 500) // Reduced from 1000ms to 500ms for better responsiveness

		return () => clearTimeout(timer)
	}, [inputValue])

	const handleInputChange = (value: string) => {
		setInputValue(value)
	}

	function handleSelect(selected: string) {
		if (!selected) return
		const [name, lat, lon] = selected.split(':')

		const city = {
			city: name,
			lat: Number.parseFloat(lat),
			lon: Number.parseFloat(lon),
		}

		if (city.city === selectedCity?.city) return
		if (!city.lat || !city.lon) return

		setSelectedCity(city)
		setInputValue('')
		setDebouncedValue('')
		inputRef.current?.blur()
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="relative p-2">
				<div className="relative">
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						placeholder="نام شهر را وارد کنید ..."
						className="w-full bg-gray-50 dark:bg-[#2d2d2d] dark:text-[#eee] text-gray-700 text-[14px] rounded-lg p-3
              outline-none border-2 border-gray-200 dark:border-[#444] transition-all duration-200 font-[Vazir]
              focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20
              placeholder-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]"
						onChange={(e) => handleInputChange(e.target.value)}
					/>
					{isLoading && (
						<div className="absolute -translate-y-1/2 left-3 top-1/2">
							<div className="w-5 h-5 border-blue-500 rounded-full border-3 border-t-3 border-opacity-30 animate-spin border-t-blue-500" />
						</div>
					)}
				</div>

				{selectedCity?.city && (
					<div className="mt-3 animate-fadeIn">
						<div className="flex items-center gap-2 p-3 border border-blue-100 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
							<CiLocationOn className='"text-blue-600 dark:text-blue-400 size-5' />
							<span className="text-blue-700 dark:text-blue-300 text-[14px] font-[Vazir] font-medium">
								{selectedCity.city}
							</span>
						</div>
					</div>
				)}
			</div>

			{isSuccess && relatedCities && relatedCities.length > 0 && (
				<div className="p-2 animate-fadeIn">
					<div className="bg-white dark:bg-[#2d2d2d] rounded-lg border border-gray-200 dark:border-[#444] shadow-lg overflow-hidden">
						{relatedCities.map((city, index) => (
							<div
								key={`${city.name}-${index}`}
								className="p-3 cursor-pointer transition-colors duration-200 border-b last:border-b-0 border-gray-200 dark:border-[#444]
                  hover:bg-gray-50 dark:hover:bg-[#333] active:bg-gray-100 dark:active:bg-[#3a3a3a]"
								onClick={() => handleSelect(`${city.name}:${city.lat}:${city.lon}`)}
							>
								<div className="flex items-center gap-2">
									<span className="text-gray-700 dark:text-[#eee] text-[14px] font-[Vazir]">
										{city.name}
									</span>
									{city.state && (
										<span className="text-gray-400 dark:text-gray-500 text-[12px] font-[Vazir]">
											({city.state})
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default WeatherOptions

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import { TextInput } from '../../../components/text-input'
import { useWeatherStore } from '../../../context/weather.context'
import { useGetRelatedCities } from '../../../services/getMethodHooks/weather/getRelatedCities'

export function WeatherOptions() {
	const { setSelectedCity, selectedCity } = useWeatherStore()
	const [inputValue, setInputValue] = useState('')
	const [debouncedValue, setDebouncedValue] = useState('')
	const inputRef = useRef(null)

	const {
		data: relatedCities,
		isSuccess,
		isLoading,
	} = useGetRelatedCities(debouncedValue)

	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputValue.length >= 2) {
				setDebouncedValue(inputValue)
			}
		}, 500)

		return () => clearTimeout(timer)
	}, [inputValue])

	return (
		<motion.div
			className="w-full max-w-md mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="relative p-2">
				<div className="relative">
					<TextInput
						ref={inputRef}
						value={inputValue}
						onChange={(value) => setInputValue(value)}
						placeholder="نام شهر را وارد کنید ..."
					/>
					{isLoading && (
						<motion.div
							className="absolute -translate-y-1/2 left-3 top-1/2"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className="w-5 h-5 border-2 border-t-2 border-blue-500 rounded-full border-opacity-30 animate-spin border-t-blue-500" />
						</motion.div>
					)}
				</div>

				<AnimatePresence>
					{selectedCity?.city && (
						<motion.div
							className="mt-3"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							<div className="flex items-center gap-2 p-3 border rounded-xl bg-blue-500/10 border-blue-500/20">
								<CiLocationOn className="text-blue-400 size-5" />
								<span className="text-blue-300 text-[14px] font-[Vazir] font-medium">
									{selectedCity.city}
								</span>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{isSuccess && relatedCities?.length > 0 && (
					<motion.div
						className="mt-2"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						<div className="overflow-hidden border divide-y bg-white/5 rounded-xl border-white/10 divide-white/10">
							{relatedCities.map((city, index) => (
								<motion.button
									key={`${city.name}-${index}`}
									className="flex items-center w-full gap-3 p-3 text-right transition-colors duration-200 hover:bg-white/5 active:bg-white/10 focus:outline-none"
									onClick={() => {
										setSelectedCity({
											city: city.name,
											lat: city.lat,
											lon: city.lon,
										})
										setInputValue('')
										setDebouncedValue('')
										inputRef.current?.blur()
									}}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<CiLocationOn className="text-gray-400 size-4" />
									<div className="flex-1">
										<span className="block text-gray-200 text-[14px] font-[Vazir]">
											{city.name}
										</span>
										{city.state && (
											<span className="block text-gray-400 text-[12px] font-[Vazir]">
												{city.state}
											</span>
										)}
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

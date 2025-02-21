import { useState } from 'react'

import Modal from '../../../components/modal'
import { useStore } from '../../../context/store.context'
import { useGetRelatedCities } from '../../../services/getMethodHooks/weather/getRelatedCities'

interface WeatherOptionsModalProps {
	show: boolean
	onClose: () => void
}

export function WeatherOptionsModal({ onClose, show }: WeatherOptionsModalProps) {
	const { setSelectedCity, selectedCity } = useStore()

	const [inputValue, setInputValue] = useState<string | null>('')

	const {
		data: relatedCities,
		isSuccess,
		isLoading,
	} = useGetRelatedCities(inputValue || '')

	const handleInputChange = (value: string) => {
		if (value === '') {
			return
		}
		if (value.length < 2) return

		// delay the request to prevent too many requests
		setTimeout(() => {
			setInputValue(value)
		}, 1000) // 1 seconds
	}

	function handleSelect(selected: string) {
		if (!selected) return
		const [name, lat, lon] = selected.split(':')

		const city = {
			city: name,
			lat: Number.parseFloat(lat),
			lon: Number.parseFloat(lon),
		}

		if (city.city === selectedCity.city) return

		if (!city.lat || !city.lon) return

		setSelectedCity(city)

		setInputValue(null)
		onClose()
	}

	return (
		<Modal
			isOpen={show}
			onClose={onClose}
			closeOnBackdropClick={true}
			direction="rtl"
			title="تنظیمات آب و هوا"
		>
			<div className="w-full">
				<div className="p-2">
					<input
						type="text"
						placeholder="نام شهر را وارد کنید ..."
						className="w-full bg-gray-100 dark:bg-[#3e3e3e] dark:text-[#eee] text-gray-600 text-[13px] rounded-md p-2
                  outline-none border-2 border-gray-200 dark:border-[#444] transition-all duration-300
                  focus:ring-0 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-500 focus:placeholder-gray-500"
						onChange={(e) => handleInputChange(e.target.value)}
					/>
					{selectedCity?.city && (
						<div className="flex flex-row items-center justify-between w-full mt-2">
							<div className="flex items-center gap-1 bg-gray-200/40 dark:bg-[#444]/40 p-2 rounded-md">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-4 dark:text-[#e8e7e7] text-gray-600"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
									/>
								</svg>

								<span className="text-gray-600 dark:text-[#eee] text-[13px] font-[Vazir]">
									{selectedCity.city}
								</span>
							</div>
						</div>
					)}
				</div>
				{isLoading && (
					<div className="flex items-center justify-center p-2">
						<div className="w-6 h-6 ease-linear border-4 border-t-4 border-gray-200 rounded-full loader"></div>
					</div>
				)}
				{isSuccess && relatedCities && relatedCities.length > 0 && (
					<div className="p-2">
						{relatedCities.map((city) => (
							<div
								key={city.name}
								className="p-2 border-b border-gray-300 cursor-pointer dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
								onClick={() => handleSelect(`${city.name}:${city.lat}:${city.lon}`)}
							>
								{city.name} {city.state && `(${city.state})`}
							</div>
						))}
					</div>
				)}
			</div>
		</Modal>
	)
}

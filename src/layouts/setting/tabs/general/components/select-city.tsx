import { useRef, useState } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import Analytics from '@/analytics'
import { setToStorage } from '@/common/storage'
import { IconLoading } from '@/components/loading/icon-loading'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { type SelectedCity, useGeneralSetting } from '@/context/general-setting.context'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGetRelatedCities } from '@/services/hooks/weather/getRelatedCities'
import { CitySearchInput } from '../../weather/CitySearchInput'
import { SelectedCityDisplay } from '../../weather/SelectedCityDisplay'

export function SelectCity() {
	const [inputValue, setInputValue] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const debouncedValue = useDebouncedValue(
		inputValue.length >= 2 ? inputValue : '',
		500
	)
	const { setSelectedCity, selectedCity } = useGeneralSetting()

	const { data: relatedCities, isLoading, error } = useGetRelatedCities(debouncedValue)

	const handleSelectCity = (city: SelectedCity) => {
		setSelectedCity(city)
		setIsModalOpen(false)
		setInputValue('')

		Analytics.event('city_selected')

		setToStorage('selectedCity', {
			lat: city.lat,
			lon: city.lon,
			name: city.name,
			state: city.state,
		})
	}

	const handleInputChange = (value: string) => {
		setInputValue(value)
	}
	const onModalOpen = () => {
		setIsModalOpen(true)
		Analytics.event('open_city_selection_modal')
		setTimeout(() => {
			inputRef.current?.focus()
		}, 100)
	}

	return (
		<SectionPanel title="انتخاب شهر" size="sm">
			<div className="space-y-2">
				<button
					onClick={() => onModalOpen()}
					className="flex items-center justify-between w-full p-3 text-right transition-colors border cursor-pointer rounded-2xl bg-base-100 border-base-300 hover:bg-base-200"
				>
					<span>
						{selectedCity
							? `${selectedCity.name} ${selectedCity.state ? `, ${selectedCity.state}` : ''}`
							: 'انتخاب شهر'}
					</span>
					<CiLocationOn className="w-5 h-5 text-primary" />
				</button>
				<SelectedCityDisplay city={selectedCity} />
				{error && (
					<div className="p-3 text-sm text-right duration-300 border rounded-lg border-red-500/20 bg-red-500/10 backdrop-blur-sm animate-in fade-in-0">
						<div className="font-medium text-red-400">
							خطا در دریافت اطلاعات
						</div>
						<div className="mt-1 text-red-300 opacity-80">
							لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
						</div>
					</div>
				)}
			</div>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="انتخاب شهر"
				size="lg"
				direction="rtl"
			>
				<div className="space-y-4">
					<CitySearchInput
						ref={inputRef}
						value={inputValue}
						onChange={handleInputChange}
						onFocus={() => {}}
						isLoading={isLoading}
					/>
					<div className="overflow-y-auto max-h-96 custom-scrollbar">
						{isLoading ? (
							<div className="flex items-center justify-center p-4 text-center text-primary">
								<IconLoading />
								در حال بارگذاری...
							</div>
						) : relatedCities && relatedCities.length > 0 ? (
							relatedCities.map((city) => (
								<div
									key={`${city.lat}-${city.lon}`}
									onClick={() => handleSelectCity(city)}
									className="flex items-center w-full p-3 text-right transition-all duration-200 border-b cursor-pointer hover:bg-gradient-to-l hover:from-primary/10 hover:to-transparent border-base-200/30 last:border-b-0 group rounded-2xl"
								>
									<CiLocationOn className="flex-shrink-0 w-5 h-5 ml-3 transition-transform text-primary group-hover:scale-110" />
									<span className="flex-1 font-medium">
										{city.name}
										{city.state ? `, ${city.state}` : ''}
									</span>
								</div>
							))
						) : inputValue.length >= 2 ? (
							<div className="p-4 text-center text-base-content/60">
								نتیجه‌ای یافت نشد
							</div>
						) : (
							<div className="p-4 text-center text-base-content/60">
								شهر مورد نظر خود را جستجو کنید
							</div>
						)}
					</div>
				</div>
			</Modal>
		</SectionPanel>
	)
}

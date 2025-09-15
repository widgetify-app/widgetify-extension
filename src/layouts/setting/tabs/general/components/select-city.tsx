import { useRef, useState } from 'react'
import Analytics from '@/analytics'
import { setToStorage } from '@/common/storage'
import { SectionPanel } from '@/components/section-panel'
import { type SelectedCity, useGeneralSetting } from '@/context/general-setting.context'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGetRelatedCities } from '@/services/hooks/weather/getRelatedCities'
import { CityResultsList } from '../../weather/CityResultsList'
import { CitySearchInput } from '../../weather/CitySearchInput'
import { SelectedCityDisplay } from '../../weather/SelectedCityDisplay'

export function SelectCity() {
	const [inputValue, setInputValue] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const debouncedValue = useDebouncedValue(
		inputValue.length >= 2 ? inputValue : '',
		500
	)
	const { setSelectedCity, selectedCity } = useGeneralSetting()

	const { data: relatedCities, isLoading, error } = useGetRelatedCities(debouncedValue)

	const handleSelectCity = (city: SelectedCity) => {
		setSelectedCity(city)
		setIsDropdownOpen(false)

		Analytics.event('city_selected', {
			city_name: city.name,
			state: city.state,
			latitude: city.lat,
			longitude: city.lon,
		})

		setToStorage('selectedCity', {
			lat: city.lat,
			lon: city.lon,
			name: city.name,
			state: city.state,
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
		<SectionPanel title="انتخاب شهر" delay={0.1}>
			<div className="space-y-4">
				<div className="relative">
					<CitySearchInput
						ref={inputRef}
						value={inputValue}
						onChange={handleInputChange}
						onFocus={handleInputFocus}
						isLoading={isLoading}
					/>{' '}
					{isDropdownOpen && inputValue.length >= 2 && (
						<div className="absolute z-50 w-full mt-1 duration-200 animate-in fade-in-0 slide-in-from-bottom-2">
							{' '}
							<CityResultsList
								cities={relatedCities || []}
								onSelectCity={handleSelectCity}
								onClickOutside={handleCloseDropdown}
								isLoading={isLoading}
							/>
						</div>
					)}
				</div>
				<SelectedCityDisplay city={selectedCity} />
				{error && (
					<div
						className={
							'p-3 text-sm text-right border rounded-lg backdrop-blur-sm animate-in fade-in-0 duration-300'
						}
					>
						{' '}
						<div className="font-medium">خطا در دریافت اطلاعات</div>
						<div className="mt-1 opacity-80">
							لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
						</div>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}

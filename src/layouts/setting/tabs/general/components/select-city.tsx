import Analytics from '@/analytics'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { type SelectedCity, useWeatherStore } from '@/context/weather.context'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useGetRelatedCities } from '@/services/hooks/weather/getRelatedCities'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { CityResultsList } from '../../weather/CityResultsList'
import { CitySearchInput } from '../../weather/CitySearchInput'
import { SelectedCityDisplay } from '../../weather/SelectedCityDisplay'

export function SelectCity() {
  const { theme } = useTheme()

  const [inputValue, setInputValue] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedValue = useDebouncedValue(
    inputValue.length >= 2 ? inputValue : '',
    500,
  )
  const { setSelectedCity, selectedCity } = useWeatherStore()

  const {
    data: relatedCities,
    isLoading,
    error,
  } = useGetRelatedCities(debouncedValue)

  const handleSelectCity = (city: SelectedCity) => {
    setSelectedCity(city)
    setIsDropdownOpen(false)

    Analytics.featureUsed('city_selected', {
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

  const getErrorStyle = () => {
    switch (theme) {
      case 'light':
        return 'text-red-600 border-red-400/30 bg-red-500/10'
      case 'dark':
        return 'text-red-300 border-red-400/20 bg-red-900/20'
      default: // glass
        return 'text-red-300 border-red-400/20 bg-red-900/20'
    }
  }

  return (
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
                className="absolute z-50 w-full mt-1"
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
            className={`p-3 text-sm text-right border rounded-lg backdrop-blur-sm ${getErrorStyle()}`}
          >
            <div className="font-medium">خطا در دریافت اطلاعات</div>
            <div className="mt-1 opacity-80">
              لطفا اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.
            </div>
          </motion.div>
        )}
      </div>
    </SectionPanel>
  )
}

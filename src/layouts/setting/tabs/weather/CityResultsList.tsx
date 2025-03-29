import { useTheme } from '@/context/theme.context'
import type { FetchedCity } from '@/services/getMethodHooks/weather/weather.interface'
import { useEffect, useRef } from 'react'
import { CiLocationOn } from 'react-icons/ci'

interface CityResultsListProps {
	cities: Array<FetchedCity>
	onSelectCity: (city: FetchedCity) => void
	onClickOutside: () => void
	isLoading: boolean
}

export function CityResultsList({
	cities,
	onSelectCity,
	onClickOutside,
	isLoading,
}: CityResultsListProps) {
	const { theme } = useTheme()
	const listRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (listRef.current && !listRef.current.contains(event.target as Node)) {
				onClickOutside()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClickOutside])

	const getContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white border-gray-300/30 shadow-lg'
			case 'dark':
				return 'bg-gray-800/90 border-white/10 shadow-lg backdrop-blur-sm'
			default: // glass
				return 'bg-gray-800/80 border-white/10 shadow-lg backdrop-blur-sm'
		}
	}

	const getLoadingTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-700'
			default:
				return 'text-blue-200'
		}
	}

	const getLoadingSpinnerStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-blue-100 border-t-blue-600'
			default:
				return 'border-blue-800 border-t-blue-400'
		}
	}

	const getEmptyResultStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-300'
		}
	}

	const getCityItemStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-200/30 hover:bg-blue-100/50'
			case 'dark':
				return 'border-white/10 hover:bg-blue-800/30'
			default: // glass
				return 'border-white/10 hover:bg-blue-800/30'
		}
	}

	const getCityNameStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-800'
			default:
				return 'text-white'
		}
	}

	const getLocationIconStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-700'
			default:
				return 'text-blue-300'
		}
	}

	const getCityStateStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-300'
		}
	}

	if (isLoading) {
		return (
			<div
				ref={listRef}
				className={`overflow-hidden border rounded-lg ${getContainerStyle()}`}
			>
				<div className={`flex items-center justify-center p-4 ${getLoadingTextStyle()}`}>
					<div
						className={`w-5 h-5 ml-2 border-2 rounded-full animate-spin ${getLoadingSpinnerStyle()}`}
					></div>
					در حال جستجو...
				</div>
			</div>
		)
	}

	if (cities.length === 0) {
		return (
			<div
				ref={listRef}
				className={`overflow-hidden border rounded-lg ${getContainerStyle()}`}
			>
				<div className={`p-4 text-center ${getEmptyResultStyle()}`}>
					شهری با این نام یافت نشد
				</div>
			</div>
		)
	}

	return (
		<div
			ref={listRef}
			className={`overflow-hidden border rounded-lg ${getContainerStyle()}`}
		>
			<div className="overflow-y-auto max-h-60 custom-scrollbar">
				{cities.map((city) => (
					<button
						key={`${city.name}-${city.lat}-${city.lon}`}
						className={`flex flex-col w-full cursor-pointer p-3 text-right transition-colors border-b last:border-0 ${getCityItemStyle()}`}
						onClick={() => onSelectCity(city)}
					>
						<div className="flex items-center gap-2">
							<CiLocationOn className={`${getLocationIconStyle()} size-4`} />
							<div className={`font-medium ${getCityNameStyle()}`}>{city.name}</div>
						</div>
						<div className={`text-sm pr-6 ${getCityStateStyle()}`}>
							{city.state && `${city.state}, `}
							{city.country}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

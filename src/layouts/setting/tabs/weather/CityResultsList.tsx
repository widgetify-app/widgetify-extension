import type { FetchedCity } from '@/services/hooks/weather/weather.interface'
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

	const getLoadingTextStyle = () => {
		return 'text-primary/80'
	}

	const getLoadingSpinnerStyle = () => {
		return 'widget-item-border border-t-primary/80'
	}

	const getCityItemStyle = () => {
		// switch (theme) {
		// 	case 'light':
		// 		return 'border-gray-200/30 hover:bg-blue-100/50'
		// 	case 'dark':
		// 		return 'border-white/10 hover:bg-blue-800/30'
		// 	default: // glass
		// 		return 'border-white/10 hover:bg-blue-800/30'
		// }

		return 'border-transparent hover:bg-blue-100/50 dark:hover:bg-blue-800/30'
	}

	const getLocationIconStyle = () => {
		return 'mr-1 text-primary/80'
	}

	const getCityStateStyle = () => {
		return 'widget-item-text'
	}

	if (isLoading) {
		return (
			<div
				ref={listRef}
				className={
					'overflow-hidden backdrop-blur-sm shadow rounded-lg widget-item-background'
				}
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
				className={'overflow-hidden backdrop-blur-sm shadow rounded-lg bg-base-100/80'}
			>
				<div className={'p-4 text-center widget-item-text opacity-75'}>
					شهری با این نام یافت نشد
				</div>
			</div>
		)
	}

	return (
		<div
			ref={listRef}
			className={
				'overflow-y-auto max-h-60 custom-scrollbar backdrop-blur-sm shadow rounded-lg bg-base-100/80'
			}
		>
			{cities.map((city) => (
				<button
					key={`${city.name}-${city.lat}-${city.lon}`}
					className={`flex flex-col w-full cursor-pointer p-3 text-right transition-colors border-b last:border-0 ${getCityItemStyle()}`}
					onClick={() => onSelectCity(city)}
				>
					<div className="flex items-center gap-2">
						<CiLocationOn className={`${getLocationIconStyle()} size-4`} />
						<div className={'font-medium widget-item-text'}>{city.name}</div>
					</div>
					<div className={`text-sm pr-6 ${getCityStateStyle()}`}>
						{city.state && `${city.state}, `}
						{city.country}
					</div>
				</button>
			))}
		</div>
	)
}

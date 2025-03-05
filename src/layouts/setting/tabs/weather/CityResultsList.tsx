import { useRef, useEffect } from 'react'
import { CiLocationOn } from 'react-icons/ci'
import type { FetchedCity } from '../../../../services/getMethodHooks/weather/weather.interface'

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

	if (isLoading) {
		return (
			<div
				ref={listRef}
				className="overflow-hidden border rounded-lg shadow-lg bg-gray-800/80 backdrop-blur-md border-white/10"
			>
				<div className="flex items-center justify-center p-4 text-blue-200">
					<div className="w-5 h-5 ml-2 border-2 border-blue-800 rounded-full border-t-blue-400 animate-spin"></div>
					در حال جستجو...
				</div>
			</div>
		)
	}

	if (cities.length === 0) {
		return (
			<div
				ref={listRef}
				className="overflow-hidden border rounded-lg shadow-lg bg-gray-800/80 backdrop-blur-md border-white/10"
			>
				<div className="p-4 text-center text-gray-300">شهری با این نام یافت نشد</div>
			</div>
		)
	}

	return (
		<div
			ref={listRef}
			className="overflow-hidden border rounded-lg shadow-lg bg-gray-800/80 backdrop-blur-md border-white/10"
		>
			<div className="overflow-y-auto max-h-60 custom-scrollbar">
				{cities.map((city) => (
					<button
						key={`${city.name}-${city.lat}-${city.lon}`}
						className="flex flex-col w-full p-3 text-right transition-colors border-b hover:bg-blue-800/30 border-white/10 last:border-0"
						onClick={() => onSelectCity(city)}
					>
						<div className="flex items-center gap-2">
							<CiLocationOn className="text-blue-300 size-4" />
							<div className="font-medium text-white">{city.name}</div>
						</div>
						<div className="text-sm text-gray-300 pr-6">
							{city.state && `${city.state}, `}
							{city.country}
						</div>
					</button>
				))}
			</div>
		</div>
	)
}

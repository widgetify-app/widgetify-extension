import { motion } from 'motion/react'
import { CiLocationOn } from 'react-icons/ci'
import type { FetchedCity } from '../../../../services/getMethodHooks/weather/weather.interface'

interface CityResultsListProps {
	cities: Array<FetchedCity>
	onSelectCity: (city: FetchedCity) => void
}

export function CityResultsList({ cities, onSelectCity }: CityResultsListProps) {
	if (cities.length === 0) return null

	return (
		<motion.div
			className="mt-2"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
		>
			<div className="overflow-hidden border divide-y bg-white/5 rounded-xl border-white/10 divide-white/10">
				{cities.map((city, index) => (
					<motion.button
						key={`${city.name}-${index}`}
						className="flex items-center w-full gap-3 p-3 text-right transition-colors duration-200 hover:bg-white/5 active:bg-white/10 focus:outline-none"
						onClick={() => {
							onSelectCity(city)
						}}
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
					>
						<CiLocationOn className="text-gray-400 size-4" />
						<div className="flex-1">
							<span className="block text-gray-200 text-[14px]  ">{city.name}</span>
							{city.state && (
								<span className="block text-gray-400 text-[12px]  ">{city.state}</span>
							)}
						</div>
					</motion.button>
				))}
			</div>
		</motion.div>
	)
}

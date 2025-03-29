import { useTheme } from '@/context/theme.context'
import type { SelectedCity } from '@/context/weather.context'
import { motion } from 'framer-motion'
import { BiCurrentLocation } from 'react-icons/bi'

interface SelectedCityDisplayProps {
	city: SelectedCity | null
}

export function SelectedCityDisplay({ city }: SelectedCityDisplayProps) {
	const { theme } = useTheme()
	if (!city) return null
	return (
		<motion.div
			className={`w-full rounded-xl overflow-hidden ${
				theme === 'light'
					? 'bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-100/80'
					: 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/30'
			}`}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<div className="p-4">
				<div className="flex items-start">
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<h3
								className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}
							>
								{city.name}
							</h3>

							<div
								className={`text-xs px-2 py-0.5 rounded-full ${
									theme === 'light'
										? 'bg-blue-100 text-blue-700'
										: 'bg-blue-800/30 text-blue-200'
								}`}
							>
								{city.state}
							</div>
						</div>

						<div className="flex items-center gap-4 mt-2 mb-3">
							<div className="flex items-center gap-1 text-xs">
								<BiCurrentLocation
									className={
										theme === 'light' ? 'text-blue-500 mr-1' : 'text-blue-400 mr-1'
									}
									size={14}
								/>
								<span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
									عرض: {city.lat}
								</span>
							</div>

							<div className="flex items-center gap-1 text-xs">
								<BiCurrentLocation
									className={
										theme === 'light' ? 'text-blue-500 mr-1' : 'text-blue-400 mr-1'
									}
									size={14}
								/>
								<span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
									طول: {city.lon}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

import { motion } from 'motion/react'
import { CiLocationOn } from 'react-icons/ci'
import type { City } from '../../../../types/weather'

interface SelectedCityDisplayProps {
	city: City | null
}

export function SelectedCityDisplay({ city }: SelectedCityDisplayProps) {
	if (!city?.city) return null

	return (
		<motion.div
			className="mt-3"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
		>
			<div className="flex items-center gap-2 p-3 border rounded-xl bg-blue-500/10 border-blue-500/20">
				<CiLocationOn className="text-blue-400 size-5" />
				<span className="text-blue-300 text-[14px] font-[Vazir] font-medium">
					{city.city}
				</span>
			</div>
		</motion.div>
	)
}

import { motion } from 'motion/react'
import { MdLocationCity } from 'react-icons/md'
import type { SelectedCity } from '../../../../context/weather.context'

interface SelectedCityDisplayProps {
	city: SelectedCity | null
}

export function SelectedCityDisplay({ city }: SelectedCityDisplayProps) {
	if (!city) {
		return (
			<div className="flex flex-col items-center justify-center p-6 text-gray-300 border rounded-lg border-white/10 bg-gray-800/30 backdrop-blur-sm">
				<MdLocationCity className="mb-2" size={28} />
				<span className="mb-1 font-medium">هیچ شهری انتخاب نشده است</span>
				<span className="text-sm text-gray-400">
					برای دریافت آب و هوا، یک شهر را جستجو کنید
				</span>
			</div>
		)
	}

	return (
		<motion.div
			className="p-4 border rounded-lg bg-blue-900/20 backdrop-blur-sm border-white/10"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<h3 className="text-lg font-medium text-white">{city.name}</h3>
					<p className="text-sm text-gray-300">{city.state && `${city.state}، `}</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-200">
				<span className="px-2 py-1 rounded-md bg-blue-800/30 backdrop-blur-sm">
					عرض جغرافیایی: {city.lat}
				</span>
				<span className="px-2 py-1 rounded-md bg-blue-800/30 backdrop-blur-sm">
					طول جغرافیایی: {city.lon}
				</span>
			</div>
		</motion.div>
	)
}

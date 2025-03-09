import { motion } from 'framer-motion'
import { MdLocationCity } from 'react-icons/md'
import { useTheme } from '../../../../context/theme.context'
import type { SelectedCity } from '../../../../context/weather.context'

interface SelectedCityDisplayProps {
	city: SelectedCity | null
}

export function SelectedCityDisplay({ city }: SelectedCityDisplayProps) {
	const { theme } = useTheme()

	const getEmptyStateStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 border-gray-300/30 bg-gray-100/70'
			case 'dark':
				return 'text-gray-300 border-white/10 bg-gray-800/30'
			default: // glass
				return 'text-gray-300 border-white/10 bg-gray-800/30'
		}
	}

	const getEmptyStateDescriptionStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'

			default:
				return 'text-gray-400'
		}
	}

	const getCityContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-100/50 border-blue-200/30'
			case 'dark':
				return 'bg-blue-900/20 border-white/10'
			default: // glass
				return 'bg-blue-900/20 border-white/10'
		}
	}

	const getCityNameStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-800'
			default:
				return 'text-white'
		}
	}

	const getStateNameStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-blue-700'
			default:
				return 'text-gray-300'
		}
	}

	const getCoordinateTagStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-200/70 text-blue-800'
			case 'dark':
				return 'bg-blue-800/30 text-gray-200'
			default: // glass
				return 'bg-blue-800/30 text-gray-200'
		}
	}

	if (!city) {
		return (
			<div
				className={`flex flex-col items-center justify-center p-6 border rounded-lg backdrop-blur-sm ${getEmptyStateStyle()}`}
			>
				<MdLocationCity className="mb-2" size={28} />
				<span className="mb-1 font-medium">هیچ شهری انتخاب نشده است</span>
				<span className={`text-sm ${getEmptyStateDescriptionStyle()}`}>
					برای دریافت آب و هوا، یک شهر را جستجو کنید
				</span>
			</div>
		)
	}

	return (
		<motion.div
			className={`p-4 border rounded-lg backdrop-blur-sm ${getCityContainerStyle()}`}
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<h3 className={`text-lg font-medium ${getCityNameStyle()}`}>{city.name}</h3>
					<p className={getStateNameStyle()}>{city.state && `${city.state}، `}</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-2 mt-2 text-xs">
				<span
					className={`px-2 py-1 rounded-md backdrop-blur-sm ${getCoordinateTagStyle()}`}
				>
					عرض جغرافیایی: {city.lat}
				</span>
				<span
					className={`px-2 py-1 rounded-md backdrop-blur-sm ${getCoordinateTagStyle()}`}
				>
					طول جغرافیایی: {city.lon}
				</span>
			</div>
		</motion.div>
	)
}

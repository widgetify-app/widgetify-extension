import { motion } from 'framer-motion'
import jalaliMoment from 'jalali-moment'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useTheme } from '@/context/theme.context'

interface DaySliderProps {
	currentDate: jalaliMoment.Moment
	onDateChange: (date: jalaliMoment.Moment) => void
	isPreview?: boolean
}

export const DaySlider: React.FC<DaySliderProps> = ({
	currentDate,
	onDateChange,
	isPreview = false,
}) => {
	const { theme } = useTheme()
	const today = jalaliMoment().locale('fa').utc().add(3.5, 'hours')

	const isToday =
		currentDate.jDate() === today.jDate() &&
		currentDate.jMonth() === today.jMonth() &&
		currentDate.jYear() === today.jYear()

	const handlePrevDay = () => {
		onDateChange(currentDate.clone().subtract(1, 'day'))
	}

	const handleNextDay = () => {
		onDateChange(currentDate.clone().add(1, 'day'))
	}

	const handleToday = () => {
		onDateChange(today.clone())
	}

	// Theme-specific styles
	const getDayNavigationStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 hover:bg-gray-100/80'
			case 'dark':
				return 'text-gray-300 hover:bg-neutral-800/50'
			default: // glass
				return 'text-gray-300 hover:bg-white/10'
		}
	}

	const getSliderContainerStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-50/80'
			case 'dark':
				return 'bg-neutral-800/50'
			default: // glass
				return 'bg-neutral-900/50'
		}
	}

	const getCurrentDayStyle = () => {
		return isToday
			? 'text-blue-500 font-medium'
			: theme === 'light'
				? 'text-gray-700'
				: 'text-gray-200'
	}

	const getTodayButtonStyle = () => {
		if (isToday) return 'opacity-50 cursor-default'

		switch (theme) {
			case 'light':
				return 'text-blue-600 bg-blue-50 hover:bg-blue-100'
			default:
				return 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
		}
	}

	return (
		<div
			className={`flex items-center justify-between rounded-lg overflow-hidden ${getSliderContainerStyle()} ${isPreview ? 'py-1 px-2' : 'py-1.5 px-3'}`}
		>
			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={handlePrevDay}
				className={`p-1 rounded-full transition-colors ${getDayNavigationStyle()}`}
			>
				<FaChevronRight size={isPreview ? 10 : 12} />
			</motion.button>

			<div className="flex items-center gap-2">
				<span className={`${getCurrentDayStyle()} ${isPreview ? 'text-xs' : 'text-sm'}`}>
					{currentDate.format('dddd، jD jMMMM jYYYY')}
				</span>

				{!isToday && !isPreview && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleToday}
						className={`text-xs px-2 py-0.5 rounded transition-colors ${getTodayButtonStyle()}`}
					>
						امروز
					</motion.button>
				)}
			</div>

			<motion.button
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				onClick={handleNextDay}
				className={`p-1 rounded-full transition-colors ${getDayNavigationStyle()}`}
			>
				<FaChevronLeft size={isPreview ? 10 : 12} />
			</motion.button>
		</div>
	)
}

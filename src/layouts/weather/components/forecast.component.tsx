import { useTheme } from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { unitsFlag } from '../unitSymbols'

interface ForecastProps {
	forecast: {
		temp: number
		icon: string
		date: string
	}
	unit: keyof typeof unitsFlag
}

export function ForecastComponent({ forecast, unit }: ForecastProps) {
	const { theme, themeUtils } = useTheme()

	const getWeekdayStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			case 'dark':
				return 'text-neutral-400'
			default: // glass
				return 'text-neutral-400'
		}
	}

	const getTimeStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700 bg-gray-200/50'
			case 'dark':
				return 'text-neutral-300'
			default: // glass
				return 'text-neutral-300'
		}
	}

	const getTemperatureStyle = () => {
		switch (theme) {
			case 'light':
				return 'from-gray-700 to-gray-900'

			default:
				return 'from-gray-200 to-gray-400'
		}
	}

	const getDescriptionBoxStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70'
			case 'dark':
				return 'bg-neutral-800/30'
			default: // glass
				return 'bg-neutral-900/40'
		}
	}

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className={`flex flex-col items-center justify-between w-20 h-[5.8rem] p-2 transition-all duration-300 ${themeUtils.getBorderColor()} border ${getDescriptionBoxStyle()}  rounded-xl`}
			>
				{/* Time Section */}
				<div className="flex flex-col items-center gap-0.5 w-full">
					<div
						className={`text-[.55rem] font-semibold tracking-wide uppercase ${getWeekdayStyle()}`}
					>
						{new Date(forecast.date).toLocaleDateString('fa-IR', {
							weekday: 'short',
						})}
					</div>
					<div
						className={`px-2 py-0.5  text-[.65rem]  font-medium rounded-full ${getTimeStyle()} w-full text-center`}
					>
						{new Date(forecast.date).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						})}
					</div>
				</div>

				{/* Weather Icon */}
				<div className="relative my-1 group">
					<m.div
						initial={{ rotate: 0 }}
						whileHover={{ rotate: [0, -15, 15, 0] }}
						transition={{ duration: 0.6 }}
					>
						<m.img
							src={forecast.icon}
							alt="weather status"
							className="w-4 h-4 drop-shadow-weatherIcon"
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3 }}
						/>
					</m.div>
					<div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl -z-10" />
				</div>

				{/* Temperature */}
				<m.div
					initial={{ scale: 0.9 }}
					animate={{ scale: 1 }}
					className={`text-sm font-extrabold text-transparent bg-gradient-to-r ${getTemperatureStyle()} bg-clip-text drop-shadow-temperature`}
				>
					{Math.round(forecast.temp)}
					<span className="text-sm font-medium">{unitsFlag[unit]}</span>
				</m.div>
			</m.div>
		</LazyMotion>
	)
}

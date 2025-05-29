import { getBorderColor, getTextColor, useTheme } from '@/context/theme.context'
import { FaBowlFood } from 'react-icons/fa6'

interface Prop {
	level: number
	petName: string
	mode: 'full' | 'small'
}
export const PetHud: React.FC<Prop> = ({ level, petName, mode }) => {
	const isHungry = level === 0
	const { theme } = useTheme()

	if (mode === 'small') {
		return (
			<div className="absolute bottom-0 z-10 left-2 opacity-60">
				<div className="relative w-9 h-9">
					<svg className="absolute w-full h-full -rotate-90">
						<circle
							className={`${
								level >= 60
									? 'stroke-green-500'
									: level >= 30
										? 'stroke-amber-500'
										: 'stroke-red-500'
							}`}
							cx="18"
							cy="18"
							r="16"
							strokeWidth="2"
							fill="transparent"
							style={{
								strokeDasharray: '100',
								strokeDashoffset: `${100 - (level / 100) * 100}`,
							}}
						/>
					</svg>

					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<FaBowlFood size={10} className={getTextColor(theme)} />
						<span className={`text-[0.6rem] font-medium ${getTextColor(theme)}`}>
							{level}%
						</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`flex items-center w-32 h-8 gap-2 p-2 shadow-md max-h-8 border ${getBorderColor(theme)} rounded-md`}
		>
			{isHungry ? (
				<div className="flex items-center">
					<span className="text-sm font-bold text-red-500 animate-pulse">🍽️</span>
				</div>
			) : (
				<div className="flex items-center">
					<span className="text-[8px] text-emerald-500"></span>
				</div>
			)}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between mb-0.5">
					<span className={`text-[9px] font-medium truncate ${getTextColor(theme)}`}>
						{isHungry ? 'گرسنه' : petName}
					</span>
					<span
						className={`text-[8px] font-bold  tracking-wide ml-1 ${getTextColor(theme)}`}
					>
						{level}%
					</span>
				</div>
				<div className="w-full h-1 overflow-hidden rounded-full shadow-inner bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
					<div
						className={`h-1 rounded-full transition-all duration-500 ease-out ${
							level >= 60
								? 'bg-gradient-to-r from-emerald-400 to-green-500'
								: level >= 30
									? 'bg-gradient-to-r from-amber-400 to-yellow-500'
									: 'bg-gradient-to-r from-red-400 to-rose-500 animate-pulse'
						}`}
						style={{
							width: `${level}%`,
						}}
					/>
				</div>
			</div>
		</div>
	)
}

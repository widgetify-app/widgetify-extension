import {
	getBorderColor,
	getDescriptionTextStyle,
	getTextColor,
	useTheme,
} from '@/context/theme.context'

interface Props {
	isActive: boolean
	onClick: () => void
	key: string
	label: string
	description?: string
}
export function ItemSelector({ isActive, onClick, key, label, description }: Props) {
	const { theme } = useTheme()

	const getActiveButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-blue-500 bg-blue-500/10'
			case 'dark':
				return 'border-blue-500 bg-blue-500/20'
			default: // glass
				return 'border-blue-500 bg-blue-500/10'
		}
	}

	const getInactiveButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300 bg-gray-100/50 hover:bg-gray-200/60'
			case 'dark':
				return 'border-gray-700 bg-neutral-800/80 hover:bg-neutral-700/60'
			default: // glass
				return 'border-gray-700 bg-white/5 hover:bg-white/10'
		}
	}

	const getRadioBorderStyle = (isSelected: boolean) => {
		if (isSelected) {
			return 'border-blue-500 bg-blue-500'
		}

		return getBorderColor(theme)
	}

	return (
		<button
			key={key}
			onClick={onClick}
			className={`flex cursor-pointer flex-col items-start w-full p-3 transition border rounded-lg ${
				isActive ? getActiveButtonStyle() : getInactiveButtonStyle()
			}`}
		>
			<div className="flex items-center justify-center mb-2">
				<div className={`w-4 h-4 rounded-full border ${getRadioBorderStyle(isActive)}`}>
					{isActive && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full p-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					)}
				</div>
				<span className={`mr-1.5 text-sm font-medium ${getTextColor(theme)}`}>
					{label}
				</span>
			</div>
			<p className={`text-sm ${getDescriptionTextStyle(theme)} text-right`}>
				{description}
			</p>
		</button>
	)
}

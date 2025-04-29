import { useTheme } from '@/context/theme.context'
import clsx from 'clsx'
import { m } from 'framer-motion'

interface ToggleSwitchProps {
	enabled: boolean
	disabled?: boolean
	onToggle: () => void
}

export const ToggleSwitch = ({
	enabled,
	disabled = false,
	onToggle,
}: ToggleSwitchProps) => {
	const { theme } = useTheme()

	const getTrackStyle = () => {
		if (enabled) {
			return theme === 'light' ? 'bg-blue-500' : 'bg-blue-600'
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-300'
			case 'dark':
				return 'bg-gray-600'
			default: // glass
				return 'bg-gray-700/50'
		}
	}

	return (
		<m.div
			className={clsx('w-12 h-6 relative rounded-full transition-colors', {
				[getTrackStyle()]: true,
				'cursor-pointer': !disabled,
				'cursor-not-allowed opacity-70': disabled,
			})}
			onClick={disabled ? undefined : onToggle}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
		>
			<m.span
				className="absolute w-4 h-4 bg-white rounded-full shadow-sm top-1 left-1"
				animate={{
					x: enabled ? 24 : 0,
				}}
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			/>
		</m.div>
	)
}

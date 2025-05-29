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
	const getTrackStyle = () => {
		if (enabled) {
			return 'bg-primary'
		}

		return 'bg-base-300'
	}

	return (
		<m.div
			className={`
				w-12 h-6 relative rounded-full transition-colors
				${getTrackStyle()} cursor-pointer
				${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
			onClick={disabled ? undefined : onToggle}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
		>
			<m.span
				className="absolute w-4 h-4 bg-white rounded-full shadow-sm top-1 left-1"
				animate={{
					x: enabled ? 0 : 24,
				}}
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			/>
		</m.div>
	)
}

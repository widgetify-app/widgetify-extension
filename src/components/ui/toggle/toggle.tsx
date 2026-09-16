import { cn } from '@/common/utils/cn'
import { toggleThumbVariants, toggleTrackVariants } from './toggle.variants'

export interface ToggleSwitchProps {
	enabled: boolean
	disabled?: boolean
	loading?: boolean
	onToggle: () => void
	className?: string
}

export const ToggleSwitch = ({
	enabled,
	disabled = false,
	loading = false,
	onToggle,
	className,
}: ToggleSwitchProps) => {
	const interactive = !disabled && !loading

	return (
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			disabled={!interactive}
			className={cn(toggleTrackVariants({ enabled, interactive }), className)}
			onClick={onToggle}
		>
			<span className={toggleThumbVariants({ enabled, loading })} />
		</button>
	)
}

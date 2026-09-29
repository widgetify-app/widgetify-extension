import { cn } from '@/common/utils/cn'
import { toggleThumbVariants, toggleTrackVariants } from './toggle.variants'

interface ToggleSwitchProps {
	enabled: boolean
	label: string
	disabled?: boolean
	loading?: boolean
	onToggle: () => void
	className?: string
}

export const ToggleSwitch = ({
	enabled,
	label,
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
			aria-label={label}
			aria-busy={loading || undefined}
			disabled={!interactive}
			onClick={onToggle}
			className={cn(
				toggleTrackVariants({ enabled, interactive }),
				'shrink-0 focus-visible:focus-ring',
				className
			)}
		>
			<span
				aria-hidden="true"
				className={toggleThumbVariants({ enabled, loading })}
			/>
		</button>
	)
}

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
		<div
			className={cn(toggleTrackVariants({ enabled, interactive }), className)}
			onClick={interactive ? onToggle : undefined}
		>
			<span className={toggleThumbVariants({ enabled, loading })} />
		</div>
	)
}

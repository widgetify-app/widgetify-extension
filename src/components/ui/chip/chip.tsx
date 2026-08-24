import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/common/utils/cn'
import { chipVariants } from './chip.variants'

export interface ChipProps extends VariantProps<typeof chipVariants> {
	onClick: () => void
	children: React.ReactNode
	className?: string
	dir?: string
	disabled?: boolean
}

export const Chip: React.FC<ChipProps> = ({
	selected,
	onClick,
	children,
	className,
	dir,
	disabled,
}) => {
	return (
		<button
			onClick={disabled ? undefined : onClick}
			className={cn(chipVariants({ selected }), className)}
			dir={dir}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

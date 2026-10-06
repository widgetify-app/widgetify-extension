import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/common/utils/cn'
import { chipVariants } from './chip.variants'

interface ChipProps extends VariantProps<typeof chipVariants> {
	onClick: () => void
	children: React.ReactNode
	className?: string
	dir?: string
	disabled?: boolean
}

export const Chip: React.FC<ChipProps> = ({
	selected,
	size,
	onClick,
	children,
	className,
	dir,
	disabled,
}) => {
	return (
		<button
			type="button"
			onClick={disabled ? undefined : onClick}
			className={cn(chipVariants({ selected, size }), className)}
			dir={dir}
			disabled={disabled}
		>
			{children}
		</button>
	)
}

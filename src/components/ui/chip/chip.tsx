import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/common/utils/cn'
import { chipVariants } from './chip.variants'

export interface ChipProps extends VariantProps<typeof chipVariants> {
	onClick: () => void
	children: React.ReactNode
	className?: string
	dir?: string
}

export const Chip: React.FC<ChipProps> = ({
	selected,
	onClick,
	children,
	className,
	dir,
}) => {
	return (
		<button
			onClick={onClick}
			className={cn(chipVariants({ selected }), className)}
			dir={dir}
		>
			{children}
		</button>
	)
}

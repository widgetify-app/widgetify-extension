import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface Prop {
	label: string
	selected: boolean
	onSelect: () => void
	children: ReactNode
	className?: string
	locked?: boolean
}

export function PetOptionTile({
	label,
	selected,
	onSelect,
	children,
	className,
	locked,
}: Prop) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				'relative flex flex-col items-center overflow-hidden border cursor-pointer rounded-2xl transition-ui focus-visible:focus-ring',
				selected
					? 'border-brand-muted bg-brand-fill'
					: 'border-surface-3 bg-surface-2 hover:bg-brand-fill hover:border-brand-fill-2',
				className
			)}
		>
			{locked && (
				<span className="absolute top-1.5 left-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-surface-veil border border-line text-fg-muted z-10">
					<Icon name="lock" size={10} />
				</span>
			)}
			{children}
			<span
				className={cn(
					'w-full py-1 text-3xs leading-relaxed text-center',
					selected ? 'font-medium text-brand' : 'text-fg-muted'
				)}
			>
				{label}
			</span>
		</button>
	)
}

import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'

interface Prop {
	label: string
	selected: boolean
	onSelect: () => void
	children: ReactNode
	className?: string
}

export function PetOptionTile({ label, selected, onSelect, children, className }: Prop) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				'flex flex-col items-center overflow-hidden border cursor-pointer rounded-2xl transition-ui focus-visible:focus-ring',
				selected
					? 'border-ds-brand-muted bg-ds-brand-fill'
					: 'border-ds-surface-3 bg-ds-surface-2 hover:bg-ds-brand-fill hover:border-ds-brand-fill-2',
				className
			)}
		>
			{children}
			<span
				className={cn(
					'w-full py-1 text-[10px] leading-[1.7] text-center',
					selected ? 'font-medium text-ds-brand' : 'text-ds-fg-muted'
				)}
			>
				{label}
			</span>
		</button>
	)
}

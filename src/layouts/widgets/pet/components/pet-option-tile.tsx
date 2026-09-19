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
				'flex flex-col items-center overflow-hidden border cursor-pointer rounded-xl transition-ui focus-visible:focus-ring',
				selected
					? 'border-brand-muted bg-brand-subtle'
					: 'border-content bg-subtle hover:bg-brand-subtle hover:border-brand-muted',
				className
			)}
		>
			{children}
			<span
				className={cn(
					'w-full py-1 text-[10px] leading-[1.7] text-center',
					selected ? 'font-medium text-primary' : 'text-muted'
				)}
			>
				{label}
			</span>
		</button>
	)
}

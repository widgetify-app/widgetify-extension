import type { ReactNode } from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

interface Prop {
	label: string
	selected?: boolean
	onSelect: () => void
	children: ReactNode
	locked?: boolean
}

export function PetOptionTile({ label, selected, onSelect, children, locked }: Prop) {
	return (
		<button
			type="button"
			onClick={onSelect}
			aria-pressed={selected}
			className={cn(
				'relative flex flex-col items-center min-w-0 gap-1 px-1 pt-2 pb-1.5 rounded-xl text-3xs cursor-pointer transition-ui focus-visible:focus-ring',
				selected
					? 'font-bold bg-brand-fill text-brand ring-[1.5px] ring-inset ring-brand-muted'
					: 'font-semibold bg-fill text-fg-muted hover:bg-fill-2'
			)}
		>
			{locked && (
				<span className="absolute z-10 grid rounded-sm top-1.5 start-1.5 size-4.5 place-items-center bg-scrim text-image-fg">
					<Icon name="lock" size={10} aria-hidden="true" />
				</span>
			)}
			{children}
			<span className="max-w-full truncate">{label}</span>
		</button>
	)
}

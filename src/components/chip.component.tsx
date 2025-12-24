import React from 'react'

interface ChipProps {
	selected: boolean
	onClick: () => void
	children: React.ReactNode
	className?: string
}

export const Chip: React.FC<ChipProps> = ({
	selected,
	onClick,
	children,
	className = '',
}) => {
	return (
		<button
			onClick={onClick}
			className={`px-4 py-2 cursor-pointer rounded-full text-xs font-bold transition-all border-2 ${selected ? 'bg-primary border-primary text-white' : 'bg-base-100 border-base-300/30 text-muted hover:border-primary/30'} ${className}`}
		>
			{children}
		</button>
	)
}

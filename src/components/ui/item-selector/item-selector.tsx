import type React from 'react'
import { cn } from '@/common/utils/cn'

interface Props {
	isActive: boolean
	onClick: () => void
	label: string | React.ReactNode
	description?: string | React.ReactNode
	className?: string
	style?: React.CSSProperties
}
export function ItemSelector({
	isActive,
	onClick,
	label,
	description,
	className,
	style,
}: Props) {
	const getRadioBorderStyle = (isSelected: boolean) => {
		if (isSelected) {
			return 'border-ds-brand bg-ds-brand'
		}

		return 'border-ds-surface-3 bg-ds-fill-2'
	}

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex cursor-pointer flex-col items-start p-3 transition-all border rounded-xl w-full text-right outline-none',
				className,
				isActive
					? 'border-ds-brand-fill-2 bg-ds-brand-fill-2'
					: 'bg-ds-fill border-ds-surface-3 hover:!border-ds-brand-fill-2 hover:!bg-ds-brand-fill'
			)}
			style={style}
		>
			<div className="flex items-center justify-center gap-0.5 mb-1">
				<div
					className={`w-4 h-4 rounded-full text-ds-on-brand border flex items-center justify-center ${getRadioBorderStyle(isActive)}`}
				>
					{isActive && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-full h-full p-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					)}
				</div>
				<span className="mr-1.5 text-sm font-medium text-ds-fg">{label}</span>
			</div>
			{description && (
				<div className="text-xs text-ds-fg-muted text-right">{description}</div>
			)}
		</button>
	)
}

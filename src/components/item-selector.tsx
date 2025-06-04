import type React from 'react'

interface Props {
	isActive: boolean
	onClick: () => void
	key: string
	label: string
	description?: string | React.ReactNode
	className?: string
}
export function ItemSelector({
	isActive,
	onClick,
	key,
	label,
	description,
	className,
}: Props) {
	const getRadioBorderStyle = (isSelected: boolean) => {
		if (isSelected) {
			return 'border-blue-500 bg-blue-500'
		}

		return 'border-content'
	}

	return (
		<div
			key={key}
			onClick={onClick}
			className={`flex cursor-pointer flex-col items-start  p-3 transition-all border rounded-lg ${className} ${
				isActive
					? 'border-primary/50 bg-primary/10'
					: 'bg-content border-content hover:!border-primary/50'
			}`}
		>
			<div className="flex items-center justify-center mb-2">
				<div className={`w-4 h-4 rounded-full border ${getRadioBorderStyle(isActive)}`}>
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
				<span className={'mr-1.5 text-sm font-medium text-content'}>{label}</span>
			</div>
			{description && <p className={'text-sm text-muted text-right'}>{description}</p>}
		</div>
	)
}

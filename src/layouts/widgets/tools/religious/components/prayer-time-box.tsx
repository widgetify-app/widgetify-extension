import type { IconType } from 'react-icons'

interface PrayerTimeBoxProps {
	title: string
	value?: string
	icon: IconType
	index: number
	isLoading?: boolean
	iconColorStyle: string
}

export const PrayerTimeBox = ({
	title,
	value,
	icon: Icon,
	index,
	isLoading = false,
	iconColorStyle,
}: PrayerTimeBoxProps) => {
	return (
		<div
			className={
				'rounded-lg bg-base-300/70 hover:bg-base-300 border border-base-300/70 px-[.3rem] py-4 flex flex-col items-center transition-all duration-300'
			}
			style={{ animationDelay: `${index * 0.1}s` }}
		>
			<div className={`${iconColorStyle} mb-2`}>
				<Icon size={18} />
			</div>
			<div className={'text-content text-[0.6rem] mb-1'}>{title}</div>
			{isLoading ? (
				<div
					className={
						'text-content font-medium h-4 w-12 bg-current rounded-xl opacity-30 animate-pulse'
					}
				/>
			) : (
				<div className={'text-content font-medium'}>{value}</div>
			)}
		</div>
	)
}

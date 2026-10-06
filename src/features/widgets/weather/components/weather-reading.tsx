import { cn } from '@/common/utils/cn'
import type { TemperatureUnit } from '../types'
import { formatTemperature } from '../utils/format-temperature'

interface WeatherIconProps {
	src?: string
	className: string
}

export function WeatherIcon({ src, className }: WeatherIconProps) {
	if (!src) {
		return (
			<span
				aria-hidden="true"
				className={cn('flex-none rounded-full skeleton', className)}
			/>
		)
	}

	return <img src={src} alt="" className={cn('flex-none object-contain', className)} />
}

interface TemperatureProps {
	value?: number
	unit: TemperatureUnit
	className: string
}

export function Temperature({ value, unit, className }: TemperatureProps) {
	const temp = formatTemperature(value, unit)

	return (
		<span
			className={cn(
				'font-extrabold leading-none tracking-tight tabular-nums text-fg-strong',
				className
			)}
		>
			{value === undefined ? (
				<span
					aria-hidden="true"
					className="inline-block align-middle rounded-sm skeleton h-[0.8em] w-[1.5em]"
				/>
			) : (
				<>
					<data value={temp.value}>{temp.value}</data>
					{temp.symbol}
				</>
			)}
		</span>
	)
}

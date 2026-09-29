import { cn } from '@/common/utils/cn'

interface SliderProps {
	label: string
	value: number
	min: number
	max: number
	step?: number
	onChange: (value: number) => void
	className?: string
}

export function Slider({
	label,
	value,
	min,
	max,
	step,
	onChange,
	className,
}: SliderProps) {
	return (
		<input
			type="range"
			aria-label={label}
			min={min}
			max={max}
			step={step}
			value={value}
			onChange={(e) => onChange(Number(e.target.value))}
			className={cn('w-full range range-xs', className)}
		/>
	)
}

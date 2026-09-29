import type React from 'react'
import { cn } from '@/common/utils/cn'

interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
	value: number
	size: string
}

export function ProgressRing({
	value,
	size,
	className,
	style,
	...props
}: ProgressRingProps) {
	return (
		<div
			className={cn('radial-progress', className)}
			style={{ '--value': value, '--size': size, ...style } as React.CSSProperties}
			{...props}
		/>
	)
}

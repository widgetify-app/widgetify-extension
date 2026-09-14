import { Tooltip } from '@/components/ui'
import type React from 'react'

interface FloatingBadgeProps {
	name: string
	src: string
	top?: string | number
	bottom?: string | number
	left?: string | number
	right?: string | number
	rotate?: string | number
	scale?: string | number
	glowColor?: string
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
	name,
	src,
	rotate,
	scale = 1,
	glowColor = 'rgba(255, 255, 255, 0.4)',
}) => {
	return (
		<Tooltip content={name} position="top" delay={150}>
			<div
				className="transition-transform duration-300 ease-out hover:!scale-125 cursor-pointer"
				style={{
					transform: `rotate(${rotate}deg) scale(${scale})`,
					filter: glowColor
						? `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor})`
						: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
				}}
			>
				<img
					src={src}
					alt={name}
					className="object-contain w-8 h-8 drop-shadow-md rounded-full"
				/>
			</div>
		</Tooltip>
	)
}

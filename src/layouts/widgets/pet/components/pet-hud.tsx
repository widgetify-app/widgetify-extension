import type React from 'react'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'

const HEART_COUNT = 5

interface PetHudProps {
	level: number
}

export const PetHud: React.FC<PetHudProps> = ({ level }) => {
	const filled = Math.ceil(level / (100 / HEART_COUNT))

	return (
		<div
			role="img"
			aria-label={`سیری: ${filled} از ${HEART_COUNT}`}
			className="z-10 flex items-center gap-0.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]"
		>
			{Array.from({ length: HEART_COUNT }, (_, i) => (
				<Icon
					key={`pet-heart-${i}`}
					name="heart"
					size={8}
					aria-hidden="true"
					className={cn(
						'transition-colors duration-300',
						i < filled ? 'text-error' : 'text-subtle'
					)}
				/>
			))}
		</div>
	)
}

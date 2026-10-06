import { cn } from '@/common/utils/cn'
import { PET_PREVIEW } from '../constants'
import type { PetBackground, PetTypes } from '../types'
import { PetTooltip } from './pet-tooltip'

interface PetPreviewProps {
	scene: PetBackground
	petType: PetTypes
	name: string
}

export function PetPreview({ scene, petType, name }: PetPreviewProps) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				'relative w-full overflow-hidden aspect-[8/3] rounded-widget',
				!scene.image && 'bg-fill'
			)}
			style={
				scene.image
					? {
							backgroundImage: `url(${scene.image})`,
							backgroundSize: 'auto 100%',
							backgroundPosition: 'bottom center',
						}
					: undefined
			}
		>
			<div
				className="absolute -translate-x-1/2 left-1/2"
				style={{ bottom: scene.groundOffsetPx }}
			>
				<div className="relative">
					<PetTooltip direction={1} content={name} />
					<img
						key={petType}
						src={PET_PREVIEW[petType]}
						alt=""
						className="w-auto h-8"
					/>
				</div>
			</div>
		</div>
	)
}

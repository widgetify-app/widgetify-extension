import { cn } from '@/common/utils/cn'

interface PetScenePreviewProps {
	scene?: string | null
	sprite?: string
	size?: 'sm' | 'lg'
}

export function PetScenePreview({ scene, sprite, size = 'sm' }: PetScenePreviewProps) {
	return (
		<span
			aria-hidden="true"
			className="absolute inset-0 block bg-bottom bg-cover bg-fill-2"
			style={
				scene
					? { backgroundImage: `url("${scene}")`, imageRendering: 'pixelated' }
					: undefined
			}
		>
			{sprite && (
				<img
					src={sprite}
					alt=""
					className={cn(
						'absolute w-auto -translate-x-1/2 left-1/2 bottom-[9%]',
						size === 'lg' ? 'h-16' : 'h-10'
					)}
					style={{ imageRendering: 'pixelated' }}
				/>
			)}
		</span>
	)
}

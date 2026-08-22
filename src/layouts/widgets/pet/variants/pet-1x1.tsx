import { usePetContext } from '@/layouts/widgetify-card/pets/pet.context'
import { PetEmojiMap } from '../pet-emoji-map'
import { cn } from '@/common/utils/cn'

export function PetCompactSquare() {
	const { petType, getCurrentPetName, getPetHungryState } = usePetContext()
	if (!petType) return null

	const petName = getCurrentPetName(petType)
	const hungryState = getPetHungryState(petType)
	const level = hungryState?.level ?? 100

	return (
		<div className="relative flex flex-col items-center justify-between h-full w-full p-2.5 text-center select-none">
			<span className="text-xs font-bold text-content truncate max-w-20">
				{petName}
			</span>

			<div className="text-3xl my-auto animate-bounce">
				{PetEmojiMap[petType] || '🐾'}
			</div>

			<div className="w-full flex flex-col gap-1 items-center">
				<div className="w-16 bg-base-300 rounded-full h-1.5 overflow-hidden">
					<div
						className={cn(
							'h-full transition-all duration-300',
							level > 50
								? 'bg-success'
								: level > 20
									? 'bg-warning'
									: 'bg-error'
						)}
						style={{ width: `${level}%` }}
					/>
				</div>
				<span className="text-[9px] text-base-content/60">{level}% غذا</span>
			</div>
		</div>
	)
}

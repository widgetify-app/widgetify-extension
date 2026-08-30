import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/ui'
import { TextInput } from '@/components/text-input'
import { BASE_PET_OPTIONS, PetTypes } from '@/layouts/widgetify-card/pets/pet.context'
const persianType: Record<string, string> = {
	dog: 'سگ',
	chicken: 'مرغ',
	crab: 'خرچنگ',
}
export function PetSettings() {
	const [petType, setPetType] = useState<PetTypes>(PetTypes.DOG_AKITA)
	const [petName, setPetName] = useState<string>('')

	useEffect(() => {
		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets?.petOptions) {
				const type = storedPets.petType || PetTypes.DOG_AKITA
				setPetType(type)
				setPetName(storedPets.petOptions[type].name)
			}
		}

		load()
	}, [])

	async function onChangePetName(value: string) {
		callEvent('updatedPetSettings', {
			petName: value,
			petType,
		})
		setPetName(value)
	}

	async function onChangePetType(value: PetTypes) {
		const storedPets = await getFromStorage('pets')
		if (storedPets?.petOptions[value]) {
			setPetName(storedPets.petOptions[value].name)
		}
		setPetType(value)

		callEvent('updatedPetSettings', {
			petType: value,
		})
	}

	const availablePets = Object.entries(BASE_PET_OPTIONS.petOptions).map(
		([key, value]) => ({
			value: key as PetTypes,
			label: `${value.emoji} ${persianType[value.type] || ''} - ${value.name}`,
		})
	)

	return (
		<div className="flex flex-col w-full max-w-xl mx-auto">
			<div className={'p-2 rounded-lg border border-content'}>
				<p className={'mb-3 font-medium text-content'}>نوع حیوان خانگی</p>
				<div className="grid grid-cols-3 gap-1 mb-2">
					{availablePets.map((pet) => (
						<ItemSelector
							isActive={petType === pet.value}
							onClick={() => onChangePetType(pet.value)}
							key={pet.value}
							label={pet.label}
							className="w-full! h-12! p-1.5! text-[11px]! text-center"
						/>
					))}
				</div>

				<p className={'mb-3 font-medium text-content'}>نام حیوان خانگی</p>
				<TextInput
					type="text"
					value={petName}
					onChange={(value) => onChangePetName(value)}
					placeholder={'اسم دلخواه...'}
				/>

				<div className="p-3 mt-2 border rounded-lg border-primary/30 bg-primary/20">
					<p className="mb-1 text-xs font-medium text-primary">
						💡 نکات مراقبت:
					</p>
					<ul className="text-xs text-primary space-y-0.5">
						<li>• برای بازی با حیوان خانگی، روی آن کلیک کنید</li>
						<li>• برای غذا دادن به حیوان، در محیط اطراف کلیک کنید</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import CustomCheckbox from '@/components/checkbox'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import {
	getBorderColor,
	getDescriptionTextStyle,
	getHeadingTextStyle,
	useTheme,
} from '@/context/theme.context'
import { PetTypes } from '@/layouts/widgetify-card/pets/pet.context'
import { useEffect, useState } from 'react'

export function PetSettings() {
	const { theme } = useTheme()
	const [enablePets, setEnablePets] = useState(true)
	const [petType, setPetType] = useState<PetTypes>(PetTypes.DOG_AKITA)
	const [petName, setPetName] = useState<string>('')

	useEffect(() => {
		async function load() {
			const storedPets = await getFromStorage('pets')
			if (storedPets) {
				setEnablePets(storedPets.enablePets)
				setPetType(storedPets.petType || PetTypes.DOG_AKITA)
				setPetName(storedPets.petOptions[petType].name)
			}
		}

		load()
	}, [])

	async function onChangeEnablePets(value: boolean) {
		callEvent('updatedPetSettings', {
			enablePets: value,
			petName,
			petType,
		})
		setEnablePets(value)
	}

	async function onChangePetName(value: string) {
		callEvent('updatedPetSettings', {
			enablePets,
			petName: value,
			petType,
		})
		setPetName(value)
	}

	async function onChangePetType(value: PetTypes) {
		callEvent('updatedPetSettings', {
			enablePets,
			petName,
			petType: value,
		})
		setPetType(value)
		const storedPets = await getFromStorage('pets')
		if (storedPets?.petOptions[value]) {
			setPetName(storedPets.petOptions[value].name)
		}
	}

	return (
		<SectionPanel title="قابلیت‌های ظاهری" delay={0.2}>
			<div className="flex flex-col gap-4">
				<div className="flex items-start gap-3">
					<CustomCheckbox
						checked={enablePets}
						onChange={() => onChangeEnablePets(!enablePets)}
					/>
					<div onClick={() => onChangeEnablePets(!enablePets)} className="cursor-pointer">
						<p className={`font-medium ${getHeadingTextStyle(theme)}`}>
							نمایش حیوان خانگی
						</p>
						<p className={`text-sm font-light ${getDescriptionTextStyle(theme)}`}>
							نمایش حیوان خانگی تعاملی روی صفحه اصلی
						</p>
					</div>
				</div>

				{enablePets && (
					<div className={`p-4 mt-4  rounded-lg border ${getBorderColor(theme)}`}>
						<p className={`mb-3 font-medium ${getHeadingTextStyle(theme)}`}>
							نوع حیوان خانگی
						</p>
						<div className="flex flex-col gap-2 mb-4">
							<div className="flex items-center gap-2">
								<input
									type="radio"
									id="dog-akita"
									name="pet-type"
									checked={petType === PetTypes.DOG_AKITA}
									onChange={() => onChangePetType(PetTypes.DOG_AKITA)}
									className="cursor-pointer"
								/>
								<label
									htmlFor="dog-akita"
									className={`cursor-pointer ${getHeadingTextStyle(theme)}`}
								>
									سگ آکیتا
								</label>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="radio"
									id="chicken"
									name="pet-type"
									checked={petType === PetTypes.CHICKEN}
									onChange={() => onChangePetType(PetTypes.CHICKEN)}
									className="cursor-pointer"
								/>
								<label
									htmlFor="chicken"
									className={`cursor-pointer ${getHeadingTextStyle(theme)}`}
								>
									مرغ
								</label>
							</div>
						</div>

						<p className={`mb-3 font-medium ${getHeadingTextStyle(theme)}`}>
							نام حیوان خانگی
						</p>
						<TextInput
							type="text"
							value={petName}
							onChange={(value) => onChangePetName(value)}
							placeholder={petType === PetTypes.DOG_AKITA ? 'آکیتا' : 'قدقدپور'}
						/>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}

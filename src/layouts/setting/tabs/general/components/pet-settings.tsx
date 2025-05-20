import { getFromStorage, setToStorage } from '@/common/storage'
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
import { useEffect, useState } from 'react'

export function PetSettings() {
	const { theme } = useTheme()
	const [enablePets, setEnablePets] = useState(true)
	const [petName, setPetName] = useState<string>('')
	const getHintTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			default:
				return 'text-gray-400'
		}
	}

	useEffect(() => {
		async function load() {
			const storedPets = await getFromStorage('pets')
			console.log('storedPets', storedPets)
			if (storedPets) {
				setEnablePets(storedPets.enablePets)
				setPetName(storedPets.petName)
			}
		}

		load()
	}, [])

	async function onChangeEnablePets(value: boolean) {
		// await setToStorage('pets', { enablePets: value, petName })
		callEvent('updatedPetSettings', {
			enablePets: value,
			petName,
		})
		setEnablePets(value)
	}

	async function onChangePetName(value: string) {
		// await setToStorage('pets', { enablePets, petName: value })
		callEvent('updatedPetSettings', {
			enablePets,
			petName: value,
		})
		setPetName(value)
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
							نام حیوان خانگی
						</p>
						<TextInput
							type="text"
							value={petName}
							onChange={(value) => onChangePetName(value)}
							placeholder="آکیتا"
						/>
						<p className={`mt-2 text-xs ${getHintTextStyle()}`}>
							در صورت خالی بودن، نام پیش‌فرض "آکیتا" استفاده می‌شود.
						</p>
					</div>
				)}
			</div>
		</SectionPanel>
	)
}

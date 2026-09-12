import { useEffect, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { TextInput } from '@/components/ui'
import { PetOptionTile } from './components/pet-option-tile'
import {
	BASE_PET_OPTIONS,
	DEFAULT_PET_BACKGROUND,
	PET_BACKGROUND_LIST,
	PET_ICON,
	PET_PREVIEW,
	PET_SPECIES_LABEL,
} from './constants'
import { type PetBackgroundId, PetTypes } from './types'
import { getPetBackground } from './utils/get-pet-background'

const PET_LIST = Object.keys(BASE_PET_OPTIONS.petOptions) as PetTypes[]

const TIPS = [
	'برای بازی با حیوان خانگی، روی آن کلیک کنید',
	'برای غذا دادن، در محیط اطراف آن کلیک کنید',
]

export function PetSettings() {
	const [petType, setPetType] = useState<PetTypes>(PetTypes.DOG)
	const [petName, setPetName] = useState('')
	const [background, setBackground] = useState<PetBackgroundId>(DEFAULT_PET_BACKGROUND)

	useEffect(() => {
		async function load() {
			const stored = await getFromStorage('pets')
			if (!stored?.petOptions) return

			const type = stored.petType || PetTypes.DOG
			setPetType(type)
			setPetName(stored.petOptions[type].name)
			setBackground(stored.background || DEFAULT_PET_BACKGROUND)
		}

		load()
	}, [])

	function onChangePetName(value: string) {
		setPetName(value)
		callEvent('updatedPetSettings', { petName: value, petType })
	}

	async function onChangePetType(value: PetTypes) {
		const stored = await getFromStorage('pets')

		setPetType(value)
		setPetName(
			stored?.petOptions[value]?.name ?? BASE_PET_OPTIONS.petOptions[value].name
		)
		callEvent('updatedPetSettings', { petType: value })
	}

	function onChangeBackground(value: PetBackgroundId) {
		setBackground(value)
		callEvent('updatedPetSettings', { petType, background: value })
	}

	const displayName = petName.trim() || BASE_PET_OPTIONS.petOptions[petType].name
	const scene = getPetBackground(background)

	return (
		<div className="flex flex-col gap-4">
			<section className="flex items-center gap-3 p-3 border rounded-2xl border-content bg-base-300/25">
				<div
					className="flex items-end justify-center overflow-hidden border w-16 h-16 shrink-0 rounded-2xl border-content"
					style={{
						backgroundImage: `url(${scene.image})`,
						backgroundSize: 'cover',
						backgroundPosition: 'bottom center',
					}}
				>
					<img
						key={petType}
						src={PET_PREVIEW[petType]}
						alt=""
						className="object-contain w-11 h-11 drop-shadow-sm"
					/>
				</div>

				<div className="flex items-center min-w-0 gap-2">
					<h3 className="text-base font-semibold truncate text-content">
						{displayName}
					</h3>
					<span className="px-2 py-0.5 text-[10px] leading-[1.7] border rounded-full text-content border-content bg-base-300">
						{PET_SPECIES_LABEL[petType]}
					</span>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h4 id="pet-type-label" className="text-sm font-medium text-content">
					حیوان خانگی
				</h4>
				<div
					role="group"
					aria-labelledby="pet-type-label"
					className="grid grid-cols-5 gap-2"
				>
					{PET_LIST.map((type) => (
						<PetOptionTile
							key={type}
							label={PET_SPECIES_LABEL[type]}
							selected={petType === type}
							onSelect={() => onChangePetType(type)}
						>
							<img
								src={PET_ICON[type]}
								alt=""
								className="object-contain w-9 h-9 mt-2"
							/>
						</PetOptionTile>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h4
					id="pet-background-label"
					className="text-sm font-medium text-content"
				>
					محیط
				</h4>
				<div
					role="group"
					aria-labelledby="pet-background-label"
					className="grid grid-cols-3 gap-2"
				>
					{PET_BACKGROUND_LIST.map((item) => (
						<PetOptionTile
							key={item.id}
							label={item.label}
							selected={background === item.id}
							onSelect={() => onChangeBackground(item.id)}
						>
							<div
								className="w-full h-12"
								style={{
									backgroundImage: `url(${item.image})`,
									backgroundSize: 'cover',
									backgroundPosition: 'bottom center',
								}}
							/>
						</PetOptionTile>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="pet-name" className="text-sm font-medium text-content">
					نام حیوان خانگی
				</label>
				<TextInput
					id="pet-name"
					size="sm"
					maxLength={20}
					value={petName}
					onChange={onChangePetName}
					placeholder="اسم دلخواه..."
				/>
			</section>

			<ul className="flex flex-col gap-1.5 p-3 border rounded-xl border-primary/20 bg-primary/10">
				{TIPS.map((tip) => (
					<li key={tip} className="flex items-center gap-2">
						<span className="w-1 h-1 rounded-full shrink-0 bg-primary/70" />
						<span className="text-[11px] leading-[1.7] text-content">
							{tip}
						</span>
					</li>
				))}
			</ul>
		</div>
	)
}

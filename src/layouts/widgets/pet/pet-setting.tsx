import { useCallback, useEffect, useRef, useState } from 'react'
import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { TextInput, Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { PetOptionTile } from './components/pet-option-tile'
import {
	BASE_PET_OPTIONS,
	DEFAULT_PET_BACKGROUND,
	PET_BACKGROUND_LIST,
	PET_ICON,
	PET_NAME_SAVE_DEBOUNCE_MS,
	PET_PREVIEW,
	PET_SPECIES_LABEL,
} from './constants'
import { type PetBackgroundId, type PetMeta, PetTypes } from './types'
import { getPetBackground } from './utils/get-pet-background'

const PET_LIST = Object.keys(BASE_PET_OPTIONS.petOptions) as PetTypes[]

const TIPS = [
	'واسه غذا دادن، هر جای محیطش کلیک کن',
	'اسمش رو ببینی؟ موس رو ببر روش',
	'همزمان بیشتر از سه تا غذا نمی‌شه گذاشت',
]

interface PetSettingsProps {
	instanceId?: string
	size?: { w: number; h: number }
}

export function PetSettings({ instanceId }: PetSettingsProps = {}) {
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()
	const targetWidget = instanceId
		? runtimeLayout.find((w) => w.instanceId === instanceId)
		: null
	const targetMeta = targetWidget?.meta as PetMeta | undefined

	const [petType, setPetType] = useState<PetTypes>(targetMeta?.petType || PetTypes.DOG)
	const [petName, setPetName] = useState(targetMeta?.petName || '')
	const [background, setBackground] = useState<PetBackgroundId>(
		targetMeta?.background || DEFAULT_PET_BACKGROUND
	)

	useEffect(() => {
		async function load() {
			if (instanceId && targetMeta) {
				const type = targetMeta.petType || PetTypes.DOG
				setPetType(type)
				setPetName(targetMeta.petName || BASE_PET_OPTIONS.petOptions[type].name)
				setBackground(targetMeta.background || DEFAULT_PET_BACKGROUND)
				return
			}

			const stored = await getFromStorage('pets')
			if (!stored?.petOptions) return

			const type = stored.petType || PetTypes.DOG
			setPetType(type)
			setPetName(stored.petOptions[type].name)
			setBackground(stored.background || DEFAULT_PET_BACKGROUND)
		}

		load()
	}, [instanceId, targetMeta])

	const saveNameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (saveNameTimerRef.current) clearTimeout(saveNameTimerRef.current)
		}
	}, [])

	const onChangePetName = useCallback(
		(value: string) => {
			setPetName(value)
			callEvent('updatedPetSettings', { instanceId, petName: value, petType })

			if (!instanceId) return

			if (saveNameTimerRef.current) clearTimeout(saveNameTimerRef.current)
			saveNameTimerRef.current = setTimeout(() => {
				saveNameTimerRef.current = null
				updateWidgetSettings(instanceId, {
					...targetMeta,
					petType,
					petName: value,
					background,
				})
			}, PET_NAME_SAVE_DEBOUNCE_MS)
		},
		[instanceId, petType, background, targetMeta, updateWidgetSettings]
	)

	async function onChangePetType(value: PetTypes) {
		const stored = await getFromStorage('pets')

		const fallbackName =
			stored?.petOptions[value]?.name ?? BASE_PET_OPTIONS.petOptions[value].name

		setPetType(value)
		setPetName(fallbackName)

		if (instanceId) {
			updateWidgetSettings(instanceId, {
				...targetMeta,
				petType: value,
				petName: fallbackName,
				background,
			})
		}
		callEvent('updatedPetSettings', {
			instanceId,
			petType: value,
			petName: fallbackName,
		})
	}

	function onChangeBackground(value: PetBackgroundId) {
		setBackground(value)
		if (instanceId) {
			updateWidgetSettings(instanceId, {
				...targetMeta,
				petType,
				petName,
				background: value,
			})
		}
		callEvent('updatedPetSettings', {
			instanceId,
			petType,
			background: value,
		})
	}

	const displayName = petName.trim() || BASE_PET_OPTIONS.petOptions[petType].name
	const scene = getPetBackground(background)

	return (
		<div className="flex flex-col gap-4">
			<section className="flex items-center gap-3 p-3 border rounded-2xl border-content bg-base-content/5">
				<div
					className="flex items-end justify-center overflow-hidden border w-16 h-16 shrink-0 rounded-2xl border-content"
					style={{
						backgroundImage: scene.image ? `url(${scene.image})` : undefined,
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

				<div className="flex items-center justify-between min-w-0 flex-1">
					<div className="flex items-center gap-2 min-w-0">
						<h3 className="text-base font-semibold truncate text-content">
							{displayName}
						</h3>
						<span className="px-2 py-0.5 text-[10px] leading-[1.7] border rounded-full text-content border-content bg-base-content/10">
							{PET_SPECIES_LABEL[petType]}
						</span>
					</div>

					<Tooltip
						content={
							<ul
								className="flex flex-col gap-1.5 p-1 text-right"
								dir="rtl"
							>
								{TIPS.map((tip) => (
									<li key={tip} className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
										<span className="text-xs leading-relaxed text-content">
											{tip}
										</span>
									</li>
								))}
							</ul>
						}
					>
						<button
							type="button"
							aria-label="راهنمای تعامل با حیوان خانگی"
							className="flex items-center justify-center rounded-full w-7 h-7 text-muted opacity-70 transition-ui hover:opacity-100 hover:bg-base-content/10 focus-visible:focus-ring"
						>
							<Icon name="info" className="w-4 h-4" aria-hidden="true" />
						</button>
					</Tooltip>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<h4 id="pet-type-label" className="text-sm font-medium text-content">
					حیوان خانگی
				</h4>
				<div aria-labelledby="pet-type-label" className="grid grid-cols-5 gap-2">
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
					aria-labelledby="pet-background-label"
					className="grid grid-cols-4 gap-2"
				>
					{PET_BACKGROUND_LIST.map((item) => (
						<PetOptionTile
							key={item.id}
							label={item.label}
							selected={background === item.id}
							onSelect={() => onChangeBackground(item.id)}
						>
							<div
								className="flex items-center justify-center w-full h-12 bg-base-content/10"
								style={
									item.image
										? {
												backgroundImage: `url(${item.image})`,
												backgroundSize: 'cover',
												backgroundPosition: 'bottom center',
											}
										: undefined
								}
							></div>
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
		</div>
	)
}

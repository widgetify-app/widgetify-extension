import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { TextInput, Tooltip } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useGetUserInventory } from '@/services/market/get-user-inventory.hook'
import { MarketItemType } from '@/services/market/market.interface'
import { useFreeWidgets } from '@/features/widgets/widgets.context'
import { PetOptionGrid } from './components/pet-option-grid'
import { PetOptionTile } from './components/pet-option-tile'
import {
	BASE_PET_OPTIONS,
	DEFAULT_PET_BACKGROUND,
	PET_BACKGROUND_LIST,
	PET_BACKGROUNDS,
	PET_ICON,
	PET_NAME_SAVE_DEBOUNCE_MS,
	PET_PREVIEW,
	PET_SPECIES_LABEL,
} from './constants'
import { type PetBackground, type PetBackgroundId, type PetMeta, PetTypes } from './types'
import { getPetBackground } from './utils/get-pet-background'
import { resolvePetSettings } from './utils/resolve-pet-settings'

const FREE_PETS = new Set<PetTypes>([
	PetTypes.DOG,
	PetTypes.CAT,
	PetTypes.CHICKEN,
	PetTypes.CRAB,
	PetTypes.FROG,
])
const FREE_BACKGROUNDS = new Set<string>(['none', 'forest', 'autumn', 'beach'])

const TIPS = [
	'واسه غذا دادن، هر جای محیطش کلیک کن',
	'اسمش رو ببینی؟ موس رو ببر روش',
	'همزمان بیشتر از سه تا غذا نمی‌شه گذاشت',
]

interface PetSettingsProps {
	instanceId?: string
	size?: { w: number; h: number }
}

const PET_ITEM_TYPES = [MarketItemType.PET, MarketItemType.PET_BACKGROUND].join(',')

export function PetSettings({ instanceId }: PetSettingsProps = {}) {
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()
	const { isAuthenticated } = useAuth()
	const { data: inventory } = useGetUserInventory(isAuthenticated, {
		type: PET_ITEM_TYPES,
	})

	const targetWidget = instanceId
		? runtimeLayout.find((w) => w.instanceId === instanceId)
		: null
	const targetMeta = targetWidget?.meta as PetMeta | undefined

	const [petType, setPetType] = useState<PetTypes>(targetMeta?.petType || PetTypes.DOG)
	const [petName, setPetName] = useState(targetMeta?.petName || '')
	const [background, setBackground] = useState<PetBackgroundId>(
		targetMeta?.background || DEFAULT_PET_BACKGROUND
	)

	const ownedPets = new Set<string>(inventory?.pets?.map((p) => p.value) || [])
	const ownedBackgrounds = new Set<string>(
		inventory?.pet_backgrounds?.map((b) => b.value) || []
	)

	const allPets: PetTypes[] = useMemo(() => {
		const list: PetTypes[] = Array.from(FREE_PETS)
		const seen = new Set<string>(FREE_PETS)

		if (inventory?.pets) {
			for (const item of inventory.pets) {
				const val = item.value as PetTypes
				if (val && !seen.has(val) && Object.values(PetTypes).includes(val)) {
					list.push(val)
					seen.add(val)
				}
			}
		}

		return list
	}, [inventory?.pets])

	const allBackgrounds: PetBackground[] = useMemo(() => {
		const map = new Map<string, PetBackground>()
		for (const bg of PET_BACKGROUND_LIST) {
			map.set(bg.id, bg)
		}

		if (inventory?.pet_backgrounds) {
			for (const item of inventory.pet_backgrounds) {
				const key = item.value
				if (!map.has(key)) {
					map.set(key, {
						id: key,
						label: item.name || key,
						image: item.imageUrl || item.previewUrl || null,
						groundOffsetPx: Number(item.meta?.groundOffsetPx ?? 0),
					})
				}
			}
		}

		return Array.from(map.values())
	}, [inventory?.pet_backgrounds])

	const isPetLocked = (type: PetTypes) => {
		if (FREE_PETS.has(type)) return false
		return !ownedPets.has(type)
	}

	const isBackgroundLocked = (bgId: PetBackgroundId) => {
		if (FREE_BACKGROUNDS.has(bgId)) return false
		return !ownedBackgrounds.has(bgId)
	}

	useEffect(() => {
		let cancelled = false

		async function load() {
			const stored = await getFromStorage('pets')
			if (cancelled) return

			const resolved = resolvePetSettings(
				BASE_PET_OPTIONS,
				stored ?? null,
				targetMeta
			)
			const type = resolved.petType ?? PetTypes.DOG
			setPetType(type)
			setPetName(resolved.petOptions[type].name)
			setBackground(resolved.background)
		}

		load()
		return () => {
			cancelled = true
		}
	}, [targetMeta])

	const latestRef = useRef({ petType, petName, background, targetMeta })
	latestRef.current = { petType, petName, background, targetMeta }

	const saveNameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const cancelPendingNameSave = useCallback(() => {
		if (saveNameTimerRef.current) clearTimeout(saveNameTimerRef.current)
		saveNameTimerRef.current = null
	}, [])

	useEffect(() => cancelPendingNameSave, [cancelPendingNameSave])

	const saveToWidget = useCallback(
		(changes: PetMeta) => {
			if (!instanceId) return
			const latest = latestRef.current
			updateWidgetSettings(instanceId, {
				...latest.targetMeta,
				petType: latest.petType,
				petName: latest.petName,
				background: latest.background,
				...changes,
			})
		},
		[instanceId, updateWidgetSettings]
	)

	const saveGlobal = useCallback(async (changes: PetMeta) => {
		const persisted = (await getFromStorage('pets')) ?? BASE_PET_OPTIONS
		const type = changes.petType ?? persisted.petType ?? PetTypes.DOG
		const current = persisted.petOptions?.[type] ?? BASE_PET_OPTIONS.petOptions[type]

		await setToStorage('pets', {
			...persisted,
			petType: type,
			background: changes.background ?? persisted.background,
			petOptions: changes.petName
				? {
						...persisted.petOptions,
						[type]: { ...current, name: changes.petName },
					}
				: persisted.petOptions,
		})
	}, [])

	const onChangePetName = useCallback(
		(value: string) => {
			setPetName(value)

			if (!instanceId) {
				saveGlobal({ petName: value, petType }).then(() =>
					callEvent('updatedPetSettings', { petName: value, petType })
				)
				return
			}

			callEvent('updatedPetSettings', { instanceId, petName: value, petType })
			cancelPendingNameSave()
			saveNameTimerRef.current = setTimeout(() => {
				saveNameTimerRef.current = null
				saveToWidget({ petName: value })
			}, PET_NAME_SAVE_DEBOUNCE_MS)
		},
		[instanceId, petType, cancelPendingNameSave, saveToWidget, saveGlobal]
	)

	async function onChangePetType(value: PetTypes) {
		if (isPetLocked(value)) {
			Analytics.event('pet_market_opened')
			callEvent('openMarketModal', { filter: MarketItemType.PET })
			return
		}

		const stored = await getFromStorage('pets')
		const fallbackName =
			stored?.petOptions?.[value]?.name ?? BASE_PET_OPTIONS.petOptions[value].name

		cancelPendingNameSave()
		setPetType(value)
		setPetName(fallbackName)

		if (instanceId) saveToWidget({ petType: value, petName: fallbackName })
		else await saveGlobal({ petType: value, petName: fallbackName })

		callEvent('updatedPetSettings', {
			instanceId,
			petType: value,
			petName: fallbackName,
		})
	}

	async function onChangeBackground(value: PetBackgroundId) {
		if (isBackgroundLocked(value)) {
			Analytics.event('pet_background_market_opened')
			callEvent('openMarketModal', { filter: MarketItemType.PET })
			return
		}

		setBackground(value)

		const selectedBg = allBackgrounds.find((b) => b.id === value)
		const bgMeta =
			selectedBg && !PET_BACKGROUNDS[value as keyof typeof PET_BACKGROUNDS]
				? {
						image: selectedBg.image,
						groundOffsetPx: selectedBg.groundOffsetPx,
					}
				: undefined

		if (instanceId) {
			saveToWidget({ background: value, backgroundMeta: bgMeta })
		} else {
			await saveGlobal({ background: value, petType, backgroundMeta: bgMeta })
		}

		callEvent('updatedPetSettings', {
			instanceId,
			petType,
			background: value,
		})
	}

	const displayName = petName.trim() || BASE_PET_OPTIONS.petOptions[petType].name
	const currentBg = allBackgrounds.find((b) => b.id === background)
	const scene = getPetBackground(
		background,
		currentBg
			? { image: currentBg.image, groundOffsetPx: currentBg.groundOffsetPx }
			: targetMeta?.backgroundMeta
	)

	return (
		<div className="flex flex-col gap-4">
			<section className="flex items-center gap-3 p-3 border rounded-2xl border-surface-3 bg-surface-2">
				<div
					className="flex items-end justify-center overflow-hidden border w-16 h-16 shrink-0 rounded-2xl border-surface-3"
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
						<h3 className="text-base font-semibold truncate text-fg">
							{displayName}
						</h3>
						<span className="px-2 py-0.5 text-3xs leading-relaxed border rounded-full text-fg border-surface-3 bg-surface-2">
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
										<span className="w-1.5 h-1.5 rounded-full shrink-0 bg-brand" />
										<span className="text-xs leading-relaxed text-fg">
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
							className="flex items-center justify-center rounded-full w-7 h-7 text-fg-muted opacity-70 transition-ui hover:opacity-100 hover:bg-fill-2 focus-visible:focus-ring"
						>
							<Icon name="info" className="w-4 h-4" aria-hidden="true" />
						</button>
					</Tooltip>
				</div>
			</section>

			<section className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h4 id="pet-type-label" className="text-sm font-medium text-fg">
						حیوان خانگی
					</h4>
					<button
						type="button"
						onClick={() => {
							Analytics.event('pet_market_opened')
							callEvent('openMarketModal', { filter: MarketItemType.PET })
						}}
						className="flex items-center gap-1 text-3xs text-fg-muted hover:text-brand transition-ui cursor-pointer"
					>
						<Icon name="shoppingBag" size={12} />
						<span>فروشگاه</span>
					</button>
				</div>
				<PetOptionGrid
					labelledBy="pet-type-label"
					className="grid-cols-5 max-h-49"
				>
					{allPets.map((type) => (
						<PetOptionTile
							key={type}
							label={PET_SPECIES_LABEL[type]}
							selected={petType === type}
							locked={isPetLocked(type)}
							onSelect={() => onChangePetType(type)}
						>
							<img
								src={PET_ICON[type]}
								alt=""
								className="object-contain w-9 h-9 mt-2"
							/>
						</PetOptionTile>
					))}
				</PetOptionGrid>
			</section>

			<section className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h4 id="pet-background-label" className="text-sm font-medium text-fg">
						محیط
					</h4>
					<button
						type="button"
						onClick={() => {
							Analytics.event('pet_background_market_opened')
							callEvent('openMarketModal', { filter: MarketItemType.PET })
						}}
						className="flex items-center gap-1 text-3xs text-fg-muted hover:text-brand transition-ui cursor-pointer"
					>
						<Icon name="shoppingBag" size={12} />
						<span>فروشگاه</span>
					</button>
				</div>
				<PetOptionGrid
					labelledBy="pet-background-label"
					className="grid-cols-4 max-h-52"
				>
					{allBackgrounds.map((item) => (
						<PetOptionTile
							key={item.id}
							label={item.label}
							selected={background === item.id}
							locked={isBackgroundLocked(item.id)}
							onSelect={() => onChangeBackground(item.id)}
						>
							<div
								className="flex items-center justify-center w-full h-12 bg-fill-2"
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
				</PetOptionGrid>
			</section>

			<section className="flex flex-col gap-2">
				<label htmlFor="pet-name" className="text-sm font-medium text-fg">
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

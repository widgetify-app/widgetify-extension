import { useState } from 'react'
import { Button, Chip, EmptyState, TabNavigation } from '@/components/ui'
import { CATEGORY_COPY } from '../constants'
import { useItemState } from '../hooks/use-item-state'
import { useStoreItems } from '../hooks/use-store-items'
import type { CategoryType, ItemState, StoreItem } from '../types'
import { faNumber, sortByState } from '../utils/store-item'
import { CategoryHeader } from './category-header'
import { StoreItemTile } from './store-item/store-item-tile'
import { TileGrid, TileSkeletons } from './tile-grid'

type Ownership = 'all' | 'buyable' | 'mine'
type PetKind = 'PET' | 'PET_BACKGROUND'

const OWNERSHIP_STATES: Record<Ownership, ItemState[]> = {
	all: ['locked', 'free', 'owned', 'active'],
	buyable: ['locked', 'free'],
	mine: ['owned', 'active'],
}

const PET_KINDS: { id: PetKind; label: string }[] = [
	{ id: 'PET', label: 'حیوون‌ها' },
	{ id: 'PET_BACKGROUND', label: 'محیط‌ها' },
]

interface CategoryViewProps {
	type: CategoryType
	defaultPetKind: PetKind
	selectedId: string | null
	onOpen: (item: StoreItem) => void
}

export function CategoryView({
	type,
	defaultPetKind,
	selectedId,
	onOpen,
}: CategoryViewProps) {
	const { items, isLoading, isError, refetch } = useStoreItems()
	const stateOf = useItemState()
	const [ownership, setOwnership] = useState<Ownership>('all')
	const [petKind, setPetKind] = useState<PetKind>(defaultPetKind)
	const copy = CATEGORY_COPY[type]

	const shownType = type === 'PET' ? petKind : type
	const source = items.filter((item) => item.type === shownType)
	const countOf = (filter: Ownership) =>
		source.filter((item) => OWNERSHIP_STATES[filter].includes(stateOf(item))).length
	const visible = sortByState(
		source.filter((item) => OWNERSHIP_STATES[ownership].includes(stateOf(item))),
		stateOf
	)

	const filterChip = (filter: Ownership, label: string) => (
		<Chip
			size="sm"
			selected={ownership === filter}
			onClick={() => setOwnership(filter)}
		>
			{label}
			<span className="opacity-60 ms-1 tabular-nums">
				{faNumber(countOf(filter))}
			</span>
		</Chip>
	)

	return (
		<>
			<CategoryHeader title={copy.title} description={copy.description}>
				<div className="flex flex-wrap items-center gap-2">
					{type === 'PET' && (
						<TabNavigation
							tabs={PET_KINDS}
							activeTab={petKind}
							onTabClick={setPetKind}
							tabMode="simple"
							size="sm"
							className="w-44 me-2"
						/>
					)}
					{filterChip('all', 'همه')}
					{filterChip('buyable', 'قابل خرید')}
					{filterChip('mine', 'مال من')}
				</div>
			</CategoryHeader>

			{isError ? (
				<EmptyState
					icon="shoppingBag"
					title="آیتم‌ها نیومدن"
					description="اینترنتت رو چک کن و دوباره امتحان کن"
					action={
						<Button size="sm" onClick={() => refetch()}>
							دوباره امتحان کن
						</Button>
					}
				/>
			) : isLoading ? (
				<TileSkeletons count={6} wide={copy.wide} />
			) : visible.length === 0 ? (
				<EmptyCategory
					ownership={ownership}
					onShowAll={() => setOwnership('all')}
				/>
			) : (
				<TileGrid wide={copy.wide}>
					{visible.map((item) => (
						<StoreItemTile
							key={item.id}
							item={item}
							state={stateOf(item)}
							selected={selectedId === item.id}
							onOpen={() => onOpen(item)}
						/>
					))}
				</TileGrid>
			)}
		</>
	)
}

function EmptyCategory({
	ownership,
	onShowAll,
}: {
	ownership: Ownership
	onShowAll: () => void
}) {
	if (ownership === 'all') {
		return <EmptyState icon="shoppingBag" title="هنوز چیزی اینجا نیست" />
	}
	return (
		<EmptyState
			icon="shoppingBag"
			title={ownership === 'mine' ? 'هنوز چیزی از اینجا نخریدی' : 'همه‌ش مال توئه'}
			description={
				ownership === 'mine'
					? 'هر چی بخری اینجا کنار هم می‌مونه'
					: 'فعلاً آیتم تازه‌ای برای خرید نیست'
			}
			action={
				<Button size="sm" onClick={onShowAll}>
					همه رو نشونم بده
				</Button>
			}
		/>
	)
}

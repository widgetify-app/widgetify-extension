import { Button, EmptyState } from '@/components/ui'
import { useGetWallpapers } from '@/services/wallpapers/get-wallpaper-categories.hook'
import { StoreItemTile } from '../components/store-item/store-item-tile'
import { WallpaperTile } from '../components/store-item/wallpaper-tile'
import { TileSkeletons } from '../components/tile-grid'
import { useItemState } from '../hooks/use-item-state'
import { useStoreItems } from '../hooks/use-store-items'
import { useStoreTryOn } from '../store-try-on.context'
import type { StoreItem, StoreItemType, StoreView } from '../types'
import { sortByState, wallpaperToStoreItem } from '../utils/store-item'
import { FeaturedBanner } from './components/featured-banner'
import { Shelf } from './components/shelf'

const SHELF_SIZE = 8

interface StorefrontProps {
	selectedId: string | null
	onOpen: (item: StoreItem) => void
	onNavigate: (view: StoreView) => void
}

export function Storefront({ selectedId, onOpen, onNavigate }: StorefrontProps) {
	const { items, isLoading, isError, refetch } = useStoreItems()
	const { data: wallpaperData } = useGetWallpapers(
		{ market: true, limit: SHELF_SIZE },
		true
	)
	const stateOf = useItemState()
	const { tryOn } = useStoreTryOn()

	if (isError) {
		return (
			<EmptyState
				icon="shoppingBag"
				title="فروشگاه باز نشد"
				description="اینترنتت رو چک کن و دوباره امتحان کن"
				action={
					<Button size="sm" onClick={() => refetch()}>
						دوباره امتحان کن
					</Button>
				}
			/>
		)
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<span aria-hidden="true" className="block h-44 rounded-2xl skeleton" />
				<TileSkeletons count={4} />
			</div>
		)
	}

	const featured = items.find((item) => stateOf(item) === 'locked')
	const wallpapers = (wallpaperData?.wallpapers ?? []).map(wallpaperToStoreItem)
	const shelf = (...types: StoreItemType[]) =>
		sortByState(
			items.filter((item) => types.includes(item.type)),
			stateOf
		)
			.slice(0, SHELF_SIZE)
			.map((item) => (
				<StoreItemTile
					key={item.id}
					item={item}
					state={stateOf(item)}
					selected={selectedId === item.id}
					onOpen={() => onOpen(item)}
				/>
			))

	return (
		<div className="flex flex-col gap-6">
			{featured && (
				<FeaturedBanner item={featured} onOpen={() => onOpen(featured)} />
			)}

			<Shelf title="تصویر زمینه‌ها" onSeeAll={() => onNavigate('WALLPAPER')}>
				{wallpapers.map((item) => (
					<WallpaperTile
						key={item.id}
						item={item}
						state={stateOf(item)}
						selected={selectedId === item.id}
						onPick={() => onOpen(item)}
						onTry={() => tryOn(item)}
					/>
				))}
			</Shelf>

			<Shelf title="تم‌ها" onSeeAll={() => onNavigate('THEME')}>
				{shelf('THEME')}
			</Shelf>

			<Shelf title="حیوون‌ها و محیط‌هاشون" onSeeAll={() => onNavigate('PET')}>
				{shelf('PET', 'PET_BACKGROUND')}
			</Shelf>

			<Shelf title="فونت‌ها" wide onSeeAll={() => onNavigate('FONT')}>
				{shelf('FONT')}
			</Shelf>

			<Shelf title="عنوان تب" wide onSeeAll={() => onNavigate('BROWSER_TITLE')}>
				{shelf('BROWSER_TITLE')}
			</Shelf>
		</div>
	)
}

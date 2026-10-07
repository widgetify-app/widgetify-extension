import type { Wallpaper } from '@/common/types/wallpaper.interface'
import type { MarketItem, UserInventoryItem } from '@/services/market/market.interface'
import type {
	ItemState,
	StoreItem,
	StoreItemType,
	StoreTarget,
	StoreView,
	WallpaperAccess,
	WallpaperKind,
} from '../types'

const MARKET_ITEM_TYPES: StoreItemType[] = [
	'THEME',
	'FONT',
	'BROWSER_TITLE',
	'PET',
	'PET_BACKGROUND',
]

const TRY_ON_TYPES: StoreItemType[] = ['THEME', 'FONT', 'BROWSER_TITLE', 'WALLPAPER']

const STATE_ORDER: Record<ItemState, number> = { locked: 0, free: 1, owned: 2, active: 3 }

const VIEW_BY_FILTER: Record<string, StoreView> = {
	THEME: 'THEME',
	FONT: 'FONT',
	BROWSER_TITLE: 'BROWSER_TITLE',
	PET: 'PET',
	PET_BACKGROUND: 'PET',
	wallpapers: 'WALLPAPER',
}

const VIEW_BY_TAB: Record<string, StoreView> = {
	coins: 'wallet',
	wallpapers: 'WALLPAPER',
	other: 'home',
}

export function marketItemToStoreItem(item: MarketItem): StoreItem | null {
	const type = MARKET_ITEM_TYPES.find((known) => known === item.type)
	if (!type) return null

	return {
		id: item.id,
		type,
		name: item.name,
		value: item.itemValue ?? '',
		price: item.price,
		isOwned: item.isOwned,
		canTryOn: item.canPreview !== false && TRY_ON_TYPES.includes(type),
		description: item.description || undefined,
		image: item.imageUrl || item.previewUrl || undefined,
	}
}

export function inventoryItemToStoreItem(
	item: UserInventoryItem,
	type: StoreItemType
): StoreItem {
	return {
		id: item.id,
		type,
		name: item.name || 'بدون نام',
		value: item.value,
		price: 0,
		isOwned: true,
		canTryOn: false,
		description: item.description || undefined,
	}
}

export function wallpaperCaption(wallpaper: Wallpaper): string {
	return wallpaper.name && wallpaper.name !== '-' ? wallpaper.name : ''
}

export function wallpaperToStoreItem(wallpaper: Wallpaper): StoreItem {
	return {
		id: wallpaper.id,
		type: 'WALLPAPER',
		name: wallpaperCaption(wallpaper) || 'تصویر زمینه',
		value: wallpaper.id,
		price: wallpaper.coin ?? 0,
		isOwned: Boolean(wallpaper.isOwned),
		canTryOn: true,
		image: wallpaper.previewSrc,
		wallpaper,
	}
}

export function isAnimatedWallpaper(wallpaper: Wallpaper): boolean {
	return (
		wallpaper.type === 'VIDEO' ||
		Boolean(wallpaper.src?.endsWith('.gif')) ||
		Boolean(wallpaper.previewSrc?.endsWith('.gif'))
	)
}

export function matchesWallpaperFilter(
	wallpaper: Wallpaper,
	access: WallpaperAccess,
	kind: WallpaperKind
): boolean {
	const animated = isAnimatedWallpaper(wallpaper)
	if (kind === 'image' && animated) return false
	if (kind === 'animated' && !animated) return false
	if (access === 'free') return !wallpaper.coin
	if (access === 'coin') return Boolean(wallpaper.coin) && !wallpaper.isOwned
	if (access === 'mine') return Boolean(wallpaper.isOwned)
	return true
}

export function getItemState(item: StoreItem, activeValue?: string): ItemState {
	if (activeValue && activeValue === item.value) return 'active'
	if (item.isOwned) return 'owned'
	if (item.price === 0) return 'free'
	return 'locked'
}

export function needsPurchase(item: StoreItem): boolean {
	if (item.isOwned) return false
	return item.type !== 'WALLPAPER' || item.price > 0
}

export function uniqueByValue(items: StoreItem[]): StoreItem[] {
	const seen = new Set<string>()
	return items.filter((item) => {
		if (seen.has(item.value)) return false
		seen.add(item.value)
		return true
	})
}

export function sortByState(
	items: StoreItem[],
	stateOf: (item: StoreItem) => ItemState
): StoreItem[] {
	return [...items].sort((a, b) => STATE_ORDER[stateOf(a)] - STATE_ORDER[stateOf(b)])
}

export function toStoreTarget(tab?: string, filter?: string): StoreTarget {
	const view = (filter && VIEW_BY_FILTER[filter]) || (tab && VIEW_BY_TAB[tab]) || 'home'
	return { view, petKind: filter === 'PET_BACKGROUND' ? 'PET_BACKGROUND' : 'PET' }
}

export function pickTopUpPackage<T extends { coin: number; price: number }>(
	packages: T[],
	shortfall: number
): T | undefined {
	const enough = packages.filter((pkg) => pkg.coin >= shortfall)
	if (enough.length === 0) return [...packages].sort((a, b) => b.coin - a.coin)[0]
	return [...enough].sort((a, b) => a.price - b.price)[0]
}

export function pricePerHundredCoins(pkg: { coin: number; price: number }): number {
	return Math.round((pkg.price / pkg.coin) * 100)
}

export function bestValuePackageId<T extends { id: string; coin: number; price: number }>(
	packages: T[]
): string | undefined {
	if (packages.length < 2) return undefined
	return [...packages].sort(
		(a, b) => pricePerHundredCoins(a) - pricePerHundredCoins(b)
	)[0].id
}

export function faNumber(value: number): string {
	return value.toLocaleString('fa-IR')
}

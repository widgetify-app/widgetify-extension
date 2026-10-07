import { describe, expect, it } from 'bun:test'
import type { Wallpaper } from '@/common/types/wallpaper.interface'
import { type MarketItem, MarketItemType } from '@/services/market/market.interface'
import type { StoreItem } from '../types'
import {
	bestValuePackageId,
	getItemState,
	marketItemToStoreItem,
	matchesWallpaperFilter,
	needsPurchase,
	pickTopUpPackage,
	toStoreTarget,
	uniqueByValue,
	wallpaperToStoreItem,
} from '../utils/store-item'

function marketItem(overrides: Partial<MarketItem> = {}): MarketItem {
	return {
		id: 'item-1',
		name: 'نازگل',
		description: '',
		type: MarketItemType.THEME,
		price: 80,
		meta: {},
		previewUrl: null,
		itemValue: 'naazgol',
		isOwned: false,
		...overrides,
	}
}

function storeItem(overrides: Partial<StoreItem> = {}): StoreItem {
	return {
		id: 'item-1',
		type: 'THEME',
		name: 'نازگل',
		value: 'naazgol',
		price: 80,
		isOwned: false,
		canTryOn: true,
		...overrides,
	}
}

const PACKAGES = [
	{ id: 'starter', coin: 180, price: 39000 },
	{ id: 'silver', coin: 380, price: 69000 },
	{ id: 'gold', coin: 850, price: 199000 },
	{ id: 'platinum', coin: 2200, price: 249000 },
]

describe('marketItemToStoreItem', () => {
	it('drops a type this version cannot show, so it never reaches a buy button', () => {
		expect(
			marketItemToStoreItem(marketItem({ type: 'STICKER' as MarketItemType }))
		).toBe(null)
	})

	it('lets only themes, fonts and tab titles be tried on', () => {
		const pet = marketItemToStoreItem(
			marketItem({ type: MarketItemType.PET, itemValue: 'owl', canPreview: true })
		)
		const hiddenTheme = marketItemToStoreItem(marketItem({ canPreview: false }))
		expect(pet?.canTryOn).toBe(false)
		expect(hiddenTheme?.canTryOn).toBe(false)
		expect(marketItemToStoreItem(marketItem())?.canTryOn).toBe(true)
	})
})

describe('wallpaperToStoreItem', () => {
	const wallpaper: Wallpaper = {
		id: 'wp-1',
		name: '-',
		type: 'IMAGE',
		src: 'full.jpg',
		previewSrc: 'small.jpg',
		coin: 80,
	}

	it('names a wallpaper the server left as a dash', () => {
		expect(wallpaperToStoreItem(wallpaper).name).toBe('تصویر زمینه')
	})

	it('compares by id, the value the wallpaper context keeps', () => {
		expect(wallpaperToStoreItem(wallpaper).value).toBe('wp-1')
	})
})

describe('matchesWallpaperFilter', () => {
	const bought: Wallpaper = {
		id: 'wp-2',
		name: 'قطار شب',
		type: 'VIDEO',
		src: 'train.mp4',
		previewSrc: 'train.jpg',
		coin: 80,
		isOwned: true,
	}

	it('keeps a bought wallpaper out of the ones still for sale', () => {
		expect(matchesWallpaperFilter(bought, 'coin', 'all')).toBe(false)
		expect(matchesWallpaperFilter(bought, 'mine', 'all')).toBe(true)
	})

	it('counts a video as animated and not as a still', () => {
		expect(matchesWallpaperFilter(bought, 'all', 'animated')).toBe(true)
		expect(matchesWallpaperFilter(bought, 'all', 'image')).toBe(false)
	})

	it('counts a gif as animated even though the server calls it an image', () => {
		const gif: Wallpaper = { ...bought, type: 'IMAGE', src: 'rain.gif', coin: 0 }
		expect(matchesWallpaperFilter(gif, 'free', 'animated')).toBe(true)
	})
})

describe('uniqueByValue', () => {
	it('shows an item the inventory and the store both list once, as the inventory has it', () => {
		const fromInventory = storeItem({
			id: 'inventory-7',
			name: 'کهربا',
			value: 'luxury',
		})
		const fromStore = storeItem({ id: 'market-3', name: 'کهربا', value: 'luxury' })
		expect(uniqueByValue([fromInventory, fromStore])).toEqual([fromInventory])
	})
})

describe('getItemState', () => {
	it('calls the item in use active even when it is owned', () => {
		expect(getItemState(storeItem({ isOwned: true }), 'naazgol')).toBe('active')
	})

	it('never matches an empty value to an empty active value', () => {
		expect(getItemState(storeItem({ value: '', price: 0 }), '')).toBe('free')
	})

	it('locks a paid item nobody owns', () => {
		expect(getItemState(storeItem(), 'light')).toBe('locked')
	})
})

describe('needsPurchase', () => {
	it('asks for a free market item to be claimed before it can be used', () => {
		expect(needsPurchase(storeItem({ price: 0 }))).toBe(true)
	})

	it('lets a free wallpaper be picked straight away', () => {
		expect(needsPurchase(storeItem({ type: 'WALLPAPER', price: 0 }))).toBe(false)
	})

	it('never charges for something already owned', () => {
		expect(needsPurchase(storeItem({ isOwned: true }))).toBe(false)
	})
})

describe('toStoreTarget', () => {
	it('opens the pet section on its scenes for a pet background', () => {
		expect(toStoreTarget(undefined, 'PET_BACKGROUND')).toEqual({
			view: 'PET',
			petKind: 'PET_BACKGROUND',
		})
	})

	it('keeps the old coins tab working for callers that still send it', () => {
		expect(toStoreTarget('coins').view).toBe('wallet')
	})

	it('opens the showcase when nothing is asked for', () => {
		expect(toStoreTarget().view).toBe('home')
	})
})

describe('pickTopUpPackage', () => {
	it('picks the cheapest package that covers the shortfall', () => {
		expect(pickTopUpPackage(PACKAGES, 200)?.id).toBe('silver')
	})

	it('falls back to the largest package when none covers it', () => {
		expect(pickTopUpPackage(PACKAGES, 5000)?.id).toBe('platinum')
	})
})

describe('bestValuePackageId', () => {
	it('marks the package with the lowest price per coin', () => {
		expect(bestValuePackageId(PACKAGES)).toBe('platinum')
	})

	it('marks nothing when there is nothing to compare', () => {
		expect(bestValuePackageId(PACKAGES.slice(0, 1))).toBe(undefined)
	})
})

import { t } from '@/common/i18n'
import { Theme } from '@/context/theme.context'
import type { IconName } from '@/icons'
import type {
	AppearanceItemType,
	CategoryType,
	StoreItem,
	StoreItemType,
	StoreView,
} from './types'

interface ItemTypeMeta {
	label: string
	icon: IconName
	changes: string
	whereToChange: string
}

export const ITEM_TYPE_META: Record<StoreItemType, ItemTypeMeta> = {
	WALLPAPER: {
		label: t('market.wallpaperBrowser.wallpaperLabel'),
		icon: 'images',
		changes: t('market.product.wallpaperBlurb'),
		whereToChange: t('market.product.wallpaperSettingsPath'),
	},
	THEME: {
		label: t('market.product.themeTitle'),
		icon: 'theme',
		changes: t('market.product.themeBlurb'),
		whereToChange: t('market.product.appearanceSettingsPath'),
	},
	FONT: {
		label: t('market.product.fontTitle'),
		icon: 'pen',
		changes: t('market.product.fontBlurb'),
		whereToChange: t('market.product.appearanceSettingsPath'),
	},
	PET: {
		label: t('market.product.petTitle'),
		icon: 'paw',
		changes: t('market.product.petBlurb'),
		whereToChange: t('market.product.petSettingsPath'),
	},
	PET_BACKGROUND: {
		label: t('market.product.petEnvTitle'),
		icon: 'image',
		changes: t('market.product.petEnvBlurb'),
		whereToChange: t('market.product.petSettingsPath'),
	},
	BROWSER_TITLE: {
		label: t('market.product.tabTitleTitle'),
		icon: 'globe',
		changes: t('market.product.tabTitleBlurb'),
		whereToChange: t('market.product.appearanceSettingsPath'),
	},
}

export const STORE_NAV: { view: StoreView; label: string; icon: IconName }[] = [
	{ view: 'home', label: t('market.product.showcaseTitle'), icon: 'compass' },
	{
		view: 'WALLPAPER',
		label: t('market.wallpaperBrowser.wallpaperLabel'),
		icon: 'images',
	},
	{ view: 'THEME', label: t('market.product.themeTitle'), icon: 'theme' },
	{ view: 'FONT', label: t('market.product.fontTitle'), icon: 'pen' },
	{ view: 'PET', label: t('market.product.petTitle'), icon: 'paw' },
	{ view: 'BROWSER_TITLE', label: t('market.product.tabTitleTitle'), icon: 'globe' },
]

export const CATEGORY_COPY: Record<
	CategoryType,
	{ title: string; description: string; wide?: boolean }
> = {
	THEME: {
		title: t('market.product.themeTitle'),
		description: t('market.product.themeShowcaseBody'),
	},
	FONT: {
		title: t('market.product.fontTitle'),
		description: t('market.product.fontShowcaseBody'),
		wide: true,
	},
	BROWSER_TITLE: {
		title: t('market.product.tabTitleTitle'),
		description: t('market.product.tabTitleShowcaseBody'),
		wide: true,
	},
	PET: {
		title: t('market.product.petTitle'),
		description: t('market.product.petShowcaseBody'),
	},
}

export const MARKET_ITEMS_LIMIT = 100

export const APPEARANCE_INVENTORY_TYPES = 'THEME,FONT,BROWSER_TITLE'

export const INVENTORY_LIST: Record<
	AppearanceItemType,
	'themes' | 'fonts' | 'browser_titles'
> = {
	THEME: 'themes',
	FONT: 'fonts',
	BROWSER_TITLE: 'browser_titles',
}

export const DEFAULT_BROWSER_TITLE: StoreItem = {
	id: 'default',
	type: 'BROWSER_TITLE',
	name: t('market.product.themeDefault'),
	value: '✨ New Tab',
	price: 0,
	isOwned: true,
	canTryOn: false,
}

function bundled(type: AppearanceItemType, value: string, name: string): StoreItem {
	return {
		id: `${type}-${value}`,
		type,
		name,
		value,
		price: 0,
		isOwned: true,
		canTryOn: false,
	}
}

export const BUNDLED_OPTIONS: Record<AppearanceItemType, StoreItem[]> = {
	THEME: [
		bundled('THEME', Theme.Light, t('market.product.themeLight')),
		bundled('THEME', Theme.Dark, t('market.product.themeDark')),
		bundled('THEME', Theme.Glass, t('market.product.themeGlass')),
		bundled('THEME', Theme.Icy, t('market.product.themeIcy')),
		bundled('THEME', Theme.Zarna, t('market.product.fontZarna')),
	],
	FONT: [
		bundled('FONT', 'Vazir', t('market.product.fontVazir')),
		bundled('FONT', 'Samim', t('market.product.fontSamim')),
		bundled('FONT', 'Pofak', t('market.product.fontPofak')),
		bundled('FONT', 'rooyin', t('market.product.fontRoyin')),
	],
	BROWSER_TITLE: [DEFAULT_BROWSER_TITLE],
}

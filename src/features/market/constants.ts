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
		label: 'تصویر زمینه',
		icon: 'images',
		changes: 'پس‌زمینه‌ی کل صفحه',
		whereToChange: 'تنظیمات › تصویر زمینه‌ها',
	},
	THEME: {
		label: 'تم',
		icon: 'theme',
		changes: 'رنگ ویجت‌ها، منوها و پنجره‌ها',
		whereToChange: 'تنظیمات › ظاهری',
	},
	FONT: {
		label: 'فونت',
		icon: 'pen',
		changes: 'نوشته‌های همه‌ی بخش‌های ویجتیفای',
		whereToChange: 'تنظیمات › ظاهری',
	},
	PET: {
		label: 'حیوان خانگی',
		icon: 'paw',
		changes: 'حیوونی که توی ویجت پت زندگی می‌کنه',
		whereToChange: 'تنظیمات ویجت پت',
	},
	PET_BACKGROUND: {
		label: 'محیط حیوون',
		icon: 'image',
		changes: 'پس‌زمینه‌ی ویجت پت',
		whereToChange: 'تنظیمات ویجت پت',
	},
	BROWSER_TITLE: {
		label: 'عنوان تب',
		icon: 'globe',
		changes: 'اسمی که روی تب مرورگر می‌بینی',
		whereToChange: 'تنظیمات › ظاهری',
	},
}

export const STORE_NAV: { view: StoreView; label: string; icon: IconName }[] = [
	{ view: 'home', label: 'ویترین', icon: 'compass' },
	{ view: 'WALLPAPER', label: 'تصویر زمینه', icon: 'images' },
	{ view: 'THEME', label: 'تم', icon: 'theme' },
	{ view: 'FONT', label: 'فونت', icon: 'pen' },
	{ view: 'PET', label: 'حیوان خانگی', icon: 'paw' },
	{ view: 'BROWSER_TITLE', label: 'عنوان تب', icon: 'globe' },
]

export const CATEGORY_COPY: Record<
	CategoryType,
	{ title: string; description: string; wide?: boolean }
> = {
	THEME: {
		title: 'تم',
		description:
			'رنگ‌بندی کل ویجتیفای. هر پیش‌نمایش روی تصویر زمینه‌ی خودت نشون داده می‌شه.',
	},
	FONT: {
		title: 'فونت',
		description: 'فونت همه‌ی نوشته‌های ویجتیفای، از ساعت تا منوها.',
		wide: true,
	},
	BROWSER_TITLE: {
		title: 'عنوان تب',
		description: 'اسمی که روی تب مرورگرت می‌بینی، تا بین تب‌ها زود پیداش کنی.',
		wide: true,
	},
	PET: {
		title: 'حیوان خانگی',
		description: 'یه هم‌خونه برای ویجت پت، و محیطی که توش زندگی کنه.',
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
	name: 'پیش‌فرض',
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
		bundled('THEME', Theme.Light, 'روشن'),
		bundled('THEME', Theme.Dark, 'تیره'),
		bundled('THEME', Theme.Glass, 'شیشه‌ای'),
		bundled('THEME', Theme.Icy, 'یخی'),
		bundled('THEME', Theme.Zarna, 'زرنا'),
	],
	FONT: [
		bundled('FONT', 'Vazir', 'وزیر'),
		bundled('FONT', 'Samim', 'صمیم'),
		bundled('FONT', 'Pofak', 'پفـک'),
		bundled('FONT', 'rooyin', 'رویین'),
	],
	BROWSER_TITLE: [DEFAULT_BROWSER_TITLE],
}

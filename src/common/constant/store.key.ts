export enum StoreKey {
	CURRENCIES = 'CURRENCIES',
	hasShownPwaModal = 'hasShownPwaModal',
	CURRENCY_UPDATED_AT = 'CURRENCY_UPDATED_AT',
	SELECTED_CITY = 'SELECTED_CITY',
	CURRENT_WEATHER = 'CURRENT_WEATHER',
	LAYOUT_ORDER = 'LAYOUT_ORDER',
	LAYOUT_COUNTS = 'LAYOUT_COUNTS',
	Todos = 'Todos',
	Wallpaper = 'Wallpaper',
	General_setting = 'General_setting',
	Bookmarks = 'Bookmarks',
	DeletedBookmarks = 'DeletedBookmarks',
	Show_Welcome_Modal = 'Show_Welcome_Modal',
}
export type StoreKeyType = StoreKey | `currency:${string}` | 'ga_client_id'

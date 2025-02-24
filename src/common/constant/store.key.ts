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
}
export type StoreKeyType = StoreKey | `currency:${string}`

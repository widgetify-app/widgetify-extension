export type ComboTabType = 'news' | 'currency'

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		comboTabs: ComboTabType
	}
}

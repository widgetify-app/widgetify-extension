export type YadkarTab = 'todos' | 'notes' | 'habits'

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		yadkar_tab: YadkarTab
	}
}

export type MiniAppWindows = Record<string, number>

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		miniAppWindows: MiniAppWindows
	}
}

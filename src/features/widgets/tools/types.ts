export enum ToolsTab {
	pomodoro = 'pomodoro',
	'religious-time' = 'religious-time',
	'currency-converter' = 'currency-converter',
}

export type ToolsTabType = keyof typeof ToolsTab

declare module '@/common/constants/store-keys' {
	interface StorageKV {
		toolsTab: ToolsTabType
	}
}

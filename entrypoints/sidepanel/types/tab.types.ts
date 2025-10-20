export interface Tab {
	id: number
	title: string
	url: string
	favIconUrl?: string
	active: boolean
	audible: boolean
	muted: boolean
	windowId: number
}

export interface TabGroup {
	id: number
	title?: string
	color: string
	tabs: Tab[]
}

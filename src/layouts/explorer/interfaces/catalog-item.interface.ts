export interface LinkItem {
	name?: string | null
	url: string
	type?: 'SITE' | 'REMOTE_IFRAME'
	icon?: string
	badge?: string
	badgeColor?: string
	badgeAnimate?: 'bounce' | 'pulse'
	span?: {
		col?: number | null
		row?: number | null
	}
	backgroundSrc?: string | null
	height?: number
}

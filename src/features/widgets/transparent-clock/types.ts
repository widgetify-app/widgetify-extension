export type TransparentClockVariant = 'persian' | 'english'

export type TransparentClockFace = 'classic' | 'outline' | 'stacked'

export type TransparentClockFinish = 'solid' | 'glass'

export type TransparentClockDatePosition = 'above' | 'below' | 'hidden'

export type TransparentClockColor = 'wallpaper' | `#${string}`

export interface TransparentClockStyle {
	face: TransparentClockFace
	finish: TransparentClockFinish
	weight: number
	scale: number
	color: TransparentClockColor
	glassTint: number
	datePosition: TransparentClockDatePosition
}

export interface TransparentClockStyleMeta {
	clockFace?: TransparentClockFace
	clockFinish?: TransparentClockFinish
	clockWeight?: number
	clockScale?: number
	clockColor?: TransparentClockColor
	clockGlassTint?: number
	clockDatePosition?: TransparentClockDatePosition
}

export type TransparentClockScript = 'persian' | 'latin'

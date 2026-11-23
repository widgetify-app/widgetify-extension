import critter1 from '@/assets/images/share/avatars/critter-1.svg'
import critter2 from '@/assets/images/share/avatars/critter-2.svg'
import critter3 from '@/assets/images/share/avatars/critter-3.svg'
import critter4 from '@/assets/images/share/avatars/critter-4.svg'
import critter5 from '@/assets/images/share/avatars/critter-5.svg'
import critter6 from '@/assets/images/share/avatars/critter-6.svg'
import critter7 from '@/assets/images/share/avatars/critter-7.svg'
import critter8 from '@/assets/images/share/avatars/critter-8.svg'
import critter9 from '@/assets/images/share/avatars/critter-9.svg'
import critter10 from '@/assets/images/share/avatars/critter-10.svg'
import glossImage from '@/assets/images/share/share-gloss.webp'
import glowImage from '@/assets/images/share/share-glow.webp'
import logoImage from '@/assets/images/share/logo.webp'
import { t } from '@/common/i18n'
import { drawRoundedRect } from './canvas'

const CRITTERS = [
	critter1,
	critter2,
	critter3,
	critter4,
	critter5,
	critter6,
	critter7,
	critter8,
	critter9,
	critter10,
]

export const SHARE_LIGHT_INK = '#ffffff'
export const SHARE_DARK_INK = '#1f2240'

const persianNumber = new Intl.NumberFormat('fa-IR', { useGrouping: false })

export function toPersianDigits(value: number): string {
	return persianNumber.format(value)
}

export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()

		image.crossOrigin = 'anonymous'
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error('Could not load share artwork'))
		image.src = src
	})
}

const SHARE_WIDTH = 432
const STORY_HEIGHT = 768
const CONTENT_TOP = 96
export const SHARE_CENTER_X = SHARE_WIDTH / 2

const OUTPUT_SCALE = 2.5
const FONT_STACK = 'Vazir, Tahoma, Arial, sans-serif'
const EMOJI_STACK =
	'"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
const FONT_WEIGHTS = [400, 700, 800, 900]
const FOOTER_CENTER_Y = 522
const FOOTER_LOGO_SIZE = 20
const FOOTER_GAP = 6

export function shareFont(weight: number, size: number): string {
	return `${weight} ${size}px ${FONT_STACK}`
}

export function shareEmojiFont(size: number): string {
	return `${size}px ${EMOJI_STACK}`
}

export async function loadShareFonts() {
	await Promise.all(
		FONT_WEIGHTS.map((weight) => document.fonts.load(shareFont(weight, 16)))
	)
}

export function prepareShareCanvas(
	canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
	const ctx = canvas.getContext('2d')

	if (!ctx) return null

	canvas.width = SHARE_WIDTH * OUTPUT_SCALE
	canvas.height = STORY_HEIGHT * OUTPUT_SCALE
	ctx.scale(OUTPUT_SCALE, OUTPUT_SCALE)
	ctx.translate(0, CONTENT_TOP)
	ctx.direction = 'rtl'

	return ctx
}

export function drawShareText(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	options: { weight: number; size: number; color: string; align: CanvasTextAlign }
) {
	ctx.font = shareFont(options.weight, options.size)
	ctx.fillStyle = options.color
	ctx.textAlign = options.align
	ctx.textBaseline = 'middle'
	ctx.fillText(text, x, y)
}

export function drawShareBackground(ctx: CanvasRenderingContext2D, color: string) {
	ctx.fillStyle = color
	ctx.fillRect(0, -CONTENT_TOP, SHARE_WIDTH, STORY_HEIGHT)
}

export async function drawShareGlow(ctx: CanvasRenderingContext2D) {
	const glow = await loadImage(glowImage)

	ctx.drawImage(glow, 0, -CONTENT_TOP, SHARE_WIDTH, STORY_HEIGHT)
}

export function loadShareGloss(): Promise<HTMLImageElement> {
	return loadImage(glossImage)
}

export function drawShareGloss(
	ctx: CanvasRenderingContext2D,
	gloss: HTMLImageElement,
	centerX: number,
	centerY: number,
	radius: number
) {
	ctx.drawImage(gloss, centerX - radius, centerY - radius, radius * 2, radius * 2)
}

export async function loadShareAvatar(
	avatar: string,
	name: string
): Promise<HTMLImageElement> {
	if (avatar.startsWith('https://')) {
		const picture = await loadImage(avatar).catch(() => null)
		if (picture) return picture
	}

	let hash = 0

	for (const char of name) {
		hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 2147483647
	}

	return loadImage(CRITTERS[hash % CRITTERS.length])
}

export async function drawShareFooter(ctx: CanvasRenderingContext2D, ink: string) {
	const logo = await loadImage(logoImage)
	const text = t('widgets.canvas.shareFooter')

	ctx.font = shareFont(700, 11)

	const total = FOOTER_LOGO_SIZE + FOOTER_GAP + ctx.measureText(text).width
	const logoLeft = SHARE_WIDTH / 2 + total / 2 - FOOTER_LOGO_SIZE
	const logoTop = FOOTER_CENTER_Y - FOOTER_LOGO_SIZE / 2

	ctx.save()
	drawRoundedRect(ctx, logoLeft, logoTop, FOOTER_LOGO_SIZE, FOOTER_LOGO_SIZE, 6)
	ctx.clip()
	ctx.drawImage(logo, logoLeft, logoTop, FOOTER_LOGO_SIZE, FOOTER_LOGO_SIZE)
	ctx.restore()

	drawShareText(ctx, text, logoLeft - FOOTER_GAP, FOOTER_CENTER_Y, {
		weight: 700,
		size: 11,
		color: ink,
		align: 'right',
	})
}

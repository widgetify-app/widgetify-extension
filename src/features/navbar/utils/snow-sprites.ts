const SPRITE_SIZE = 32
const CENTER = SPRITE_SIZE / 2
const ARM_COUNT = 6
const ARM_LENGTH = 13
const BRANCH_LENGTH = 5
const BRANCH_AT = 0.55
const BRANCH_ANGLE = Math.PI / 4

function drawFlake(ctx: OffscreenCanvasRenderingContext2D, color: string) {
	ctx.strokeStyle = color
	ctx.lineWidth = 2.2
	ctx.lineCap = 'round'
	ctx.translate(CENTER, CENTER)

	for (let arm = 0; arm < ARM_COUNT; arm++) {
		ctx.save()
		ctx.rotate((arm * Math.PI * 2) / ARM_COUNT)
		ctx.beginPath()
		ctx.moveTo(0, 0)
		ctx.lineTo(0, -ARM_LENGTH)
		ctx.moveTo(0, -ARM_LENGTH * BRANCH_AT)
		ctx.lineTo(
			-Math.sin(BRANCH_ANGLE) * BRANCH_LENGTH,
			-ARM_LENGTH * BRANCH_AT - Math.cos(BRANCH_ANGLE) * BRANCH_LENGTH
		)
		ctx.moveTo(0, -ARM_LENGTH * BRANCH_AT)
		ctx.lineTo(
			Math.sin(BRANCH_ANGLE) * BRANCH_LENGTH,
			-ARM_LENGTH * BRANCH_AT - Math.cos(BRANCH_ANGLE) * BRANCH_LENGTH
		)
		ctx.stroke()
		ctx.restore()
	}
}

function drawDot(ctx: OffscreenCanvasRenderingContext2D, color: string) {
	ctx.fillStyle = color
	ctx.beginPath()
	ctx.arc(CENTER, CENTER, ARM_LENGTH * 0.55, 0, Math.PI * 2)
	ctx.fill()
}

function render(
	draw: (ctx: OffscreenCanvasRenderingContext2D, color: string) => void,
	color: string
): Promise<ImageBitmap> {
	const canvas = new OffscreenCanvas(SPRITE_SIZE, SPRITE_SIZE)
	const ctx = canvas.getContext('2d')

	if (!ctx) return Promise.reject(new Error('no 2d context'))

	draw(ctx, color)

	return createImageBitmap(canvas)
}

export function createSnowSprites(color: string): Promise<ImageBitmap[]> {
	return Promise.all([render(drawFlake, color), render(drawDot, color)])
}

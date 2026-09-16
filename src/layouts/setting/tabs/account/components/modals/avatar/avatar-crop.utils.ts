import type { Area } from 'react-easy-crop'

export const MAX_AVATAR_DIMENSION = 512

export function getAvatarTargetDimensions(cropArea: { width: number; height: number }) {
	return {
		width: Math.min(cropArea.width, MAX_AVATAR_DIMENSION),
		height: Math.min(cropArea.height, MAX_AVATAR_DIMENSION),
	}
}

export async function getCroppedImageFile(
	imageSrc: string,
	cropArea: Area,
	fileName: string
): Promise<File> {
	const image = await new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = 'anonymous'
		img.onload = () => resolve(img)
		img.onerror = reject
		img.src = imageSrc
	})

	const { width: targetWidth, height: targetHeight } =
		getAvatarTargetDimensions(cropArea)

	const canvas = document.createElement('canvas')
	canvas.width = targetWidth
	canvas.height = targetHeight
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not available')

	ctx.imageSmoothingQuality = 'high'
	ctx.drawImage(
		image,
		cropArea.x,
		cropArea.y,
		cropArea.width,
		cropArea.height,
		0,
		0,
		targetWidth,
		targetHeight
	)

	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) {
				reject(new Error('Canvas is empty'))
				return
			}
			resolve(new File([blob], fileName, { type: blob.type || 'image/png' }))
		}, 'image/png')
	})
}

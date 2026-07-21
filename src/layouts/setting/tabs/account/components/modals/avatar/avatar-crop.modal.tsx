import { useCallback, useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import Modal from '@/components/modal'
import { FooterButtons } from '../footer-buttons'

interface Prop {
	show: boolean
	image: string
	onClose: () => void
	onCropComplete: (file: File) => void
}

// از روی عکس اصلی و مختصات کراپ‌شده، یک فایل جدید (کراپ‌شده) می‌سازه
async function getCroppedImageFile(
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

	const canvas = document.createElement('canvas')
	canvas.width = cropArea.width
	canvas.height = cropArea.height
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('Canvas context not available')

	ctx.drawImage(
		image,
		cropArea.x,
		cropArea.y,
		cropArea.width,
		cropArea.height,
		0,
		0,
		cropArea.width,
		cropArea.height
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

export function AvatarCropModal({ show, image, onClose, onCropComplete }: Prop) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedArea, setCroppedArea] = useState<Area | null>(null)
	const [isSaving, setIsSaving] = useState(false)

	const handleCropComplete = useCallback(
		(_croppedAreaPercent: Area, croppedAreaPixels: Area) => {
			setCroppedArea(croppedAreaPixels)
		},
		[]
	)

	const handleConfirm = async () => {
		if (!croppedArea) return
		setIsSaving(true)
		try {
			const file = await getCroppedImageFile(image, croppedArea, 'avatar.png')
			onCropComplete(file)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<Modal
			isOpen={show}
			onClose={() => onClose()}
			title="برش تصویر"
			direction="rtl"
			showCloseButton
		>
			<div className="flex flex-col w-full h-96">
				<div className="relative flex-1 overflow-hidden rounded-lg bg-base-300">
					<Cropper
						image={image}
						crop={crop}
						zoom={zoom}
						aspect={1}
						cropShape="round"
						showGrid={false}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={handleCropComplete}
					/>
				</div>

				<div className="flex items-center gap-3 px-2 mt-4">
					<span className="text-xs text-muted">بزرگنمایی</span>
					<input
						type="range"
						min={1}
						max={3}
						step={0.1}
						value={zoom}
						onChange={(e) => setZoom(Number(e.target.value))}
						className="w-full range range-xs"
					/>
				</div>

				<div className="mt-4">
					<FooterButtons
						handleConfirm={handleConfirm}
						handleCancel={onClose}
						isPending={isSaving}
					/>
				</div>
			</div>
		</Modal>
	)
}

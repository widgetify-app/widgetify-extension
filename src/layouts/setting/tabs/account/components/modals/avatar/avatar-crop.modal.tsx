import { useCallback, useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { Modal } from '@/components/ui'
import { FooterButtons } from '../footer-buttons'
import { getCroppedImageFile } from './avatar-crop.utils'

interface Prop {
	show: boolean
	image: string
	onClose: () => void
	onCropComplete: (file: File) => Promise<void> | void
	isUploading?: boolean
}

export function AvatarCropModal({
	show,
	image,
	onClose,
	onCropComplete,
	isUploading = false,
}: Prop) {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [croppedArea, setCroppedArea] = useState<Area | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)

	const handleCropComplete = useCallback(
		(_croppedAreaPercent: Area, croppedAreaPixels: Area) => {
			setCroppedArea(croppedAreaPixels)
		},
		[]
	)

	const handleConfirm = async () => {
		if (!croppedArea) return
		setIsProcessing(true)
		try {
			const file = await getCroppedImageFile(image, croppedArea, 'avatar.png')
			await onCropComplete(file)
		} finally {
			setIsProcessing(false)
		}
	}

	const isPending = isProcessing || isUploading

	return (
		<Modal
			isOpen={show}
			onClose={() => !isPending && onClose()}
			title="برش تصویر"
			direction="rtl"
			showCloseButton={!isPending}
		>
			<div className="flex flex-col w-full h-96">
				<div className="relative flex-1 overflow-hidden rounded-lg bg-raised">
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
						isPending={isPending}
					/>
				</div>
			</div>
		</Modal>
	)
}

import type { VariantProps } from 'class-variance-authority'
import { useEffect, useState } from 'react'
import { cn } from '@/common/utils/cn'
import { avatarVariants } from './avatar.variants'

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
	url?: string | null
	file?: File | null
	placeholder?: string
	className?: string
	onClick?: () => void
}

export function AvatarComponent({
	url,
	file,
	placeholder = '',
	size,
	className,
	onClick,
}: AvatarProps) {
	const [imageError, setImageError] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	useEffect(() => {
		if (file) {
			const objectUrl = URL.createObjectURL(file)
			setPreviewUrl(objectUrl)
			setImageError(false)

			return () => {
				URL.revokeObjectURL(objectUrl)
			}
		} else {
			setPreviewUrl(null)
		}
	}, [file])

	useEffect(() => {
		setImageError(false)
	}, [url])

	const handleImageError = () => {
		setImageError(true)
	}

	const displayUrl = previewUrl || url
	const shouldShowImage = displayUrl && !imageError

	return (
		<div className={cn(avatarVariants({ size }), className)} onClick={onClick}>
			{shouldShowImage ? (
				<img
					src={displayUrl}
					alt="Avatar"
					className="object-cover w-full h-full"
					onError={handleImageError}
				/>
			) : (
				<div className="font-medium text-muted">
					{placeholder.charAt(0)?.toUpperCase() || '?'}
				</div>
			)}
		</div>
	)
}

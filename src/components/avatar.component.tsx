import { useEffect, useState } from 'react'

interface AvatarProps {
	url?: string | null
	file?: File | null
	placeholder?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	onClick?: () => void
}

export function AvatarComponent({
	url,
	file,
	placeholder = '',
	size = 'md',
	className = '',
	onClick,
}: AvatarProps) {
	const [imageError, setImageError] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const sizeClasses = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-base',
		lg: 'w-12 h-12 text-lg',
		xl: 'w-16 h-16 text-xl',
	}

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
		<div
			className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${sizeClasses[size]} ${className}`}
			onClick={onClick}
		>
			{shouldShowImage ? (
				<img
					src={displayUrl}
					alt="Avatar"
					className="object-cover w-full h-full"
					onError={handleImageError}
				/>
			) : (
				<div className="font-medium text-gray-700">
					{placeholder.charAt(0)?.toUpperCase() || '?'}
				</div>
			)}
		</div>
	)
}

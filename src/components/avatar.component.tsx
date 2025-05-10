import { useState } from 'react'

interface Prop {
	url: string | null
	placeholder?: string //when url is null (e.g: S A)
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	onClick?: () => void
}
export function AvatarComponent({
	url,
	placeholder = '',
	size = 'md',
	className = '',
	onClick,
}: Prop) {
	const [imageError, setImageError] = useState(false)

	const sizeClasses = {
		xs: 'w-6 h-6 text-xs',
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 text-base',
		lg: 'w-12 h-12 text-lg',
		xl: 'w-16 h-16 text-xl',
	}

	const handleImageError = () => {
		setImageError(true)
	}

	return (
		<div
			className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${sizeClasses[size]} ${className}`}
			onClick={onClick}
		>
			{url && !imageError ? (
				<img
					src={url}
					alt="Avatar"
					className="object-cover w-full h-full"
					onError={handleImageError}
				/>
			) : (
				<div className="font-medium text-gray-700">
					{placeholder.charAt(0).toUpperCase()}
				</div>
			)}
		</div>
	)
}

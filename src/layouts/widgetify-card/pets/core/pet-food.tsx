interface PetFoodProps {
	size?: number
	className?: string
	src: string
	isDroppingFromTop?: boolean
}

export const PetFood = (props: PetFoodProps) => {
	const { size, className, src, isDroppingFromTop = false } = props

	return (
		<div className="relative inline-block">
			<img
				src={src}
				alt="Pet Food"
				style={{
					width: size ? `${size}px` : '100%',
					height: size ? `${size}px` : '100%',
					objectFit: 'contain',
				}}
				className={`${className} animate-bounce ${
					isDroppingFromTop ? 'animate-pulse' : ''
				} transition-all duration-300`}
			/>
			<div className="absolute inset-0 bg-yellow-400 rounded-full opacity-25 animate-ping" />
		</div>
	)
}

import React, { useRef, useState, useEffect } from 'react'

interface HoverPlayVideoProps {
	videoSrc: string
	posterSrc?: string
	className?: string
	style?: React.CSSProperties
	onLoadedData?: () => void
	onError?: () => void
	onClick?: (e: React.MouseEvent) => void
}

export const HoverPlayVideo: React.FC<HoverPlayVideoProps> = ({
	videoSrc,
	posterSrc,
	className,
	style,
	onLoadedData,
	onError,
	onClick,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [isHovering, setIsHovering] = useState(false)
	const [useImageFallback, setUseImageFallback] = useState(false)

	useEffect(() => {
		if (!videoRef.current || useImageFallback) return
		if (isHovering) {
			videoRef.current.play().catch(() => {})
		} else {
			videoRef.current.pause()
			videoRef.current.currentTime = 0
		}
	}, [isHovering, useImageFallback])

	const handleVideoError = () => {
		setUseImageFallback(true)
		if (onError) onError()
	}

	const handleMouseEnter = () => setIsHovering(true)
	const handleMouseLeave = () => setIsHovering(false)

	const handleClick = (e: React.MouseEvent) => {
		if (!useImageFallback && videoRef.current) {
			videoRef.current.play().catch(() => {})
		}
		onClick?.(e)
	}

	if (useImageFallback) {
		return (
			<img
				src={videoSrc}
				alt="خطا در بارگزاری ویدیو"
				className={className}
				style={style}
				onLoad={onLoadedData}
				onError={onError}
				onClick={onClick}
			/>
		)
	}

	return (
		<video
			ref={videoRef}
			src={videoSrc}
			poster={posterSrc}
			className={className}
			style={style}
			loop
			muted
			playsInline
			onLoadedData={onLoadedData}
			onError={handleVideoError}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		/>
	)
}

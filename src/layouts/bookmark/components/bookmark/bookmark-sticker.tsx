import type { Bookmark } from '../../types/bookmark.types'

export function RenderStickerPattern(bookmark: Bookmark) {
	if (!bookmark.sticker) return null

	const isImageSticker = bookmark.sticker.startsWith('http')

	const seed = bookmark.title.length % 7

	const stickerPositions = [
		{
			top: `${5 + seed}px`,
			left: `${5 - seed}px`,
			rotate: `${15 + seed * 3}deg`,
			size: 25,
			opacity: 0.55,
			zIndex: 2,
			scale: 1.05 + seed * 0.02,
			shadow: '0 2px 4px rgba(0,0,0,0.2)',
		},
		{
			top: `${4 - seed}px`,
			right: `${5 + seed}px`,
			rotate: `${-20 - seed * 4}deg`,
			size: 22,
			opacity: 0.48,
			zIndex: 2,
			scale: 1 + seed * 0.01,
			shadow: '0 1px 3px rgba(0,0,0,0.15)',
		},
		{
			bottom: `${7 + seed}px`,
			left: `${9 - seed}px`,
			rotate: `${10 - seed * 2.5}deg`,
			size: 20,
			opacity: 0.42,
			zIndex: 1,
			scale: 0.98 + seed * 0.01,
			shadow: '0 1px 2px rgba(0,0,0,0.1)',
		},
		{
			bottom: `${9 - seed}px`,
			right: `${8 + seed}px`,
			rotate: `${25 + seed * 3.5}deg`,
			size: 23,
			opacity: 0.45,
			zIndex: 1,
			scale: 1.02 + seed * 0.015,
			shadow: '0 1px 3px rgba(0,0,0,0.18)',
		},
		{
			top: '50%',
			left: '50%',
			rotate: `${seed * 1.5}deg`,
			size: 26,
			opacity: 0.35,
			zIndex: 0,
			transform: 'translate(-50%,-50%)',
			scale: 1.08,
			glow: `rgba(255, 255, 255, 0.${3 + (seed % 3)})`,
		},
	]

	if (isImageSticker) {
		return (
			<>
				{stickerPositions.map((pos, i) => (
					<div
						key={i}
						className="absolute pointer-events-none"
						style={{
							top: pos.top,
							left: pos.left,
							right: pos.right,
							bottom: pos.bottom,
							width: pos.size,
							height: pos.size,
							transform: `${pos.transform ?? ''} rotate(${pos.rotate}) scale(${pos.scale || 1})`,
							zIndex: pos.zIndex,
							filter: `${pos.shadow ? `drop-shadow(${pos.shadow})` : ''} ${pos.glow ? `drop-shadow(0 0 2px ${pos.glow})` : ''}`,
							transition: 'transform 0.3s ease-in-out',
						}}
					>
						<img
							src={bookmark.sticker}
							alt=""
							className="object-contain w-full h-full rounded-sm"
							style={{
								opacity: pos.opacity,
								filter: pos.glow
									? `drop-shadow(0 0 1px ${pos.glow})`
									: undefined,
							}}
							onError={(e) => {
								e.currentTarget.style.display = 'none'
							}}
						/>
					</div>
				))}
			</>
		)
	}

	return (
		<>
			{stickerPositions.map((pos, i) => (
				<div
					key={i}
					className="absolute flex items-center justify-center pointer-events-none"
					style={{
						top: pos.top,
						left: pos.left,
						right: pos.right,
						bottom: pos.bottom,
						width: pos.size,
						height: pos.size,
						fontSize: pos.size - 4,
						transform: `${pos.transform ?? ''} rotate(${pos.rotate}) scale(${pos.scale || 1})`,
						zIndex: pos.zIndex,
						fontFamily: "'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
						filter: `${pos.glow ? `drop-shadow(0 0 2px ${pos.glow})` : ''}`,
						transition: 'transform 0.3s ease-in-out',
					}}
				>
					<span
						style={{
							opacity: pos.opacity,
							filter: pos.shadow ? `drop-shadow(${pos.shadow})` : undefined,
						}}
					>
						{bookmark.sticker}
					</span>
				</div>
			))}
		</>
	)
}

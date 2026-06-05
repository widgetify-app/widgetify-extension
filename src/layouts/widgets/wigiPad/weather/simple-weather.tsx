interface Prop {
	weather: any
	hasBanner: boolean
}
export function SimpleWeather({ weather, hasBanner }: Prop) {
	const temp = Math.round(weather?.weather?.temperature?.temp || 0)
	const description = weather?.weather?.description?.text
	const iconUrl = weather?.weather?.icon?.url

	return (
		<div className="flex items-center justify-between w-full gap-1">
			<div className="flex items-center gap-0.5">
				{iconUrl && (
					<img
						src={iconUrl}
						alt={description || 'weather'}
						className="absolute object-contain w-5 h-5 -left-2.5 -top-0.5 drop-shadow-sm filter saturate-200"
					/>
				)}
				<div className="flex items-baseline gap-1 mt-1">
					<span className="text-xs font-extrabold leading-none tracking-tight">
						{weather ? `${temp}°` : '–°'}
					</span>
					<span
						className={`text-[11px] font-medium max-w-[70px] truncate ${hasBanner ? 'text-white/90' : 'text-base-content/70'}`}
					>
						{description || 'آب‌وهوا'}
					</span>
				</div>
			</div>
		</div>
	)
}

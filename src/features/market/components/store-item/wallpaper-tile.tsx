import { ConfigKey } from '@/common/constants/config-keys'
import { cn } from '@/common/utils/cn'
import { Tile } from '@/components/ui'
import { Icon } from '@/icons'
import type { ItemState, StoreItem } from '../../types'
import { faNumber, isAnimatedWallpaper, wallpaperCaption } from '../../utils/store-item'
import { WallpaperMedia } from '../previews/wallpaper-media'

interface WallpaperTileProps {
	item: StoreItem
	state: ItemState
	selected: boolean
	onPick: () => void
	onTry?: () => void
}

export function WallpaperTile({
	item,
	state,
	selected,
	onPick,
	onTry,
}: WallpaperTileProps) {
	const locked = state === 'locked'
	const canTry = locked && Boolean(onTry)
	const animated = item.wallpaper ? isAnimatedWallpaper(item.wallpaper) : false
	const caption = item.wallpaper ? wallpaperCaption(item.wallpaper) : item.name

	return (
		<Tile
			bare
			selected={selected}
			onClick={onPick}
			label={locked ? `${item.name}، ${faNumber(item.price)} ویج‌کوین` : item.name}
			media={item.wallpaper && <WallpaperMedia wallpaper={item.wallpaper} />}
			overlay={
				<>
					{animated && (
						<span
							className={cn(
								'absolute z-10 grid rounded-lg top-2 end-2 size-6 place-items-center bg-scrim text-image-fg backdrop-glass transition-ui',
								canTry && 'group-hover:opacity-0'
							)}
						>
							<Icon name="play" size={12} aria-label="متحرک" />
						</span>
					)}
					{(caption || locked) && (
						<span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2 pt-6 bg-linear-to-t from-scrim to-transparent">
							<span className="font-medium truncate text-2xs text-image-fg">
								{caption}
							</span>
							{locked && (
								<span className="inline-flex items-center h-6 gap-1 px-1.5 font-bold rounded-lg shrink-0 bg-scrim text-image-fg text-2xs tabular-nums backdrop-glass">
									{faNumber(item.price)}
									<img
										src={ConfigKey.WIG_COIN_ICON}
										alt=""
										className="size-4"
									/>
								</span>
							)}
						</span>
					)}
					{state === 'active' && (
						<span className="absolute z-10 grid rounded-full shadow-sm top-2 start-2 size-6 place-items-center bg-brand text-on-brand">
							<Icon name="check" size={14} aria-label="تصویر زمینه‌ی فعلی" />
						</span>
					)}
				</>
			}
			actions={
				canTry && (
					<button
						type="button"
						onClick={onTry}
						aria-label={`امتحان ${item.name} روی صفحه`}
						className="inline-flex items-center gap-1 px-2 font-semibold rounded-lg cursor-pointer h-7 bg-scrim text-image-fg text-2xs backdrop-glass hover:bg-scrim-strong transition-ui focus-visible:focus-ring"
					>
						<Icon name="outlineEye" size={12} />
						امتحان
					</button>
				)
			}
		/>
	)
}

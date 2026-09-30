import { getItemTypeEmoji } from '../utils/get-item-type-emoji'
import { renderBrowserTitlePreview } from '@/components/browser-title-preview'
import type { MarketItem } from '@/services/market/market.interface'
import {
	PET_PREVIEW,
	PET_BACKGROUNDS,
	type PetTypes,
	type PetBackgroundId,
} from '@/features/widgets/pet/pet.widget'

interface RenderPreviewProps {
	item: MarketItem
	handlePreviewClick: () => void
}

export function RenderPreview({ item }: RenderPreviewProps) {
	const base = 'relative flex items-center justify-center w-full h-24 overflow-hidden'
	const imageSrc = item.imageUrl || item.previewUrl

	if (imageSrc) {
		return (
			<div className={base}>
				<img
					src={imageSrc}
					alt={item.name}
					className="object-cover w-full h-full"
					loading="lazy"
				/>
			</div>
		)
	}

	if (item.type === 'PET') {
		const petImage = PET_PREVIEW[item.itemValue as PetTypes]
		return (
			<div className={`${base} bg-fill`}>
				{petImage ? (
					<img
						src={petImage}
						alt={item.name}
						className="object-contain w-14 h-14 drop-shadow-sm"
					/>
				) : (
					<span className="text-3xl">{getItemTypeEmoji(item.type)}</span>
				)}
			</div>
		)
	}

	if (item.type === 'PET_BACKGROUND') {
		const bg = PET_BACKGROUNDS[item.itemValue as PetBackgroundId]
		return (
			<div
				className={`${base} bg-fill-2`}
				style={
					bg?.image
						? {
								backgroundImage: `url(${bg.image})`,
								backgroundSize: 'cover',
								backgroundPosition: 'bottom center',
							}
						: undefined
				}
			>
				{!bg?.image && (
					<span className="text-xs text-fg-muted">
						{bg?.label || item.name}
					</span>
				)}
			</div>
		)
	}

	if (item.type === 'BROWSER_TITLE') {
		return (
			<div className={`${base} bg-fill px-2`}>
				{renderBrowserTitlePreview({
					template: item.meta?.template || item.name,
					className: 'w-96! max-w-96!',
				})}
			</div>
		)
	}

	if (item.type === 'FONT') {
		return (
			<div className={`${base} bg-fill`}>
				<div className="text-center px-2">
					<p
						className="text-base font-medium text-fg"
						style={{ fontFamily: item.itemValue }}
					>
						نمونه متن
					</p>
					<p
						className="text-3xs text-fg-muted mt-0.5"
						style={{ fontFamily: item.itemValue }}
					>
						{item.itemValue}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`${base} bg-fill`}>
			<span className="text-3xl opacity-20">{getItemTypeEmoji(item.type)}</span>
		</div>
	)
}

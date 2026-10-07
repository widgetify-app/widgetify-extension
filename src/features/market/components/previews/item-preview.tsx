import { PET_BACKGROUNDS, PET_PREVIEW, PetTypes } from '@/features/widgets/pet/pet.widget'
import type { StoreItem, StoreItemType } from '../../types'
import { FontSpecimen } from './font-specimen'
import { PetScenePreview } from './pet-scene-preview'
import { TabTitlePreview } from './tab-title-preview'
import { ThemePreview } from './theme-preview'
import { WallpaperMedia } from './wallpaper-media'

const SCENE_FOR_PETS = PET_BACKGROUNDS.autumn.image
const PET_FOR_SCENES = PET_PREVIEW[PetTypes.DOG]

interface ItemPreviewProps {
	item: StoreItem
	size?: 'sm' | 'lg'
}

export function ItemPreview({ item, size = 'sm' }: ItemPreviewProps) {
	switch (item.type) {
		case 'THEME':
			return <ThemePreview theme={item.value} />
		case 'FONT':
			return <FontSpecimen family={item.value} size={size} />
		case 'BROWSER_TITLE':
			return <TabTitlePreview title={item.value} />
		case 'PET':
			return (
				<PetScenePreview
					scene={SCENE_FOR_PETS}
					sprite={PET_PREVIEW[item.value as PetTypes] ?? item.image}
					size={size}
				/>
			)
		case 'PET_BACKGROUND':
			return (
				<PetScenePreview
					scene={item.image ?? PET_BACKGROUNDS[item.value]?.image}
					sprite={PET_FOR_SCENES}
					size={size}
				/>
			)
		case 'WALLPAPER':
			return item.wallpaper ? <WallpaperMedia wallpaper={item.wallpaper} /> : null
	}
}

export function previewAspect(type: StoreItemType): 'video' | 'wide' | 'short' {
	if (type === 'FONT') return 'wide'
	if (type === 'BROWSER_TITLE') return 'short'
	return 'video'
}

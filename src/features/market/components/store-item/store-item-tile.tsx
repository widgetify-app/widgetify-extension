import { Tile } from '@/components/ui'
import type { ItemState, StoreItem } from '../../types'
import { ItemPreview, previewAspect } from '../previews/item-preview'
import { ItemStateTag } from './item-state-tag'

interface StoreItemTileProps {
	item: StoreItem
	state: ItemState
	onOpen: () => void
	selected?: boolean
}

export function StoreItemTile({ item, state, onOpen, selected }: StoreItemTileProps) {
	return (
		<Tile
			media={<ItemPreview item={item} />}
			aspect={previewAspect(item.type)}
			title={item.name}
			meta={<ItemStateTag state={state} price={item.price} />}
			selected={selected}
			onClick={onOpen}
		/>
	)
}

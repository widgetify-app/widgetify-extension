import type { ItemState, StoreItem } from '../types'
import { getItemState } from '../utils/store-item'
import { useActiveValues } from './use-active-values'

export function useItemState(): (item: StoreItem) => ItemState {
	const active = useActiveValues()
	return (item) => getItemState(item, active[item.type])
}

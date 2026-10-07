import { callEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { useStoreTryOn } from '../../store-try-on.context'
import type { StoreItem } from '../../types'
import { ItemDetail } from './item-detail'

interface ItemDetailModalProps {
	item: StoreItem | null
	isOpen: boolean
	onClose: () => void
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
	const { isTryingOn } = useStoreTryOn()

	const seeAllPackages = () => {
		onClose()
		callEvent('openMarketModal', { tab: 'coins' })
	}

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="sm" stepAside={isTryingOn}>
			{item && (
				<ItemDetail
					item={item}
					onApplied={onClose}
					onSeeAllPackages={seeAllPackages}
				/>
			)}
		</Modal>
	)
}

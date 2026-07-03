import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { MarketContainer } from '@/layouts/market/market-container'
import { Icon } from '@/src/icons'

export function MarketButton() {
	const [showMarket, setShowMarket] = useState(false)

	const handleClick = () => {
		setShowMarket(true)
		Analytics.event('market_opened')
	}

	useEffect(() => {
		const event = listenEvent('openMarketModal', () => handleClick())
		return () => {
			event()
		}
	}, [])

	return (
		<>
			<button
				onClick={() => handleClick()}
				className="p-2 transition-all cursor-pointer nav-btn text-base-content/40 hover:text-base-content active:scale-90"
			>
				<Icon name="outlineShoppingBag" size={15} />
			</button>
			<Modal
				isOpen={showMarket}
				onClose={() => setShowMarket(false)}
				title="فروشگاه"
				size="xl"
				direction="rtl"
				closeOnBackdropClick={true}
			>
				<MarketContainer />
			</Modal>
		</>
	)
}

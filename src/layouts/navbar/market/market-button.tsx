import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { MarketContainer } from '@/layouts/market/market-container'
import { HiShoppingBag } from 'react-icons/hi2'

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
				className="p-2 transition-all cursor-pointer text-white/40 hover:text-white active:scale-90"
			>
				<HiShoppingBag size={19} />
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

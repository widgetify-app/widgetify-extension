import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import { Modal } from '@/components/ui'
import { MarketContainer } from '@/layouts/market/market-container'

export function MarketModalListener() {
	const [showMarket, setShowMarket] = useState(false)

	const handleOpen = () => {
		setShowMarket(true)
		Analytics.event('market_opened')
	}

	useEffect(() => {
		const event = listenEvent('openMarketModal', () => handleOpen())
		return () => {
			event()
		}
	}, [])

	return (
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
	)
}

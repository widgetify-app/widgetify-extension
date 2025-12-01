import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import { MarketContainer } from '@/layouts/market/market-container'

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
			<Tooltip content="فروشگاه">
				<button
					onClick={handleClick}
					className="flex flex-row-reverse items-center justify-center w-8 h-full px-1 overflow-hidden transition-all duration-200 cursor-pointer bg-content bg-glass rounded-xl hover:bg-primary/10 hover:scale-105 group"
					style={{
						backgroundImage:
							'url(https://cdn.widgetify.ir/extension/market-button.gif)',
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
				></button>
			</Tooltip>

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

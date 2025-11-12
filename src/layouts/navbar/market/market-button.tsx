import { useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import Analytics from '@/analytics'
import Modal from '@/components/modal'
import Tooltip from '@/components/toolTip'
import { MarketContainer } from './market-container'

export function MarketButton() {
	const [showMarket, setShowMarket] = useState(false)

	const handleClick = () => {
		setShowMarket(true)
		Analytics.event('market_opened')
	}

	return (
		<>
			<Tooltip content="فروشگاه">
				<button
					onClick={handleClick}
					className="flex flex-row-reverse items-center justify-center w-8 h-full px-1 overflow-hidden transition-all duration-200 cursor-pointer bg-content bg-glass rounded-xl hover:bg-primary/10 hover:scale-105 group"
				>
					<FiShoppingBag
						size={18}
						className="transition-colors duration-200 text-muted group-hover:text-primary"
					/>
				</button>
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

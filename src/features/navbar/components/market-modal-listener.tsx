import { lazy, Suspense, useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { listenEvent } from '@/common/utils/call-event'
import { Modal, Spinner } from '@/components/ui'

const MarketContainer = lazy(() =>
	import('@/features/market/market').then((module) => ({
		default: module.MarketContainer,
	}))
)

export function MarketModalListener() {
	const [showMarket, setShowMarket] = useState(false)
	const [marketConfig, setMarketConfig] = useState<{
		tab?: string
		filter?: string
	}>({})

	const handleOpen = (config?: { tab?: string; filter?: string } | null) => {
		setMarketConfig(config || {})
		setShowMarket(true)
		Analytics.event('market_opened')
	}

	useEffect(() => {
		const event = listenEvent('openMarketModal', (detail) => handleOpen(detail))
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
			closeOnBackdropClick={true}
		>
			<Suspense
				fallback={
					<div className="flex justify-center py-16">
						<Spinner size="lg" />
					</div>
				}
			>
				<MarketContainer
					initialTab={marketConfig.tab}
					initialFilter={marketConfig.filter}
				/>
			</Suspense>
		</Modal>
	)
}

import { MarketContainer } from '@/layouts/market/market-container'

export function MarketPage() {
	return (
		<div
			dir="rtl"
			className="flex flex-col w-full h-full px-3 pt-3 pb-24 md:px-6 md:pt-4"
		>
			<div className="flex-1 overflow-hidden">
				<MarketContainer />
			</div>
		</div>
	)
}

import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { StoreItemPicker } from '@/features/market/market'
import { MarketItemType } from '@/services/market/market.interface'

export function AppearanceSettingTab() {
	return (
		<div className="w-full max-w-2xl mx-auto space-y-4">
			<StoreItemPicker
				type="THEME"
				title="تم"
				description="رنگ‌بندی ویجت‌ها و پنجره‌ها. هر کارت صفحه‌ی خودته با همون تم."
				onOpenStore={() => {
					Analytics.event('theme_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.THEME })
				}}
			/>
			<StoreItemPicker
				type="FONT"
				title="فونت"
				description="فونت همه‌ی نوشته‌های ویجتیفای."
				onOpenStore={() => {
					Analytics.event('font_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.FONT })
				}}
			/>
			<StoreItemPicker
				type="BROWSER_TITLE"
				title="عنوان تب"
				description="اسمی که روی تب مرورگرت می‌بینی، تا بین تب‌ها زود پیداش کنی."
				onOpenStore={() => {
					Analytics.event('browser_title_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.BROWSER_TITLE })
				}}
			/>
		</div>
	)
}

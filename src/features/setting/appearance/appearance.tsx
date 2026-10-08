import { t } from '@/common/i18n'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { StoreItemPicker } from '@/features/market/market'
import { MarketItemType } from '@/services/market/market.interface'

export function AppearanceSettingTab() {
	return (
		<div className="flex flex-col gap-4">
			<StoreItemPicker
				type="THEME"
				title={t('setting.appearance.themeLabel')}
				description={t('setting.appearance.themeHint')}
				onOpenStore={() => {
					Analytics.event('theme_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.THEME })
				}}
			/>
			<StoreItemPicker
				type="FONT"
				title={t('setting.appearance.fontLabel')}
				description={t('setting.appearance.fontHint')}
				onOpenStore={() => {
					Analytics.event('font_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.FONT })
				}}
			/>
			<StoreItemPicker
				type="BROWSER_TITLE"
				title={t('setting.appearance.tabTitleLabel')}
				description={t('setting.appearance.tabTitleHint')}
				onOpenStore={() => {
					Analytics.event('browser_title_market_opened')
					callEvent('openMarketModal', { filter: MarketItemType.BROWSER_TITLE })
				}}
			/>
		</div>
	)
}

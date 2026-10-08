import { t } from '@/common/i18n'
import { Button } from '@/components/ui'
import { Icon } from '@/icons'
import { ITEM_TYPE_META } from '../../constants'
import { ItemPreview } from '../../components/previews/item-preview'
import { CoinAmount } from '../../components/store-item/coin-amount'
import type { StoreItem } from '../../types'

interface FeaturedBannerProps {
	item: StoreItem
	onOpen: () => void
}

export function FeaturedBanner({ item, onOpen }: FeaturedBannerProps) {
	return (
		<section
			aria-label={t('market.featured.latestAria')}
			className="grid overflow-hidden border rounded-2xl border-surface-3 bg-surface-2 sm:grid-cols-[1.3fr_1fr]"
		>
			<div className="relative overflow-hidden aspect-video sm:aspect-auto sm:min-h-44 bg-fill">
				<ItemPreview item={item} size="lg" />
			</div>
			<div className="flex flex-col justify-center gap-2 p-4">
				<span className="inline-flex items-center self-start h-6 gap-1 px-2 font-bold rounded-lg bg-brand-fill text-brand text-2xs">
					<Icon name="wandSparkles" size={12} />
					{t('market.featured.justArrivedPrefix')}{' '}
					{ITEM_TYPE_META[item.type].label}
				</span>
				<h3 className="text-xl font-bold text-fg-strong">{item.name}</h3>
				{item.description && (
					<p className="text-xs leading-relaxed text-fg-muted">
						{item.description}
					</p>
				)}
				<div className="flex items-center justify-between gap-2 pt-1">
					{item.price > 0 ? (
						<CoinAmount amount={item.price} size="md" />
					) : (
						<span className="text-sm font-bold text-fg-strong">
							{t('market.itemState.free')}
						</span>
					)}
					<Button color="brand" size="sm" onClick={onOpen}>
						{t('market.featured.seeIt')}
					</Button>
				</div>
			</div>
		</section>
	)
}

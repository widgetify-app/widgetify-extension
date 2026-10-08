import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { tileMediaVariants } from '@/components/ui'
import { Icon } from '@/icons'
import { ITEM_TYPE_META } from '../../constants'
import type { StoreItem } from '../../types'
import { ItemPreview, previewAspect } from '../previews/item-preview'
import { PurchaseBox } from './purchase-box'

interface ItemDetailProps {
	item: StoreItem
	onSeeAllPackages: () => void
	onClose?: () => void
	onApplied?: () => void
}

export function ItemDetail({
	item,
	onSeeAllPackages,
	onClose,
	onApplied,
}: ItemDetailProps) {
	const meta = ITEM_TYPE_META[item.type]
	const aspect = previewAspect(item.type)

	return (
		<article aria-label={item.name} className="flex flex-col gap-3">
			<div className="flex items-center gap-2">
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label={t('market.itemDetail.closeAria')}
						className="grid rounded-lg cursor-pointer size-7 place-items-center text-fg-muted hover:bg-fill-2 hover:text-fg transition-ui focus-visible:focus-ring"
					>
						<Icon name="chevronRight" size={16} />
					</button>
				)}
				<p className="flex items-center gap-1.5 text-2xs font-medium text-fg-muted">
					<Icon name={meta.icon} size={12} />
					{meta.label}
				</p>
			</div>

			<div
				className={cn(
					tileMediaVariants({ aspect: aspect === 'short' ? 'wide' : aspect }),
					'border rounded-2xl border-surface-3'
				)}
			>
				<ItemPreview item={item} size="lg" />
			</div>

			<header className="space-y-1.5">
				<h3 className="text-lg font-bold text-fg-strong">{item.name}</h3>
				{item.description && (
					<p className="text-xs leading-relaxed text-fg-muted">
						{item.description}
					</p>
				)}
				<p className="flex items-center gap-1.5 text-2xs text-fg-faint">
					<Icon name="wandSparkles" size={12} />
					{t('market.itemDetail.affectsLabel')} {meta.changes}
				</p>
			</header>

			<PurchaseBox
				key={item.id}
				item={item}
				onApplied={onApplied}
				onSeeAllPackages={onSeeAllPackages}
			/>
		</article>
	)
}

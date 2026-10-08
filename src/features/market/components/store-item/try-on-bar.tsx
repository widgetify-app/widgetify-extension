import { t } from '@/common/i18n'
import { useEffect, useRef, useState } from 'react'
import { ConfigKey } from '@/common/constants/config-keys'
import { showToast } from '@/common/toast'
import { Button, Portal } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useApplyItem } from '../../hooks/use-apply-item'
import { useBuyItem } from '../../hooks/use-buy-item'
import type { StoreItem } from '../../types'
import { faNumber, needsPurchase } from '../../utils/store-item'
import { ItemPreview } from '../previews/item-preview'

interface TryOnBarProps {
	item: StoreItem
	onKept: () => void
	onBack: () => void
}

export function TryOnBar({ item, onKept, onBack }: TryOnBarProps) {
	const { isAuthenticated, user } = useAuth()
	const { buy, isBuying } = useBuyItem()
	const apply = useApplyItem()
	const [isApplying, setIsApplying] = useState(false)
	const keepRef = useRef<HTMLButtonElement>(null)
	const mustBuy = needsPurchase(item)
	const canBuyHere = isAuthenticated && (user?.coins ?? 0) >= item.price

	useEffect(() => {
		keepRef.current?.focus()
	}, [])

	useEffect(() => {
		const backOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onBack()
		}
		window.addEventListener('keydown', backOnEscape)
		return () => window.removeEventListener('keydown', backOnEscape)
	}, [onBack])

	const keepEscapeFromHost = (event: React.KeyboardEvent) => {
		if (event.key !== 'Escape') return
		event.stopPropagation()
		onBack()
	}

	const keep = async () => {
		if (mustBuy && !canBuyHere) return onBack()
		if (mustBuy) {
			const bought = await buy(item)
			if (!bought) return
			if (item.type === 'WALLPAPER') return onKept()
		}
		setIsApplying(true)
		const applied = await apply(item)
		setIsApplying(false)
		if (!applied) return
		showToast(
			mustBuy
				? t('market.tryOn.ownedActivatedToast', { p0: item.name })
				: t('market.tryOn.activatedToast', { p0: item.name }),
			'success'
		)
		onKept()
	}

	return (
		<Portal>
			<section
				aria-label={t('market.tryOn.previewAria')}
				onKeyDown={keepEscapeFromHost}
				className="fixed z-nav flex items-center gap-3 p-2 -translate-x-1/2 border shadow-xl bottom-20 left-1/2 rounded-widget bg-glass-surface-2 border-surface-3 max-w-[calc(100vw-2rem)]"
			>
				<span className="relative w-20 overflow-hidden border rounded-xl aspect-video shrink-0 border-line bg-fill">
					<ItemPreview item={item} />
				</span>
				<span className="min-w-0 pe-2">
					<span className="block text-2xs text-fg-muted">
						{t('market.tryOn.tryingHint')}
					</span>
					<span className="block text-sm font-bold truncate text-fg-strong">
						{item.name}
					</span>
				</span>
				<Button
					ref={keepRef}
					color="brand"
					size="sm"
					className="shrink-0"
					onClick={keep}
					loading={isBuying || isApplying}
					loadingText={t('market.tryOn.loading')}
				>
					{mustBuy && item.price > 0 ? (
						<>
							{t('market.tryOn.keep')}
							<span className="inline-flex items-center gap-0.5 ps-1.5 ms-0.5 border-s border-on-brand tabular-nums">
								{faNumber(item.price)}
								<img
									src={ConfigKey.WIG_COIN_ICON}
									alt={t('market.coin.amountLabel')}
									className="size-4"
								/>
							</span>
						</>
					) : (
						t('market.tryOn.keep')
					)}
				</Button>
				<Button
					size="sm"
					variant="ghost"
					className="shrink-0"
					onClick={onBack}
					icon={<Icon name="undo" size={14} />}
				>
					{t('market.tryOn.revert')}
				</Button>
			</section>
		</Portal>
	)
}

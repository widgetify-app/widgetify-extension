import { t } from '@/common/i18n'
import { useState } from 'react'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Alert, Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { PetTypes } from '@/features/widgets/pet/pet.widget'
import { Icon } from '@/icons'
import { ITEM_TYPE_META } from '../../constants'
import { useApplyItem } from '../../hooks/use-apply-item'
import { useBuyItem } from '../../hooks/use-buy-item'
import { useItemState } from '../../hooks/use-item-state'
import { useStoreTryOn } from '../../store-try-on.context'
import type { StoreItem, StoreItemType } from '../../types'
import { faNumber, needsPurchase } from '../../utils/store-item'
import { CoinAmount } from './coin-amount'
import { PurchaseSuccess } from './purchase-success'
import { TopUpSuggestion } from './top-up-suggestion'

const USABLE_FROM_STORE: StoreItemType[] = ['THEME', 'FONT', 'BROWSER_TITLE', 'WALLPAPER']
const KNOWN_PETS = new Set<string>(Object.values(PetTypes))

interface PurchaseBoxProps {
	item: StoreItem
	onSeeAllPackages: () => void
	onApplied?: () => void
}

export function PurchaseBox({ item, onSeeAllPackages, onApplied }: PurchaseBoxProps) {
	const { isAuthenticated, user } = useAuth()
	const stateOf = useItemState()
	const apply = useApplyItem()
	const { buy, isBuying } = useBuyItem()
	const { tryOn } = useStoreTryOn()
	const [boughtHere, setBoughtHere] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const [isApplying, setIsApplying] = useState(false)

	const current = boughtHere ? { ...item, isOwned: true } : item
	const state = stateOf(current)
	const canUseHere = USABLE_FROM_STORE.includes(item.type)
	const coins = user?.coins ?? 0

	const use = async () => {
		setIsApplying(true)
		const applied = await apply(current)
		setIsApplying(false)
		if (!applied) return
		setShowSuccess(false)
		onApplied?.()
	}

	const purchase = async () => {
		const bought = await buy(item)
		if (!bought || item.type === 'WALLPAPER') return
		setBoughtHere(true)
		setShowSuccess(true)
		celebrate()
	}

	const signIn = () => {
		Analytics.event('market_item_purchase_unauthenticated')
		callEvent('openProfile')
	}

	const tryButton = item.canTryOn && (
		<Button onClick={() => tryOn(item)} icon={<Icon name="outlineEye" size={16} />}>
			{t('market.purchase.tryOn')}
		</Button>
	)

	if (item.type === 'PET' && !KNOWN_PETS.has(item.value)) {
		return <Alert tone="warning">{t('market.purchase.versionMismatchHint')}</Alert>
	}

	if (showSuccess) {
		return (
			<PurchaseSuccess
				item={current}
				canUseHere={canUseHere}
				isApplying={isApplying}
				onUse={use}
				onDone={() => setShowSuccess(false)}
			/>
		)
	}

	if (state === 'active') {
		return (
			<p className="flex items-center gap-2 p-3 text-xs font-medium rounded-xl bg-brand-fill text-brand">
				<Icon name="check" size={16} />
				{t('market.purchase.inUseHint')}
			</p>
		)
	}

	if (!needsPurchase(current)) {
		if (!canUseHere) {
			return (
				<p className="p-3 text-xs rounded-xl bg-success-fill text-fg">
					{t('market.purchase.ownedPrefix')}
					{ITEM_TYPE_META[item.type].whereToChange}
					{t('market.purchase.ownedSuffix')}
				</p>
			)
		}
		return (
			<div className="space-y-2">
				<Button
					color="brand"
					fullWidth
					onClick={use}
					loading={isApplying}
					loadingText={t('market.purchase.switching')}
					icon={<Icon name="check" size={16} />}
				>
					{t('market.purchase.use')}
				</Button>
				<p className="text-center text-2xs text-fg-faint">
					{state === 'free'
						? t('market.purchase.freeSelectHint')
						: t('market.purchase.ownedSwitchHint')}
				</p>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className="space-y-2">
				<PriceRow price={item.price} />
				<div className="flex gap-2">
					{tryButton}
					<Button
						color="brand"
						className="flex-1"
						onClick={signIn}
						icon={<Icon name="user" size={16} />}
					>
						{item.price === 0
							? t('market.purchase.loginClaim')
							: t('market.purchase.loginBuy')}
					</Button>
				</div>
			</div>
		)
	}

	if (item.price === 0) {
		return (
			<div className="flex gap-2">
				{tryButton}
				<Button
					color="brand"
					className="flex-1"
					onClick={purchase}
					loading={isBuying}
					loadingText={t('market.purchase.claiming')}
				>
					{t('market.purchase.claimFree')}
				</Button>
			</div>
		)
	}

	const shortfall = item.price - coins
	if (shortfall > 0) {
		return (
			<div className="space-y-3">
				<Alert
					tone="warning"
					title={t('market.purchase.shortfallHint', {
						p0: faNumber(shortfall),
					})}
				>
					{t('market.purchase.balanceLabel')} {faNumber(coins)}{' '}
					{t('market.purchase.shortfallMiddle')} {faNumber(item.price)}{' '}
					{t('market.purchase.shortfallSuffix')}
				</Alert>
				<TopUpSuggestion shortfall={shortfall} onSeeAll={onSeeAllPackages} />
				{tryButton && <div className="flex">{tryButton}</div>}
			</div>
		)
	}

	return (
		<div className="space-y-3">
			<dl className="p-3 space-y-2 text-xs rounded-xl bg-fill">
				<div className="flex items-center justify-between">
					<dt className="text-fg-muted">{t('market.purchase.priceLabel')}</dt>
					<dd>
						<CoinAmount amount={item.price} size="md" />
					</dd>
				</div>
				<div className="flex items-center justify-between">
					<dt className="text-fg-muted">
						{t('market.purchase.balanceAfterLabel')}
					</dt>
					<dd className="font-semibold tabular-nums text-fg-muted">
						{faNumber(coins - item.price)}
					</dd>
				</div>
			</dl>
			<div className="flex gap-2">
				{tryButton}
				<Button
					color="brand"
					className="flex-1"
					onClick={purchase}
					loading={isBuying}
					loadingText={t('market.purchase.buying')}
				>
					{t('market.purchase.buyWithPrefix')} {faNumber(item.price)}{' '}
					{t('market.coin.amountLabel')}
				</Button>
			</div>
			<p className="text-center text-2xs text-fg-faint">
				{t('market.purchase.foreverHint')}
			</p>
		</div>
	)
}

function PriceRow({ price }: { price: number }) {
	return (
		<div className="flex items-center justify-between p-3 text-xs rounded-xl bg-fill">
			<span className="text-fg-muted">{t('market.purchase.priceLabel')}</span>
			{price === 0 ? (
				<span className="text-sm font-bold text-fg-strong">
					{t('market.itemState.free')}
				</span>
			) : (
				<CoinAmount amount={price} size="md" />
			)}
		</div>
	)
}

function celebrate() {
	import('canvas-confetti').then(({ default: confetti }) =>
		confetti({
			particleCount: 70,
			spread: 70,
			origin: { y: 0.7 },
			zIndex: 100000,
			disableForReducedMotion: true,
		})
	)
}

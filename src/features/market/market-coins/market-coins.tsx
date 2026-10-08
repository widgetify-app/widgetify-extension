import { t } from '@/common/i18n'
import { useState } from 'react'
import Analytics from '@/analytics'
import { ConfigKey } from '@/common/constants/config-keys'
import { callEvent } from '@/common/utils/call-event'
import { Alert, Button, EmptyState } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import { useGetCoinPackages } from '@/services/market/market-coins.hook'
import { CategoryHeader } from '../components/category-header'
import { useCoinCheckout } from '../hooks/use-coin-checkout'
import { bestValuePackageId, faNumber } from '../utils/store-item'
import { CoinPackageOption } from './components/coin-package-option'

export function MarketCoins() {
	const { isAuthenticated, user } = useAuth()
	const { data, isLoading, isError, refetch } = useGetCoinPackages({ limit: 12 })
	const { checkout, payingPackageId } = useCoinCheckout()
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const packages = data?.packages ?? []
	const selected = packages.find((pkg) => pkg.id === selectedId) ?? packages[0]
	const bestValueId = bestValuePackageId(packages)

	const signIn = () => {
		Analytics.event('coin_package_purchase_unauthenticated')
		callEvent('openProfile')
	}

	const openRewards = () => {
		if (!isAuthenticated) return signIn()
		callEvent('openSettings', 'tasks')
	}

	return (
		<div className="flex flex-col min-h-full">
			<CategoryHeader
				title={t('market.coin.amountLabel')}
				description={t('market.coins.introBody')}
			/>

			<div className="grid gap-3 mb-4 sm:grid-cols-2">
				<div className="flex items-center gap-3 p-4 border rounded-2xl border-warning-fill-2 bg-warning-fill">
					<img
						src={ConfigKey.WIG_COIN_ICON}
						alt=""
						className="size-10 shrink-0"
					/>
					<div>
						<p className="text-2xs text-fg-muted">
							{t('market.coins.balanceLabel')}
						</p>
						{isAuthenticated ? (
							<p className="text-2xl font-bold tabular-nums text-fg-strong">
								{faNumber(user?.coins ?? 0)}
							</p>
						) : (
							<p className="text-sm font-semibold text-fg">
								{t('market.coins.loginToSee')}
							</p>
						)}
					</div>
				</div>
				<button
					type="button"
					onClick={openRewards}
					className="flex items-center gap-3 p-4 border cursor-pointer text-start rounded-2xl border-surface-3 bg-surface-2 hover:border-brand-muted transition-ui focus-visible:focus-ring"
				>
					<span className="grid rounded-xl size-10 place-items-center bg-success-fill text-success shrink-0">
						<Icon name="gift" size={20} />
					</span>
					<span className="flex-1">
						<span className="block text-sm font-semibold text-fg-strong">
							{t('market.coins.freeTitle')}
						</span>
						<span className="block text-2xs text-fg-muted">
							{t('market.coins.freeHint')}
						</span>
					</span>
					<Icon name="chevronLeft" size={16} className="text-fg-faint" />
				</button>
			</div>

			{isError ? (
				<EmptyState
					icon="coin"
					title={t('market.coins.loadErrorTitle')}
					description={t('market.category.loadErrorHint')}
					action={
						<Button size="sm" onClick={() => refetch()}>
							{t('market.category.retry')}
						</Button>
					}
				/>
			) : isLoading ? (
				<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]">
					{Array.from({ length: 4 }, (_, index) => (
						<span
							key={index}
							aria-hidden="true"
							className="block h-48 rounded-2xl skeleton"
						/>
					))}
				</div>
			) : packages.length === 0 ? (
				<EmptyState icon="coin" title={t('market.coins.emptyTitle')} />
			) : (
				<fieldset className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]">
					<legend className="mb-2 text-sm font-bold text-fg-strong">
						{t('market.coins.selectPackage')}
					</legend>
					{packages.map((pkg) => (
						<CoinPackageOption
							key={pkg.id}
							pkg={pkg}
							selected={pkg.id === selected?.id}
							isBestValue={pkg.id === bestValueId}
							onSelect={() => setSelectedId(pkg.id)}
						/>
					))}
				</fieldset>
			)}

			{selected && (
				<div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 p-3 mt-4 border shadow-lg rounded-2xl border-surface-3 bg-glass-surface-2">
					{isAuthenticated ? (
						<>
							<div className="min-w-0">
								<p className="text-sm font-bold text-fg-strong">
									{selected.title}
									{t('market.coins.priceSeparator')}{' '}
									{faNumber(selected.coin)}{' '}
									{t('market.coin.amountLabel')}
								</p>
								<p className="text-2xs text-fg-muted">
									{t('market.coins.checkoutHint')}
								</p>
							</div>
							<Button
								color="brand"
								onClick={() => checkout(selected)}
								loading={payingPackageId === selected.id}
								loadingText={t('market.topUp.redirecting')}
							>
								{t('market.coins.pay')} {faNumber(selected.price)}{' '}
								{t('market.topUp.currencyLabel')}
							</Button>
						</>
					) : (
						<Alert
							tone="info"
							className="w-full"
							action={
								<Button size="sm" color="brand" onClick={signIn}>
									{t('market.coins.login')}
								</Button>
							}
						>
							{t('market.coins.loginHint')}
						</Alert>
					)}
				</div>
			)}
		</div>
	)
}

import { t } from '@/common/i18n'
import { useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/icons'
import { useGetVipPlans, usePurchaseVipPlan } from '@/services/market/market-vip.hook'
import type { VipPlan } from '@/services/market/market-vip.interface'
import { FreeVipSuccessModal } from './components/free-vip-success-modal'
import { VipPlanCard } from './components/vip-plan-card'
import { VipHeroBanner } from './components/vip-hero-banner'

const VIP_LABEL = t('setting.vip.proLabel')

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

const VIP_GRID_LAYOUTS: Record<number, string> = {
	1: 'grid-cols-1 max-w-sm mx-auto',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-3',
	4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function VipTab() {
	const { isAuthenticated, refetchUser } = useAuth()
	const [selectedPlan, setSelectedPlan] = useState<VipPlan | null>(null)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [claimedDays, setClaimedDays] = useState<number>(5)

	const { data: plans, isLoading, refetch } = useGetVipPlans()
	const { mutate: purchasePlan, isPending } = usePurchaseVipPlan()

	useEffect(() => {
		Analytics.event('vip_tab_opened')
	}, [])

	useEffect(() => {
		if (plans?.length && !selectedPlan) {
			const popular = plans.find((p) => Boolean(p.meta?.badge)) || plans[0]
			setSelectedPlan(popular)
		}
	}, [plans, selectedPlan])

	const handlePurchase = () => {
		if (!selectedPlan) {
			showToast(t('setting.vip.selectPlanFirst'), 'error')
			return
		}

		if (!isAuthenticated) {
			Analytics.event('vip_plan_purchase_unauthenticated')
			showToast(t('setting.vip.loginRequired', { p0: VIP_LABEL }), 'error')
			callEvent('openSettings', 'profile')
			return
		}

		purchasePlan(
			{ packageId: selectedPlan.id },
			{
				onSuccess: (res) => {
					if (res?.isFree || res?.activated) {
						setClaimedDays(res?.days || selectedPlan.days || 5)
						setShowSuccessModal(true)
					} else {
						showToast(t('setting.vip.redirectingToPayment'), 'success')
					}
					Analytics.event('vip_plan_purchased')
					refetchUser()
					refetch()
				},
				onError: (error) => {
					const errorMsg = translateError(error) as string
					if (
						errorMsg === 'FREE_PLAN_ALREADY_CLAIMED' ||
						(error as any)?.response?.data?.message ===
							'FREE_PLAN_ALREADY_CLAIMED'
					) {
						showToast(t('setting.vip.freeAlreadyClaimed'), 'error')
					} else {
						showToast(
							errorMsg || t('setting.vip.purchaseError', { p0: VIP_LABEL }),
							'error'
						)
					}
					Analytics.event('vip_plan_purchase_failed')
				},
			}
		)
	}

	return (
		<div className="flex flex-col w-full gap-4 text-right select-none">
			{/* Top Hero Banner without media dependencies */}
			<VipHeroBanner />

			<div className="space-y-2.5 pt-1">
				<h4 className="text-xs font-bold text-fg">
					{t('setting.vip.selectPlanTitle')}
				</h4>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{Array.from({ length: 2 }).map((_, i) => (
							<div
								key={i}
								className="border rounded-2xl border-line bg-fill p-4 space-y-2.5 min-h-27.5"
							>
								<div className="w-2/3 h-4 rounded-lg skeleton opacity-40" />
								<div className="w-full h-5 mt-3 rounded-lg skeleton opacity-20" />
								<div className="w-1/2 h-3 rounded-lg skeleton opacity-30" />
							</div>
						))}
					</div>
				) : plans?.length ? (
					<div
						className={cn(
							'grid gap-3',
							VIP_GRID_LAYOUTS[plans.length] ||
								'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
						)}
					>
						{plans.map((plan) => (
							<VipPlanCard
								key={plan.id}
								plan={plan}
								isSelected={selectedPlan?.id === plan.id}
								onSelect={(p) => setSelectedPlan(p)}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-6 text-center border rounded-2xl border-line bg-fill">
						<p className="text-xs text-fg-muted">
							{t('setting.vip.emptyPlans')}
						</p>
					</div>
				)}
			</div>

			<div className="p-3.5 rounded-2xl border border-surface-3 bg-surface-2 flex flex-col sm:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-2.5 w-full sm:w-auto">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl text-brand shrink-0">
						<Icon name="shoppingBag" size={20} />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-bold text-fg">
							{selectedPlan?.title || t('setting.vip.subscriptionLabel')}{' '}
							{VIP_LABEL}
						</span>
						<span className="text-2xs text-fg-muted">
							{t('setting.vip.fullAccessHint')} {VIP_LABEL}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between w-full gap-4 sm:justify-end sm:w-auto">
					<div className="flex flex-col items-start sm:items-end">
						<span className="text-2xs text-fg-muted">
							{t('setting.vip.payableAmount')}
						</span>
						<div className="flex items-baseline gap-1">
							{selectedPlan?.price === 0 ? (
								<span className="text-base font-black sm:text-lg text-success">
									{selectedPlan.isClaimed
										? t('setting.vipPlan.alreadyClaimed')
										: t('setting.vipPlan.free')}
								</span>
							) : (
								<>
									<span className="text-base font-black sm:text-lg text-fg tabular-nums">
										{selectedPlan
											? fmt(selectedPlan.price)
											: t('setting.vip.zeroAmount')}
									</span>
									<span className="text-xs text-fg-muted">
										{t('setting.vipPlan.currencyToman')}
									</span>
								</>
							)}
						</div>
					</div>

					<div className="flex flex-col items-center gap-1">
						<Button
							size="md"
							rounded="2xl"
							disabled={
								!selectedPlan ||
								isPending ||
								Boolean(selectedPlan?.isClaimed)
							}
							loading={isPending}
							loadingText={t('setting.vip.transferring')}
							onClick={handlePurchase}
							className="font-bold transition-ui px-6 h-10 shadow-sm"
							color="vip"
						>
							<Icon name="diamond" size={14} />
							<span>
								{selectedPlan?.isClaimed
									? t('setting.vip.received')
									: t('setting.vip.activatePlan', { p0: VIP_LABEL })}
							</span>
						</Button>
					</div>
				</div>
			</div>

			<FreeVipSuccessModal
				isOpen={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				days={claimedDays}
			/>
		</div>
	)
}

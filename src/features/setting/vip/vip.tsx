import { t } from '@/common/i18n'
import { useEffect, useRef, useState } from 'react'
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
import {
	VIP_FEATURE_IDS,
	type VipFeatureId,
	VipFeaturesModal,
} from './components/vip-features-modal'
import { findMonthlyPlan, monthlyPrice, savingPercent } from './utils/plan-pricing'

const VIP_LABEL = t('setting.vip.proLabel')

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

const VIP_GRID_LAYOUTS: Record<number, string> = {
	1: 'grid-cols-1 max-w-sm',
	2: 'grid-cols-2',
	3: 'grid-cols-2 md:grid-cols-3',
	4: 'grid-cols-2 md:grid-cols-4',
}

function planNote(plan: VipPlan, monthly: VipPlan | undefined) {
	if (plan.price === 0) {
		return {
			text: t('setting.vipPlan.freeOnce', { p0: fmt(plan.days) }),
			highlight: false,
		}
	}
	const saving = savingPercent(plan, monthly)
	if (saving > 0) {
		return { text: t('setting.vipPlan.saving', { p0: fmt(saving) }), highlight: true }
	}
	return {
		text: t('setting.vipPlan.monthlyPrice', { p0: fmt(monthlyPrice(plan)) }),
		highlight: false,
	}
}

export function VipTab() {
	const { isAuthenticated, refetchUser } = useAuth()
	const [selectedPlan, setSelectedPlan] = useState<VipPlan | null>(null)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [claimedDays, setClaimedDays] = useState<number>(5)
	const [featurePage, setFeaturePage] = useState<number | null>(null)
	const plansRef = useRef<HTMLDivElement>(null)

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

	const openFeature = (feature: VipFeatureId) => {
		Analytics.event('vip_feature_details_opened', { feature })
		setFeaturePage(VIP_FEATURE_IDS.indexOf(feature))
	}

	const activateFromFeatures = () => {
		Analytics.event('vip_feature_details_activate_clicked', {
			feature: VIP_FEATURE_IDS[featurePage ?? 0],
		})
		setFeaturePage(null)
		plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	const monthlyPlan = plans ? findMonthlyPlan(plans) : undefined

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
		<div className="flex flex-col w-full gap-8 text-right select-none">
			<VipHeroBanner onOpenFeature={openFeature} />

			<div ref={plansRef} className="px-3 space-y-4">
				<h4 className="text-sm font-bold text-fg-strong">
					{t('setting.vip.selectPlanTitle')}
				</h4>

				{isLoading ? (
					<div className="grid grid-cols-2 gap-4">
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
							'grid gap-4 pt-2',
							VIP_GRID_LAYOUTS[plans.length] || 'grid-cols-2 md:grid-cols-4'
						)}
					>
						{plans.map((plan) => {
							const note = planNote(plan, monthlyPlan)
							return (
								<VipPlanCard
									key={plan.id}
									plan={plan}
									note={note.text}
									highlightNote={note.highlight}
									isSelected={selectedPlan?.id === plan.id}
									onSelect={(p) => setSelectedPlan(p)}
								/>
							)
						})}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-6 text-center border rounded-2xl border-line bg-fill">
						<p className="text-xs text-fg-muted">
							{t('setting.vip.emptyPlans')}
						</p>
					</div>
				)}
			</div>

			<section className="flex flex-wrap items-center justify-between gap-4 p-4 border ps-6 rounded-2xl border-surface-3 bg-surface-2">
				<div className="flex flex-col">
					<span className="text-xs text-fg-muted">
						{t('setting.vip.payableAmount')}
					</span>
					<div className="flex items-baseline gap-1">
						{selectedPlan?.price === 0 ? (
							<span className="text-xl font-black text-fg-strong">
								{selectedPlan.isClaimed
									? t('setting.vipPlan.alreadyClaimed')
									: t('setting.vipPlan.free')}
							</span>
						) : (
							<>
								<span className="text-xl font-black text-fg-strong tabular-nums">
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

				<Button
					size="md"
					rounded="xl"
					color="brand"
					disabled={
						!selectedPlan || isPending || Boolean(selectedPlan?.isClaimed)
					}
					loading={isPending}
					loadingText={t('setting.vip.transferring')}
					onClick={handlePurchase}
					className="px-6 font-bold shadow-sm"
				>
					<Icon name="diamond" size={14} />
					<span>
						{selectedPlan?.isClaimed
							? t('setting.vip.received')
							: t('setting.vip.activatePlan', { p0: VIP_LABEL })}
					</span>
				</Button>
			</section>

			<VipFeaturesModal
				isOpen={featurePage !== null}
				page={featurePage ?? 0}
				onPageChange={setFeaturePage}
				onClose={() => setFeaturePage(null)}
				onActivate={activateFromFeatures}
				activateLabel={t('setting.vip.activatePlan', { p0: VIP_LABEL })}
			/>

			<FreeVipSuccessModal
				isOpen={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				days={claimedDays}
			/>
		</div>
	)
}

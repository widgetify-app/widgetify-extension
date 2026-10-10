import { useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { showToast } from '@/common/toast'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { translateError } from '@/common/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	formatVipExpiryDate,
	formatVipRemaining,
	hasVipTimeLeft,
} from '@/features/setting/utils/vip-expiry'
import { Icon } from '@/icons'
import { useGetVipPlans, usePurchaseVipPlan } from '@/services/market/market-vip.hook'
import type { VipPlan } from '@/services/market/market-vip.interface'
import { CompareTable } from './components/compare-table'
import { ProHero } from './components/hero/pro-hero'
import { MemberActions } from './components/member/member-actions'
import { MemberHero } from './components/member/member-hero'
import { FeatureGrid } from './components/perks/feature-grid'
import { CheckoutBar } from './components/plans/checkout-bar'
import { GiftPackRow } from './components/plans/gift-pack-row'
import { PlanSection } from './components/plans/plan-section'
import { ProSuccessModal } from './components/pro-success-modal'
import { TrustRow } from './components/trust-row'
import { STILL_LOOPS_CLASS } from './constants'
import { formatNumber } from './utils/format'
import {
	dailyPriceCeiling,
	defaultOffer,
	extendedUntil,
	inThousands,
	isGiftPlan,
	type PlanOffer,
	toPlanOffers,
} from './utils/plan-offers'

const VIP_LABEL = t('setting.vip.proLabel')

export function VipPlanStatus() {
	const { isVip } = useAuth()

	if (isVip) {
		return (
			<span className="inline-flex items-center gap-1.5 px-3 text-xs font-extrabold rounded-full h-7 bg-vip-fill text-vip">
				<Icon name="diamond" size={12} />
				{t('setting.vip.currentPro')}
			</span>
		)
	}
	return (
		<span className="inline-flex items-center gap-1.75 px-3 text-xs font-bold rounded-full h-7 bg-fill-2 text-fg-muted">
			<span className="rounded-full size-1.75 bg-fg-faint" />
			{t('setting.vip.currentFree')}
		</span>
	)
}

function daysCredit(offer: PlanOffer): string {
	return t('setting.vip.daysCredit', { days: formatNumber(offer.plan.days) })
}

export function VipTab() {
	const { isAuthenticated, isVip, user, refetchUser } = useAuth()
	const { isOptimalMode } = useGeneralSetting()
	const { data: plans = [], isLoading, isError, refetch } = useGetVipPlans()
	const { mutate: purchasePlan, isPending, variables } = usePurchaseVipPlan()
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [isSuccessOpen, setIsSuccessOpen] = useState(false)
	const [claimedDays, setClaimedDays] = useState(0)
	const extendRef = useRef<HTMLElement>(null)

	useEffect(() => {
		Analytics.event('vip_tab_opened')
	}, [])

	const offers = toPlanOffers(plans)
	const gifts = plans.filter(isGiftPlan)
	const selected =
		offers.find((offer) => offer.plan.id === selectedId) ?? defaultOffer(offers)
	const pendingId = isPending ? variables?.packageId : undefined
	const expiresAt = user?.vipExpiresAt
	const hasTimeLeft = hasVipTimeLeft(expiresAt)
	const remaining = hasTimeLeft ? formatVipRemaining(expiresAt) : ''

	const creditUntil = (offer: PlanOffer) =>
		t('setting.vip.creditUntil', {
			date: formatVipExpiryDate(
				extendedUntil(expiresAt, offer.plan.days, new Date()).toISOString()
			),
		})

	const purchase = (plan: VipPlan) => {
		if (!isAuthenticated) {
			Analytics.event('vip_plan_purchase_unauthenticated')
			showToast(t('setting.vip.loginRequired', { p0: VIP_LABEL }), 'error')
			callEvent('openSettings', 'profile')
			return
		}

		purchasePlan(
			{ packageId: plan.id },
			{
				onSuccess: (res) => {
					if (res?.isFree || res?.activated) {
						setClaimedDays(res?.days || plan.days)
						setIsSuccessOpen(true)
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

	const planSection = {
		offers,
		selectedId: selected?.plan.id ?? null,
		isLoading,
		isError,
		onRetry: () => refetch(),
		onSelect: (offer: PlanOffer) => setSelectedId(offer.plan.id),
	}

	return (
		<div
			className={cn(
				'@container flex flex-col min-h-full gap-12 text-start select-none',
				isOptimalMode && STILL_LOOPS_CLASS
			)}
		>
			{isVip ? (
				<>
					<MemberHero
						remaining={remaining}
						expiryDate={hasTimeLeft ? formatVipExpiryDate(expiresAt) : ''}
						name={user?.name}
						onExtend={() =>
							extendRef.current?.scrollIntoView({
								behavior: isOptimalMode ? 'auto' : 'smooth',
								block: 'start',
							})
						}
					/>
					<MemberActions />
					<PlanSection
						{...planSection}
						ref={extendRef}
						title={t('setting.vip.extend')}
						description={
							remaining
								? t('setting.vip.extendBody', { left: remaining })
								: t('setting.vip.extendBodyPlain')
						}
						footnote={creditUntil}
					/>
				</>
			) : (
				<>
					<ProHero dailyPriceCeiling={dailyPriceCeiling(offers)} />
					<FeatureGrid />
					<PlanSection
						{...planSection}
						title={t('setting.vip.selectPlanTitle')}
						description={t('setting.vip.plansBody')}
						footnote={daysCredit}
					>
						{gifts.length > 0 &&
							gifts.map((gift) => (
								<GiftPackRow
									key={gift.id}
									plan={gift}
									isClaiming={pendingId === gift.id}
									onClaim={() => purchase(gift)}
								/>
							))}
					</PlanSection>
					<div className="flex flex-col gap-7">
						<CompareTable />
						<TrustRow />
					</div>
				</>
			)}

			{selected &&
				(isVip ? (
					<CheckoutBar
						icon="plus"
						title={t('setting.vip.extendPlan', { plan: selected.plan.title })}
						detail={creditUntil(selected)}
						price={selected.plan.price}
						cta={t('setting.vip.payExtend')}
						isPending={pendingId === selected.plan.id}
						onPay={() => purchase(selected.plan)}
					/>
				) : (
					<CheckoutBar
						icon="diamond"
						title={t('setting.vip.checkoutPlan', {
							plan: selected.plan.title,
						})}
						detail={
							selected.savings > 0
								? `${daysCredit(selected)} · ${t('setting.vip.savings', {
										amount: formatNumber(
											inThousands(selected.savings)
										),
									})}`
								: daysCredit(selected)
						}
						price={selected.plan.price}
						cta={t('setting.vip.pay')}
						ctaIcon="diamond"
						isPending={pendingId === selected.plan.id}
						onPay={() => purchase(selected.plan)}
					/>
				))}

			<ProSuccessModal
				isOpen={isSuccessOpen}
				onClose={() => setIsSuccessOpen(false)}
				days={claimedDays}
			/>
		</div>
	)
}

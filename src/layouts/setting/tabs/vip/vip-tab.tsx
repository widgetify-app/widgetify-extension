import { useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/icons'
import type { IconName } from '@/icons/types'
import {
	useGetVipPlans,
	usePurchaseVipPlan,
} from '@/services/hooks/market/market-vip.hook'
import type { VipPlan } from '@/services/hooks/market/market-vip.interface'
import { cn } from '@/common/utils/cn'
import { FreeVipSuccessModal } from './free-vip-success-modal'
import { VipPlanCard } from './vip-plan-card'
import { VipHeroBanner } from './vip-hero-banner'

const VIP_LABEL = 'پرو'

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

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
			const popular =
				plans.find((p) => p.meta?.isPopular || p.meta?.badge === 'popular') ||
				plans[0]
			setSelectedPlan(popular)
		}
	}, [plans, selectedPlan])

	const handlePurchase = () => {
		if (!selectedPlan) {
			showToast('لطفاً یک پلن رو انتخاب کن', 'error')
			return
		}

		if (!isAuthenticated) {
			Analytics.event('vip_plan_purchase_unauthenticated')
			showToast(`برای خرید اشتراک ${VIP_LABEL} باید وارد حساب کاربری بشی`, 'error')
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
						showToast('در حال انتقال به درگاه پرداخت...', 'success')
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
						showToast('شما قبلا این اشتراک رایگان را دریافت کرده‌اید', 'error')
					} else {
						showToast(errorMsg || `خطا در خرید اشتراک ${VIP_LABEL}`, 'error')
					}
					Analytics.event('vip_plan_purchase_failed')
				},
			}
		)
	}

	return (
		<div className="flex flex-col w-full max-w-4xl px-2 py-2 mx-auto space-y-5 text-right select-none sm:px-4">
			{/* Top Hero Banner without media dependencies */}
			<VipHeroBanner />

			<div className="space-y-2.5 pt-1">
				<h4 className="text-xs font-bold text-content">
					پلن مناسب خودت رو انتخاب کن
				</h4>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
						{Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="border rounded-2xl border-base-content/10 bg-base-300/20 p-4 space-y-2.5 min-h-[110px]"
							>
								<div className="w-2/3 h-4 rounded-md skeleton opacity-40" />
								<div className="w-full h-5 mt-3 rounded-md skeleton opacity-20" />
								<div className="w-1/2 h-3 rounded-md skeleton opacity-30" />
							</div>
						))}
					</div>
				) : plans?.length ? (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
					<div className="flex flex-col items-center justify-center py-6 text-center border rounded-2xl border-base-content/10 bg-base-300/20">
						<p className="text-xs text-muted">
							در حال حاضر پلن فعالی موجود نیست
						</p>
					</div>
				)}
			</div>

			<div className="p-3.5 rounded-2xl border border-base-content/10 bg-base-300/20 flex flex-col sm:flex-row items-center justify-between gap-3">
				<div className="flex items-center gap-2.5 w-full sm:w-auto">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl text-primary shrink-0">
						<Icon name="ticket" size={19} />
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-bold text-content">
							{selectedPlan?.title || 'اشتراک'} {VIP_LABEL}
						</span>
						<span className="text-[11px] text-muted">
							دسترسی کامل به تمام امکانات {VIP_LABEL}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between w-full gap-4 sm:justify-end sm:w-auto">
					<div className="flex flex-col items-start sm:items-end">
						<span className="text-[11px] text-muted">مبلغ قابل پرداخت</span>
						<div className="flex items-baseline gap-1">
							{selectedPlan?.price === 0 ? (
								<span className="text-base font-black sm:text-lg text-success">
									{selectedPlan.isClaimed
										? 'قبلا دریافت شده'
										: 'رایگان'}
								</span>
							) : (
								<>
									<span className="text-base font-black sm:text-lg text-content tabular-nums">
										{selectedPlan ? fmt(selectedPlan.price) : '۰'}
									</span>
									<span className="text-xs text-muted">تومان</span>
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
							loadingText="در حال انتقال..."
							onClick={handlePurchase}
							className="font-bold transition-all px-6 h-10 shadow-xs"
							color="vip"
						>
							<Icon name="diamond" size={14} />
							<span>
								{selectedPlan?.isClaimed
									? 'دریافت شده'
									: `فعال‌سازی ${VIP_LABEL}`}
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

export const ProTab = VipTab

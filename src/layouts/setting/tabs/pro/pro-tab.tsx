import { useState, useEffect } from 'react'
import Analytics from '@/analytics'
import { Button } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { callEvent } from '@/common/utils/call-event'
import { Icon } from '@/src/icons'
import type { IconName } from '@/src/icons/types'
import {
	useGetVipPlans,
	usePurchaseVipPlan,
} from '@/services/hooks/market/market-vip.hook'
import type { VipPlan } from '@/services/hooks/market/market-vip.interface'
import { VipPlanCard } from '@/components/vip'

interface ProBenefit {
	title: string
	icon: IconName
}

const PRO_BENEFITS: ProBenefit[] = [
	{
		title: 'شخصی‌سازی پیشرفته ویجت‌ها',
		icon: 'settings',
	},
	{
		title: 'رابط‌های کاربری اختصاصی',
		icon: 'advanced_ui',
	},
	{
		title: 'ویجت‌های نامحدود',
		icon: 'appsPlus',
	},
	{
		title: 'همگام‌سازی بین دستگاه‌ها',
		icon: 'globe',
	},
]

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function ProTab() {
	const { isAuthenticated, refetchUser } = useAuth()
	const [selectedPlan, setSelectedPlan] = useState<VipPlan | null>(null)

	const { data: plans, isLoading, refetch } = useGetVipPlans()
	const { mutate: purchasePlan, isPending } = usePurchaseVipPlan()
	console.log(plans)
	useEffect(() => {
		Analytics.event('pro_tab_opened')
	}, [])

	useEffect(() => {
		if (plans?.length && !selectedPlan) {
			const popular = plans.find((p) => p.meta?.badge === 'popular') || plans[0]
			setSelectedPlan(popular)
		}
	}, [plans, selectedPlan])

	const handlePurchase = () => {
		if (!selectedPlan) {
			showToast('لطفاً یک پلن را انتخاب کنید.', 'error')
			return
		}

		if (!isAuthenticated) {
			Analytics.event('vip_plan_purchase_unauthenticated')
			showToast('برای خرید اشتراک Pro باید وارد حساب کاربری خود شوید.', 'error')
			callEvent('openSettings', 'profile')
			return
		}

		purchasePlan(
			{ packageId: selectedPlan.id },
			{
				onSuccess: () => {
					showToast('در حال انتقال به درگاه پرداخت...', 'success')
					Analytics.event('vip_plan_purchased')
					refetchUser()
					refetch()
				},
				onError: (error) => {
					showToast(
						(translateError(error) as string) || 'خطا در خرید اشتراک Pro',
						'error'
					)
					Analytics.event('vip_plan_purchase_failed')
				},
			}
		)
	}

	return (
		<div className="flex flex-col w-full max-w-lg px-4 py-1 mx-auto space-y-4 text-right">
			<div className="flex flex-col items-center text-center space-y-1.5 py-1">
				<h3 className="text-lg font-black leading-snug sm:text-xl text-content">
					یه ویجتیفای
					<br />
					مخصوص خودت
				</h3>
			</div>

			<div className="space-y-2">
				<h4 className="text-xs font-bold text-content">پلنت رو انتخاب کن</h4>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
						{Array.from({ length: 2 }).map((_, i) => (
							<div
								key={i}
								className="border rounded-2xl border-base-content/10 bg-base-300/20 p-4 space-y-2.5 min-h-31.25"
							>
								<div className="w-2/3 h-4 rounded-md skeleton opacity-40" />
								<div className="w-full h-5 mt-4 rounded-md skeleton opacity-20" />
								<div className="w-1/2 h-3 rounded-md skeleton opacity-30" />
							</div>
						))}
					</div>
				) : plans?.length ? (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
						{plans.map((plan) => (
							<VipPlanCard
								key={plan.id}
								plan={plan}
								isSelected={selectedPlan?.id === plan.id}
								onSelect={() => setSelectedPlan(plan)}
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

			<div className="space-y-2">
				<h4 className="text-xs font-bold text-content">امکانات Pro</h4>

				<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{PRO_BENEFITS.map((benefit, idx) => (
						<div
							key={idx}
							className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-base-content/10 bg-base-300/20 text-right"
						>
							<div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10 text-primary shrink-0">
								<Icon name={benefit.icon} size={14} />
							</div>
							<span className="text-xs font-bold leading-tight text-content">
								{benefit.title}
							</span>
						</div>
					))}
				</div>
			</div>

			<div className="pt-3 space-y-3 border-t border-base-content/10">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-muted">
						مبلغ قابل پرداخت
					</span>
					<div className="flex items-baseline gap-1">
						<span className="text-xl font-black sm:text-2xl text-content tabular-nums">
							{selectedPlan ? fmt(selectedPlan.price) : '۰'}
						</span>
						<span className="text-xs text-muted">تومان</span>
					</div>
				</div>

				<Button
					size="md"
					variant="primary"
					rounded="2xl"
					disabled={!selectedPlan || isPending}
					loading={isPending}
					loadingText="در حال انتقال..."
					onClick={handlePurchase}
					className="w-full font-bold text-white flex items-center justify-center gap-1.5 h-11"
				>
					<span>پرداخت و فعال‌سازی</span>
					<Icon name="chevronLeft" size={14} />
				</Button>
			</div>
		</div>
	)
}

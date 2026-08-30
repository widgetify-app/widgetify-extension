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
import { formatVipExpiryDate, formatVipRemaining } from '@/common/utils/vip-expiry'
import { cn } from '@/common/utils/cn'
import vipPreviewImg from '@/assets/images/pro-preview.jpg'

interface VipFeatureSlide {
	id: string
	tabTitle: string
	icon: IconName
	title: string
	description: string
	bullets: string[]
}

const VIP_LABEL = 'پرو'

const VIP_FEATURES: VipFeatureSlide[] = [
	{
		id: 'unlimited',
		tabTitle: 'ویجت‌های نامحدود',
		icon: 'infinity',
		title: 'ویجت‌های نامحدود',
		description:
			'ویجت‌های موردعلاقه‌ات رو بدون محدودیت اضافه کن و صفحه‌ات رو دقیقا همون‌طور که می‌خوای بچین',
		bullets: ['بدون محدودیت در تعداد ویجت‌ها', 'چیدمان آزاد و دلخواه'],
	},
	{
		id: 'customization',
		tabTitle: 'شخصی‌سازی پیشرفته',
		icon: 'brush',
		title: 'صفحه‌ات رو مطابق سلیقه‌ات بساز',
		description:
			'با سایزها، مدل‌ها و استایل‌های بیشتر، ظاهر ویجت‌ها و صفحه‌ات رو شخصی‌سازی کن',
		bullets: [
			`سایزها و مدل‌های اختصاصی ${VIP_LABEL}`,
			'گزینه‌های بیشتر برای شخصی‌سازی ظاهر ویجت‌ها',
		],
	},
	{
		id: 'wallpaper_sync',
		tabTitle: 'والپیپر شخصی',
		icon: 'save',
		title: 'والپیپرهای شخصی‌ات، همه‌جا',
		description:
			'والپیپرهایی که از سیستم خودت انتخاب می‌کنی رو بدون محدودیت حجم ذخیره کن و روی همه سیستم‌هات داشته باش',
		bullets: [
			'حذف محدودیت حجم والپیپرهای شخصی',
			'دسترسی به والپیپرهای شخصی روی همه سیستم‌ها',
		],
	},
	{
		id: 'market_access',
		tabTitle: 'مارکت ویجتیفای',
		icon: 'shoppingBag',
		title: 'دنیایی از آیتم‌های جذاب',
		description:
			'تم‌ها، فونت‌ها، والپیپرها و آیتم‌های متنوع رو از مارکت ویجتیفای انتخاب و استفاده کن',
		bullets: [
			'دسترسی به مجموعه متنوع آیتم‌های مارکت',
			'استفاده از آیتم‌های منتخب بدون خرید جداگانه',
		],
	},
	// {
	// 	id: 'upcoming_features',
	// 	tabTitle: 'قابلیت‌های جدید',
	// 	icon: 'crown',
	// 	title: 'امکانات بیشتر، به‌زودی',
	// 	description: `قابلیت‌های جدید و امکانات کاربردی بیشتری در حال اضافه شدن به ویجتیفای ${VIP_LABEL} هستن`,
	// 	bullets: [
	// 		'افزایش ظرفیت عادت‌ها و بوکمارک مشترک',
	// 		'ذخیره وویس برای یادداشت‌ها و تسک‌ها',
	// 		'قابلیت‌ها و آیتم‌های جدید',
	// 	],
	// },
]

const fmt = (n: number) => new Intl.NumberFormat('fa-IR').format(n)

export function VipTab() {
	const { isAuthenticated, refetchUser } = useAuth()
	const [activeSlideIndex, setActiveSlideIndex] = useState(0)
	const [selectedPlan, setSelectedPlan] = useState<VipPlan | null>(null)

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

	const currentSlide = VIP_FEATURES[activeSlideIndex]

	const handleNextSlide = () => {
		setActiveSlideIndex((prev) => (prev + 1) % VIP_FEATURES.length)
	}

	const handlePrevSlide = () => {
		setActiveSlideIndex(
			(prev) => (prev - 1 + VIP_FEATURES.length) % VIP_FEATURES.length
		)
	}

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
				onSuccess: () => {
					showToast('در حال انتقال به درگاه پرداخت...', 'success')
					Analytics.event('vip_plan_purchased')
					refetchUser()
					refetch()
				},
				onError: (error) => {
					showToast(
						(translateError(error) as string) ||
							`خطا در خرید اشتراک ${VIP_LABEL}`,
						'error'
					)
					Analytics.event('vip_plan_purchase_failed')
				},
			}
		)
	}

	return (
		<div className="flex flex-col w-full max-w-4xl px-2 py-2 mx-auto space-y-4 text-right select-none sm:px-4">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
				<div className="flex flex-col justify-between space-y-3 lg:col-span-6">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary">
								<Icon name="crown" size={18} />
							</div>
							<h2 className="text-xl font-black tracking-tight sm:text-2xl text-content">
								ویجتیفای{' '}
								<span className="text-indigo-500">{VIP_LABEL}</span>
							</h2>
						</div>

						<h3 className="text-sm font-bold text-content/90">
							ویجتیفای رو مطابق سلیقه خودت بساز
						</h3>

						<p className="text-xs leading-relaxed text-muted">
							با {VIP_LABEL} به امکانات پیشرفته دسترسی داشته باش و تجربه‌ای
							سریع‌تر، زیباتر و شخصی‌تر داشته باش
						</p>
					</div>

					<div className="min-h-48 max-h-48 flex flex-col justify-between p-3.5 rounded-2xl border border-base-content/10 bg-base-300/20">
						<div className="space-y-1.5">
							<div className="flex items-center gap-1">
								<div className="flex items-center justify-center w-7 h-7 rounded-xl text-primary shrink-0">
									<Icon name={currentSlide.icon} size={15} />
								</div>
								<h4 className="text-sm font-bold text-content">
									{currentSlide.title}
								</h4>
							</div>

							<p className="pr-1 text-xs leading-relaxed text-muted">
								{currentSlide.description}
							</p>
						</div>

						<div className="space-y-1.5 pt-1">
							{currentSlide.bullets.map((bullet, idx) => (
								<div
									key={idx}
									className="flex items-center gap-2 text-xs font-medium text-content/90"
								>
									<div className="flex items-center justify-center w-3 h-3 text-white rounded-full bg-primary shrink-0">
										<Icon name="check" size={8} />
									</div>
									<span>{bullet}</span>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between pt-2 border-t border-base-content/5">
							<button
								type="button"
								onClick={handlePrevSlide}
								className="flex items-center justify-center transition-colors border cursor-pointer w-7 h-7 rounded-xl border-base-content/10 bg-base-100/50 hover:bg-base-300/60 text-content"
								aria-label="قبلی"
							>
								<Icon name="chevronRight" size={13} />
							</button>

							<div className="flex items-center gap-1.5">
								{VIP_FEATURES.map((_, idx) => (
									<button
										key={idx}
										type="button"
										onClick={() => setActiveSlideIndex(idx)}
										className={cn(
											'transition-all duration-200 cursor-pointer rounded-full h-1.5',
											activeSlideIndex === idx
												? 'w-5 bg-primary'
												: 'w-1.5 bg-base-content/25 hover:bg-base-content/40'
										)}
										aria-label={`اسلاید ${idx + 1}`}
									/>
								))}
							</div>

							<button
								type="button"
								onClick={handleNextSlide}
								className="flex items-center justify-center transition-colors border cursor-pointer w-7 h-7 rounded-xl border-base-content/10 bg-base-100/50 hover:bg-base-300/60 text-content"
								aria-label="بعدی"
							>
								<Icon name="chevronLeft" size={13} />
							</button>
						</div>
					</div>
				</div>

				<div className="lg:col-span-6 relative rounded-3xl border border-base-content/10 overflow-hidden bg-base-300/30 flex items-center justify-center min-h-[220px] group shadow-xs">
					<img
						src={vipPreviewImg}
						alt={`پیش‌نمایش امکانات ${VIP_LABEL} ویجتیفای`}
						className="object-cover w-full h-full rounded-3xl"
					/>
					<div className="absolute inset-0 transition-opacity pointer-events-none bg-black/10 group-hover:bg-black/5" />

					<div className="absolute flex items-center justify-center w-12 h-12 transition-transform border rounded-full shadow-lg cursor-pointer bg-white/90 dark:bg-black/70 backdrop-blur-md border-white/40 text-primary group-hover:scale-110">
						<Icon name="play" size={18} className="translate-x-[-1px]" />
					</div>
				</div>
			</div>

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
						{plans.map((plan) => {
							const isSelected = selectedPlan?.id === plan.id
							const isPopular =
								plan.meta?.isPopular || plan.meta?.badge === 'popular'

							return (
								<div
									key={plan.id}
									onClick={() => setSelectedPlan(plan)}
									className={cn(
										'relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer text-right min-h-24 group',
										isSelected
											? 'border-primary bg-primary/5 ring-1 ring-primary shadow-xs'
											: 'border-base-content/10 bg-base-300/20 hover:border-primary/40 hover:bg-base-300/40'
									)}
								>
									{isPopular && (
										<div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
											محبوب‌ترین
										</div>
									)}

									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											<h5 className="text-xs font-bold text-content">
												{plan.title}
											</h5>
											<span className="text-[10px] text-muted">
												{fmt(plan.days)} روز اعتبار
											</span>
										</div>

										<div
											className={cn(
												'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
												isSelected
													? 'border-primary bg-primary text-white'
													: 'border-base-content/25 bg-base-300/50 group-hover:border-primary/50'
											)}
										>
											{isSelected && (
												<Icon name="check" size={10} />
											)}
										</div>
									</div>

									<div className="mt-2.5 space-y-1">
										<div className="flex items-baseline gap-1">
											<span className="text-base font-black text-content tabular-nums">
												{fmt(plan.price)}
											</span>
											<span className="text-[11px] text-muted">
												تومان
											</span>
										</div>
									</div>
								</div>
							)
						})}
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
							<span className="text-base font-black sm:text-lg text-content tabular-nums">
								{selectedPlan ? fmt(selectedPlan.price) : '۰'}
							</span>
							<span className="text-xs text-muted">تومان</span>
						</div>
					</div>

					<div className="flex flex-col items-center gap-1">
						<Button
							size="md"
							variant="default"
							rounded="2xl"
							disabled={!selectedPlan || isPending}
							loading={isPending}
							loadingText="در حال انتقال..."
							onClick={handlePurchase}
							className="font-bold text-white bg-indigo-500 transition-all flex items-center justify-center gap-1.5 px-6 h-10 shadow-xs cursor-pointer hover:bg-indigo-500/80!"
						>
							<Icon name="crown" size={14} />
							<span>فعال‌سازی {VIP_LABEL}</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export const ProTab = VipTab

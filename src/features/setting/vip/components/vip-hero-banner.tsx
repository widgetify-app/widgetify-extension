import { Icon } from '@/icons'
import type { IconName } from '@/icons'

interface VipFeatureItem {
	id: string
	icon: IconName
	title: string
	description: string
}

const VIP_FEATURES: VipFeatureItem[] = [
	{
		id: 'unlimited_widgets',
		icon: 'outlineSquares2X2',
		title: 'آزادی بیشتر در چیدمان',
		description: 'ویجت‌هات رو هرجور دوست داری بچین، حتی چندتا از یک ویجت',
	},
	{
		id: 'exclusive_widgets',
		icon: 'diamond',
		title: 'دسترسی کامل به ویجت‌ها',
		description:
			'از بین طرح‌ها و اندازه‌های مختلف انتخاب کن و ویجت‌هات رو متناسب با چیدمانت تنظیم کن',
	},
	{
		id: 'custom_wallpapers',
		icon: 'videoCamera',
		title: 'والپیپر ویدیویی و متحرک',
		description: 'گذاشتن ویدیوهای دلخواه به عنوان پس‌زمینه و ذخیره دائمی روی حسابت',
	},
	{
		id: 'gallery_assets',
		icon: 'shoppingBag',
		title: 'دسترسی کامل به گالری',
		description: 'به مجموعه کامل تم‌ها، والپیپرها و طرح‌های ویژه دسترسی داشته باش',
	},
]

export function VipHeroBanner() {
	return (
		<div className="relative overflow-hidden rounded-widget border border-vip-fill bg-gradient-to-br from-vip-fill via-fill to-fill p-5 sm:p-6 shadow-sm">
			<div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-vip-fill-2 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-vip-fill blur-3xl pointer-events-none" />

			<div className="relative z-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{VIP_FEATURES.map((feature) => (
						<div
							key={feature.id}
							className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-veil border border-line backdrop-blur-xs hover:bg-surface hover:border-vip-fill-2 transition-ui duration-200 shadow-sm"
						>
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-vip-fill text-vip shrink-0 mt-0.5">
								<Icon name={feature.icon} size={16} />
							</div>
							<div className="flex flex-col gap-1 min-w-0">
								<h4 className="text-xs font-bold text-fg leading-tight">
									{feature.title}
								</h4>
								<p className="text-2xs text-fg-muted leading-relaxed">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

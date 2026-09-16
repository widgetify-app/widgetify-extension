import { Icon } from '@/icons'
import type { IconName } from '@/icons/types'

interface VipFeatureItem {
	id: string
	icon: IconName
	title: string
	description: string
}

const VIP_FEATURES: VipFeatureItem[] = [
	{
		id: 'unlimited_widgets',
		icon: 'appsPlus',
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
		icon: 'outlineShoppingBag',
		title: 'دسترسی کامل به گالری',
		description: 'به مجموعه کامل تم‌ها، والپیپرها و طرح‌های ویژه دسترسی داشته باش',
	},
]

export function VipHeroBanner() {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-vip/10 bg-gradient-to-br from-vip/5 via-base-300/40 to-base-300/10 p-5 sm:p-6 shadow-sm">
			<div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-vip/20 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-vip/15 blur-3xl pointer-events-none" />

			<div className="relative z-10 flex flex-col gap-5">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-content/10 pb-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-11 h-11 rounded-2xl  text-vip  shrink-0">
							<Icon name="diamond" size={32} />
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<h2 className="text-lg sm:text-xl font-black text-content tracking-tight">
									ویجتیفای <span className="text-vip">پرو</span>
								</h2>
							</div>
							<p className="text-xs text-muted mt-0.5">
								تجربه‌ای سریع‌تر، زیباتر و بدون هیچ مرزی در چیدمان ابزارها
							</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{VIP_FEATURES.map((feature) => (
						<div
							key={feature.id}
							className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-100/50 border border-base-content/5 backdrop-blur-xs hover:bg-base-100/75 hover:border-vip/25 transition-all duration-200 shadow-2xs"
						>
							<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-vip/10 text-vip shrink-0 mt-0.5">
								<Icon name={feature.icon} size={16} />
							</div>
							<div className="flex flex-col gap-1 min-w-0">
								<h4 className="text-xs font-bold text-content leading-tight">
									{feature.title}
								</h4>
								<p className="text-[11px] text-muted leading-relaxed">
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

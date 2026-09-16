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
		id: 'unlimited',
		icon: 'infinity',
		title: 'ویجت‌های نامحدود',
		description: 'بدون سقف تعداد، هر چقدر دوست داری ویجت روی صفحه‌ت بذار',
	},
	{
		id: 'customization',
		icon: 'brush',
		title: 'شخصی‌سازی پیشرفته',
		description: 'دسترسی به تمام مدل‌ها، فونت‌ها و سایزهای اختصاصی',
	},
	{
		id: 'wallpaper_sync',
		icon: 'save',
		title: 'فضای ابری والپیپر',
		description: 'آپلود والپیپرهای شخصی بدون محدودیت حجم و همگام در تمام دستگاه‌ها',
	},
	{
		id: 'market_access',
		icon: 'shoppingBag',
		title: 'آیتم‌های مارکت',
		description: 'دسترسی کامل به تم‌ها، فونت‌ها و والپیپرهای ویژه مارکت',
	},
]

export function VipHeroBanner() {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-vip/25 bg-gradient-to-br from-vip/15 via-base-300/40 to-base-300/10 p-5 sm:p-6 shadow-sm">
			{/* Ambient Glow / Decorations */}
			<div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-vip/20 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

			<div className="relative z-10 flex flex-col gap-5">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-content/10 pb-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-vip text-white shadow-md shadow-vip/25 shrink-0">
							<Icon name="diamond" size={22} />
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-2">
								<h2 className="text-lg sm:text-xl font-black text-content tracking-tight">
									ویجتیفای <span className="text-vip">پرو</span>
								</h2>
								<span className="bg-vip/15 text-vip text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-vip/20">
									دسترسی نامحدود
								</span>
							</div>
							<p className="text-xs text-muted mt-0.5">
								تجربه‌ای سریع‌تر، زیباتر و بدون هیچ مرزی در چیدمان ابزارها
							</p>
						</div>
					</div>
				</div>

				{/* 4 Feature Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
					{VIP_FEATURES.map((feature) => (
						<div
							key={feature.id}
							className="flex flex-col gap-2 p-3 rounded-2xl bg-base-100/40 border border-base-content/5 backdrop-blur-xs hover:bg-base-100/60 hover:border-vip/20 transition-all duration-200"
						>
							<div className="flex items-center gap-2">
								<div className="flex items-center justify-center w-7 h-7 rounded-xl bg-vip/10 text-vip shrink-0">
									<Icon name={feature.icon} size={15} />
								</div>
								<h4 className="text-xs font-bold text-content leading-tight">
									{feature.title}
								</h4>
							</div>
							<p className="text-[11px] text-muted leading-relaxed line-clamp-2">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

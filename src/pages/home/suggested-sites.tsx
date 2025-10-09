import { TbExternalLink } from 'react-icons/tb'

interface SuggestedSite {
	name: string
	url: string
	description: string
	icon: string
}

const suggestedSites: SuggestedSite[] = [
	{
		name: 'ویجتی‌فای',
		url: 'https://widgetify.ir',
		description: 'وب‌سایت رسمی ویجتی‌فای',
		icon: '🏠'
	},
	{
		name: 'گیت‌هاب ویجتی‌فای',
		url: 'https://github.com/widgetify-app',
		description: 'کدهای منبع باز ویجتی‌فای',
		icon: '💻'
	},
	{
		name: 'ویرگول',
		url: 'https://virgool.io',
		description: 'پلتفرم محتوای فارسی',
		icon: '📝'
	},
	{
		name: 'زومیت',
		url: 'https://zoomit.ir',
		description: 'مجله آنلاین فناوری',
		icon: '📱'
	},
	{
		name: 'دیجی‌کالا',
		url: 'https://digikala.com',
		description: 'فروشگاه آنلاین',
		icon: '🛒'
	},
	{
		name: 'کافه‌بازار',
		url: 'https://cafebazaar.ir',
		description: 'مارکت اپلیکیشن',
		icon: '📱'
	},
	{
		name: 'تلگرام وب',
		url: 'https://web.telegram.org',
		description: 'تلگرام آنلاین',
		icon: '💬'
	},
	{
		name: 'واتساپ وب',
		url: 'https://web.whatsapp.com',
		description: 'واتساپ آنلاین',
		icon: '�'
	}
]

export function SuggestedSites() {
	return (
		<div className="space-y-4">
			<h3 className="mb-4 text-lg font-medium text-primary">سایت‌های پیشنهادی</h3>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{suggestedSites.map((site, index) => (
					<a
						key={index}
						href={site.url}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 p-4 rounded-lg bg-content/50 hover:bg-content/70 transition-all duration-200 group hover:scale-[1.02] hover:shadow-md"
					>
						<span className="text-2xl">{site.icon}</span>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<h4 className="font-medium truncate text-primary">{site.name}</h4>
								<TbExternalLink size={14} className="transition-colors text-muted group-hover:text-primary" />
							</div>
							<p className="text-sm truncate text-muted">{site.description}</p>
						</div>
					</a>
				))}
			</div>
			
			{/* اطلاعات اضافی */}
			<div className="p-4 mt-6 border rounded-lg bg-primary/10 border-primary/20">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-lg">💡</span>
					<h4 className="font-medium text-primary">نکته</h4>
				</div>
				<p className="text-sm text-muted">
					با کلیک روی هر سایت، آن در تب جدید باز می‌شود. می‌توانید سایت‌های محبوبتان را bookmark کنید.
				</p>
			</div>
		</div>
	)
}
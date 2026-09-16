import { memo, useState } from 'react'
import { Modal, Button } from '@/components/ui'
import { Icon } from '@/icons'
import { cn } from '@/common/utils/cn'

interface WidgetHelpModalProps {
	isOpen: boolean
	onClose: () => void
}

type TabType = 'move' | 'styles' | 'add' | 'presets'

interface HelpTabItem {
	id: TabType
	label: string
	icon: 'outlineDrag' | 'viewGridAdd' | 'plus' | 'squares2X2'
	videoUrl: string
	badge: string
	title: string
	description: string
	tips: string[]
}

const CDN_BASE_URL = 'https://cdn.widgetify.ir/extension/help_videos/'

const HELP_TABS: HelpTabItem[] = [
	{
		id: 'move',
		label: 'جابه‌جایی آزاد',
		icon: 'outlineDrag',
		videoUrl: `${CDN_BASE_URL}JABEJAIE-WIDGET-HA.webm`,
		badge: 'چیدمان آزاد',
		title: 'جابجایی و درگ آزاد ویجت‌ها',
		description:
			'ویجت‌ها رو بدون محدودیت به هر نقطه از صفحه بکش و چیدمان دلخواهت رو خلق کن',
		tips: [
			'روی فضای خالی صفحه کلیک راست کن و «ویرایش ویجت‌ها» رو بزن',
			'ویجت‌ها رو با درگ کردن به موقعیت دلخواهت ببر',
			'در آخر دکمه «پایان» نوار پایین صفحه رو بزن تا چیدمان قفل و ذخیره بشه',
		],
	},
	{
		id: 'styles',
		label: 'سایز و استایل',
		icon: 'viewGridAdd',
		videoUrl: `${CDN_BASE_URL}WIDGET-STYLES.webm`,
		badge: 'شخصی‌سازی',
		title: 'تغییر ابعاد و استایل ظاهری',
		description:
			'با کلیک راست روی هر ویجت، اندازه، ظاهر و نحوه نمایش اون رو به سلیقه خودت تغییر بده',
		tips: [
			'روی ویجت موردنظرت کلیک راست کن',
			'از منوی باز شده اندازه دلخواه (کوچک، متوسط یا بزرگ) رو انتخاب کن',
			'برای ویجت‌های دارای استایل اختصاصی، از گزینه «تغییر مدل و استایل» استفاده کن',
		],
	},
	{
		id: 'add',
		label: 'افزودن و تکرار',
		icon: 'plus',
		videoUrl: `${CDN_BASE_URL}ADD-NEW-ITEM-AND-NEW-LIST.webm`,
		badge: 'تنوع بی‌نهایت',
		title: 'افزودن ویجت یا ساخت چند نسخه',
		description:
			'از منوی پایین صفحه ویجت جدید اضافه کن یا از یک ویجت چندین نمونه با کاربردهای جداگانه بساز',
		tips: [
			'در حالت ویرایش، از نوار پایین گزینه «افزودن ویجت» رو بزن',
			'ویجت دلخواهت رو به صفحه اضافه کن',
			'می‌تونی چند ویجت مشابه (مثلاً چند لیست کار یا یادداشت مجزا) در صفحه داشته باشی',
		],
	},
	{
		id: 'presets',
		label: 'چیدمان‌های آماده',
		icon: 'squares2X2',
		videoUrl: `${CDN_BASE_URL}CHANGE-PREPARED-ITEMS.webm`,
		badge: 'یک کلیک',
		title: 'قالب‌ها و چیدمان‌های آماده',
		description:
			'برای تغییر سریع ظاهر تب، از الگوهای حرفه‌ای و چیدمان‌های آماده پیش‌فرض استفاده کن',
		tips: [
			'در حالت ویرایش صفحه، گزینه «چیدمان‌های آماده» رو انتخاب کن',
			'پیش‌نمایش قالب‌های مختلف رو ببین',
			'با یک کلیک قالب مدنظرت رو اعمال کن و در صورت نیاز شخصی‌سازیش کن',
		],
	},
]

function WidgetHelpModalComponent({ isOpen, onClose }: WidgetHelpModalProps) {
	const [activeTabId, setActiveTabId] = useState<TabType>('move')
	const activeTab = HELP_TABS.find((t) => t.id === activeTabId) ?? HELP_TABS[0]

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="راهنمای مدیریت و چیدمان ویجت‌ها"
			size="lg"
			direction="rtl"
			closeOnBackdropClick
		>
			<div className="flex flex-col gap-4 p-1 select-none text-right" dir="rtl">
				{/* Tab Selector */}
				<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-base-content/10">
					{HELP_TABS.map((tab) => {
						const isCurrent = tab.id === activeTabId
						return (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTabId(tab.id)}
								className={cn(
									'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium',
									isCurrent
										? 'bg-primary text-primary-content font-bold shadow-xs'
										: 'bg-base-200/80 hover:bg-base-300 text-muted'
								)}
							>
								<Icon name={tab.icon} size={14} />
								<span>{tab.label}</span>
							</button>
						)
					})}
				</div>

				{/* Video Container */}
				<div className="relative flex items-center justify-center w-full overflow-hidden border shadow-sm aspect-video max-h-56 rounded-2xl border-base-content/10 bg-base-300/40 shrink-0">
					<video
						key={activeTab.videoUrl}
						src={activeTab.videoUrl}
						autoPlay
						loop
						muted
						playsInline
						className="object-cover w-full h-full"
					/>
					<div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-base-100/80 backdrop-blur-md border border-base-content/10 text-[11px] font-bold text-content shadow-xs">
						{activeTab.badge}
					</div>
				</div>

				{/* Tab Detail Info */}
				<div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-content/10 transition-all">
					<div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
						<Icon name={activeTab.icon} size={18} />
					</div>
					<div className="flex flex-col gap-1 justify-center">
						<span className="text-xs font-bold text-content">
							{activeTab.title}
						</span>
						<p className="text-[11px] leading-relaxed text-muted">
							{activeTab.description}
						</p>
					</div>
				</div>

				{/* Tips List */}
				<div className="flex flex-col gap-2 p-3 border bg-base-200/40 rounded-2xl border-base-content/10">
					{activeTab.tips.map((tip, idx) => (
						<div key={tip} className="flex items-start gap-2.5">
							<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
								{idx + 1}
							</span>
							<p className="text-xs leading-relaxed text-content">{tip}</p>
						</div>
					))}
				</div>

				{/* Footer Action */}
				<div className="flex justify-end pt-2 border-t border-base-content/10">
					<Button
						type="button"
						onClick={onClose}
						color="primary"
						size="sm"
						rounded="xl"
						className="px-6 text-xs font-bold"
					>
						متوجه شدم
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export const WidgetHelpModal = memo(WidgetHelpModalComponent)

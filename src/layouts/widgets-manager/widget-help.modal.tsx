import { memo, useState } from 'react'
import { Modal, Button, Chip } from '@/components/ui'
import { Icon } from '@/src/icons'
import { cn } from '@/common/utils/cn'

interface WidgetHelpModalProps {
	isOpen: boolean
	onClose: () => void
}

type TabType = 'move' | 'resize' | 'advanced'

const TABS: {
	id: TabType
	label: string
	icon: 'outlineDrag' | 'maximize' | 'settings'
}[] = [
	{ id: 'move', label: 'جابه‌جایی و چیدمان', icon: 'outlineDrag' },
	{ id: 'resize', label: 'تغییر اندازه', icon: 'maximize' },
	{ id: 'advanced', label: 'مدل‌ها و تنظیمات', icon: 'settings' },
]

function WidgetHelpModalComponent({ isOpen, onClose }: WidgetHelpModalProps) {
	const [activeTab, setActiveTab] = useState<TabType>('move')

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="راهنمای مدیریت ویجت‌ها"
			size="lg"
			direction="rtl"
			closeOnBackdropClick
		>
			<div className="flex flex-col gap-4 p-1 select-none" dir="rtl">
				<div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-base-content/10">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium',
								activeTab === tab.id
									? 'bg-primary text-white font-bold shadow-xs'
									: 'bg-base-200/80 hover:bg-base-300 text-muted'
							)}
						>
							<Icon name={tab.icon} size={14} />
							<span>{tab.label}</span>
						</button>
					))}
				</div>

				{activeTab === 'move' && (
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-center w-full overflow-hidden border aspect-video rounded-2xl border-base-content/10 bg-base-300/30">
							<video
								src={
									'https://cdn.widgetify.ir/extension/WidgetDrag-b.mp4'
								}
								autoPlay
								loop
								muted
								playsInline
								className="object-cover w-full h-full"
							/>
						</div>

						<div className="flex flex-col gap-2 p-3 border bg-base-200/50 rounded-2xl border-base-content/10">
							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۱
								</span>
								<p className="text-xs leading-relaxed text-content">
									روی فضای خالی صفحه کلیک راست کن و «ویرایش ویجت‌ها» رو
									بزن
								</p>
							</div>

							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۲
								</span>
								<p className="text-xs leading-relaxed text-content">
									وقتی صفحه وارد حالت ویرایش شد، ویجت‌ها رو با درگ کردن
									به خانه و موقعیت دلخواهت ببر
								</p>
							</div>

							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۳
								</span>
								<p className="text-xs leading-relaxed text-content">
									در آخر دکمه «پایان» نوار پایین صفحه رو بزن تا چیدمان
									قفل و ذخیره بشه
								</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'resize' && (
					<div className="flex flex-col gap-3">
						<div className="flex flex-col items-center justify-center w-full gap-3 px-4 py-6 border rounded-2xl border-base-content/10 bg-base-200/50">
							<div className="w-52 p-2 rounded-2xl bg-base-100 border border-base-content/15 shadow-md flex flex-col gap-1.5">
								<div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold text-content">
									<span>📆</span>
									<span>تقویم</span>
								</div>
								<div className="h-px bg-base-content/10" />
								<span className="text-[10px] text-muted font-medium px-1">
									تغییر اندازه
								</span>
								<div dir="ltr" className="grid grid-cols-3 gap-1">
									<Chip
										onClick={() => {}}
										selected
										className="py-0.5 text-[10px]"
									>
										1 × 1
									</Chip>
									<Chip
										onClick={() => {}}
										className="py-0.5 text-[10px]"
									>
										2 × 1
									</Chip>
									<Chip
										onClick={() => {}}
										className="py-0.5 text-[10px]"
									>
										2 × 3
									</Chip>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-2 p-3 border bg-base-200/50 rounded-2xl border-base-content/10">
							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۱
								</span>
								<p className="text-xs leading-relaxed text-content">
									روی ویجت موردنظرت کلیک راست کن
								</p>
							</div>

							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۲
								</span>
								<p className="text-xs leading-relaxed text-content">
									از بخش «تغییر اندازه» منو، سایز دلخواهت رو انتخاب کن
									تا ویجت بلافاصله تغییر شکل بده
								</p>
							</div>
						</div>
					</div>
				)}

				{activeTab === 'advanced' && (
					<div className="flex flex-col gap-3">
						<div className="flex flex-col items-center justify-center w-full gap-3 px-4 py-6 border rounded-2xl border-base-content/10 bg-base-200/50">
							<div className="flex flex-col w-56 gap-1 p-2 text-xs border shadow-md rounded-2xl bg-base-100 border-base-content/15">
								<div className="flex items-center gap-1.5 px-2 py-0.5 font-bold text-content">
									<span>📝</span>
									<span>یادداشت</span>
								</div>
								<div className="h-px bg-base-content/10" />
								<div className="flex items-center gap-2 px-2 py-1 font-medium rounded-xl bg-primary/10 text-primary">
									<Icon name="brush" size={13} />
									<span>تغییر مدل و استایل</span>
								</div>
								<div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-base-200 text-muted">
									<Icon name="settings" size={13} />
									<span>تنظیمات</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-2 p-3 border bg-base-200/50 rounded-2xl border-base-content/10">
							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۱
								</span>
								<p className="text-xs leading-relaxed text-content">
									برای ویجت‌های چنداستایله (مثل استیک نوت و ساعت)، روی
									ویجت کلیک راست کن و «تغییر مدل و استایل» رو بزن
								</p>
							</div>

							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۲
								</span>
								<p className="text-xs leading-relaxed text-content">
									توی مودال پیشرفته، مدل، تم و سایز دلخواهت رو انتخاب و
									ذخیره کن
								</p>
							</div>

							<div className="flex items-start gap-2.5">
								<span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
									۳
								</span>
								<p className="text-xs leading-relaxed text-content">
									برای تنظیمات اختصاصی ویجت‌ها (مثل شهر آب و هوا یا
									ارزها)، گزینه «تنظیمات» رو انتخاب کن
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex justify-end pt-2 border-t border-base-content/10">
					<Button
						type="button"
						onClick={onClose}
						variant="primary"
						size="sm"
						rounded="xl"
						className="px-6 text-xs"
					>
						متوجه شدم
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export const WidgetHelpModal = memo(WidgetHelpModalComponent)

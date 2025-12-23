import { useEffect, useState } from 'react'
import {
	RiBug2Line,
	RiCheckboxCircleLine,
	RiThumbUpLine,
	RiSparklingLine,
	RiCompassDiscoverLine,
} from 'react-icons/ri'
import { Button } from './button/button'
import Modal from './modal'

type MediaContent = {
	type: 'image' | 'video'
	url: string
	caption?: string
}

type ReleaseNote = {
	type: 'feature' | 'bugfix' | 'improvement' | 'info'
	title: string
	description: string
	media?: MediaContent[]
}

const VERSION_NAME = 'نسخه یلدا 🍉'

const releaseNotes: ReleaseNote[] = [
	{
		title: 'ویرایش وظایف',
		type: 'feature',
		description:
			'بالاخره اضافه شد! دیگه لازم نیست برای یه تغییر کوچیک، کل تسک رو پاک کنی و از اول بنویسی.',
	},
	{
		title: 'برنامه‌ریزی دقیق‌تر',
		type: 'feature',
		description:
			'حالا می‌تونی برای کارهات تاریخ و میزان اهمیت (اولویت) تعیین کنی تا هیچ چیزی یادت نره.',
	},
	{
		title: 'انتخاب راحت‌تر شهر',
		type: 'improvement',
		description:
			'بخش آب‌وهوا رو جوری ردیف کردیم که خیلی سریع‌تر و راحت‌تر بتونی شهرت رو پیدا کنی.',
	},
	{
		title: 'خوشگل‌سازی منو',
		type: 'improvement',
		description:
			'منوی دسترسی پایین رو کمی دست‌کاری کردیم تا هم خوشگل‌تر بشه و هم کار کردن باهاش حال بده.',
	},
	{
		title: 'آب‌وهوای خلوت‌تر',
		type: 'improvement',
		description:
			'ویجت آب‌وهوا رو ساده کردیم تا فقط چیزایی که لازمه رو در یک نگاه ببینی.',
	},
	{
		title: 'بهبود فیلترهای صوتی',
		type: 'improvement',
		description:
			'بخش فیلترها و صداهای لیست وظایف رو بهینه کردیم تا حس بهتری موقع کار داشته باشی.',
	},
	{
		title: 'خداحافظی با فضای خالی',
		type: 'bugfix',
		description: 'اون فضای خالی و اضافه پایین پنجره‌ها که رو مخ بود رو کلاً حذف کردیم.',
	},
]

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
	counterValue: number | null
}

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	counterValue,
}: UpdateReleaseNotesModalProps) => {
	const [counter, setCounter] = useState<number>(0)

	useEffect(() => {
		if (isOpen && counterValue !== null) {
			setCounter(counterValue === null ? 10 : counterValue)
			const interval = setInterval(() => {
				setCounter((prev) => {
					if (prev <= 1) {
						clearInterval(interval)
						return 0
					}
					return prev - 1
				})
			}, 1000)
			return () => clearInterval(interval)
		} else {
			setCounter(0)
		}
	}, [isOpen])

	const getTypeIcon = (note: ReleaseNote) => {
		switch (note.type) {
			case 'feature':
				return <RiSparklingLine className="text-primary" size={18} />
			case 'bugfix':
				return <RiBug2Line className="text-red-500" size={18} />
			case 'improvement':
				return <RiCheckboxCircleLine className="text-green-500" size={18} />
			default:
				return <RiSparklingLine className="text-muted" size={18} />
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'آپدیت جدید رسید'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="flex flex-col max-h-[80vh]">
				<div className="flex flex-col gap-1 p-4 border-b border-base-300/20 bg-base-200/20">
					<div className="flex items-center justify-between">
						<div className="flex flex-col italic">
							<h2 className="text-3xl font-black text-content">
								{VERSION_NAME}
							</h2>
							<p className="mt-1 text-xs font-medium text-muted opacity-60">
								تغییرات جدید برای طولانی‌ترین شب سال
							</p>
						</div>
						<div className="p-2 border rounded-2xl bg-base-200/50 text-primary border-base-300/20">
							<RiCompassDiscoverLine size={24} />
						</div>
					</div>
				</div>

				<div className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
					<div className="flex flex-col gap-1">
						{releaseNotes.map((note, index) => (
							<div
								key={index}
								className="flex flex-col gap-2 p-4 italic border bg-base-200/10 border-base-300/20 rounded-[2rem] animate-in fade-in slide-in-from-bottom-3"
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-1 h-3 rounded-full bg-primary" />
										<h3 className="text-xs font-black tracking-wider uppercase text-content">
											{note.title}
										</h3>
									</div>
									{getTypeIcon(note)}
								</div>
								<p className="text-[10px] leading-relaxed text-muted font-light pr-3">
									{note.description}
								</p>
							</div>
						))}
					</div>

					<div className="flex items-center justify-center p-6 italic border border-dashed border-base-300/20 rounded-[2rem] opacity-30">
						<RiThumbUpLine className="ml-2" size={16} />
						<span className="text-[9px] font-black tracking-widest uppercase">
							دمت گرم که همراه مایی
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between p-5 border-t border-base-300/10 bg-base-200/40">
					<a
						href="https://feedback.widgetify.ir"
						target="_blank"
						rel="noreferrer"
						className="text-[10px] italic font-black text-muted hover:text-content transition-all underline decoration-dotted underline-offset-4"
					>
						پیشنهاد یا گزارش مشکل
					</a>
					<Button
						size="sm"
						onClick={onClose}
						disabled={counter > 0}
						className="min-w-[130px] h-11 !rounded-2xl font-black italic text-[11px] shadow-lg shadow-primary/10 active:scale-90 transition-all"
						isPrimary={true}
					>
						{counter > 0 ? `یه چند لحظه صبر کن (${counter})` : 'فهمیدم'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

import { useEffect, useState } from 'react'
import {
	RiBug2Line,
	RiInformationLine,
	RiStarLine,
	RiThumbUpLine,
	RiToolsLine,
} from 'react-icons/ri'
import { ConfigKey } from '@/common/constant/config.key'
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

const VERSION_NAME = ConfigKey.VERSION_NAME
const releaseNotes: ReleaseNote[] = [
	{
		title: 'ثبت حال روزانــه در تقویم!',
		type: 'feature',
		description:
			'از حالا می‌تونید در ویجت تقویم، حال روزتون رو ثبت کنید. یک نگاه کافی‌ست تا ببینید روزها با چه حالی گذشتند.',
	},
	{
		title: 'بوکمارک‌ها',
		type: 'bugfix',
		description: 'مشکل همگام‌سازی بوکمارک‌ها برطرف شد و حالا بدون خطا کار می‌کند.',
	},
	{
		title: 'حیوان خانگی',
		type: 'bugfix',
		description: 'مشکل غیرفعال کردن حیوان خانگی برطرف شد — الان کاملاً درست عمل می‌کنه',
	},
	{
		title: 'بهبود تجربه کاربری',
		type: 'improvement',
		description: 'چند تغییر ظاهری برای بهتر و تمیزتر شدن رابط کاربری اعمال کردیم ✨',
	},

	{
		title: 'بهبود عملکرد',
		type: 'improvement',
		description: 'بهبود عملکرد کلی افزونه.',
	},
	{
		title: 'معرفی ویج‌کوین - ارز داخلی ویجتیفای',
		type: 'feature',
		media: [
			{
				type: 'image',
				url: 'https://widgetify-ir.storage.c2.liara.space/extension/wig-banner.png',
				caption: 'ویج‌کوین، ارز داخلی ویجتیفای',
			},
		],
		description:
			'ویج‌کوین، ارز اختصاصی ویجتیفای معرفی شد! حالا می‌توانید با انجام فعالیت‌های مختلف ویج‌کوین جمع‌آوری کنید و آن‌ها را برای خرید محتوای پریمیوم استفاده کنید.',
	},
	{
		title: 'سیستم پاداش‌دهی و ماموریت‌ها',
		type: 'feature',
		description:
			'سیستم پاداش‌دهی جدید با ماموریت‌های مختلف اضافه شد. با تکمیل ماموریت‌ها ویج‌کوین دریافت کنید و از امکانات ویژه استفاده کنید.',
	},
	{
		title: 'دعوت دوستان با کد اختصاصی',
		type: 'feature',
		description:
			'اکنون می‌توانید با استفاده از کد دعوت مخصوص خود، دوستان‌تان را به ویجتیفای دعوت کنید و در ازای هر دعوت موفق، ویج‌کوین پاداش بگیرید.',
	},
	{
		title: 'فروشگاه والپیپر در گالری',
		type: 'feature',
		description:
			'فروشگاه جدید در قسمت گالری اضافه شد! حالا می‌توانید با ویج‌کوین‌های جمع‌آوری شده، والپیپرهای پریمیوم و اختصاصی خریداری کنید.',
	},
	{
		title: 'بهبود رابط کاربری',
		type: 'improvement',
		description:
			'بهبود‌های گسترده در طراحی و رابط کاربری قسمت‌های مختلف ویجتیفای، شامل پروفایل کاربری، تنظیمات حساب کاربری و صفحات مختلف.',
	},
	{
		title: 'بهبود عملکرد و پایداری',
		type: 'improvement',
		description:
			'بهبود عملکرد کلی افزونه، رفع مشکلات گزارش شده و افزایش پایداری سیستم برای تجربه کاربری بهتر.',
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

	const getTypeIcon = (type: 'feature' | 'bugfix' | 'improvement' | 'info') => {
		switch (type) {
			case 'feature':
				return <RiStarLine className="text-blue-500" size={18} />
			case 'bugfix':
				return <RiBug2Line className="text-red-500" size={18} />
			case 'improvement':
				return <RiToolsLine className="text-green-500" size={18} />
			case 'info':
				return <RiInformationLine className="text-purple-500" size={18} />
		}
	}

	const getTypePriority = (
		type: 'feature' | 'bugfix' | 'improvement' | 'info'
	): number => {
		switch (type) {
			case 'feature':
				return 1
			case 'improvement':
				return 2
			case 'bugfix':
				return 3
			case 'info':
				return 4
			default:
				return 5
		}
	}

	const getTypeLabel = (type: 'feature' | 'bugfix' | 'improvement' | 'info') => {
		switch (type) {
			case 'feature':
				return 'ویژگی جدید'
			case 'bugfix':
				return 'رفع اشکال'
			case 'improvement':
				return 'بهبود'
			case 'info':
				return 'اطلاعات'
			default:
				return ''
		}
	}

	const renderMedia = (media: MediaContent) => {
		if (media.type === 'image') {
			return (
				<div className="my-2 overflow-hidden rounded-lg shadow-md">
					<img
						src={media.url}
						alt={media.caption || 'تصویر بروزرسانی'}
						className="object-contain w-full h-auto"
						loading="lazy"
					/>
					{media.caption && (
						<p className="p-2 text-xs text-center text-muted bg-content/30">
							{media.caption}
						</p>
					)}
				</div>
			)
		} else if (media.type === 'video') {
			return (
				<div className="my-2 overflow-hidden rounded-lg shadow-md">
					<div className="relative">
						<video
							controls
							className="w-full h-auto"
							poster="/assets/video-poster.png"
							aria-label={media.caption || 'ویدیو بروزرسانی'}
						>
							<source src={media.url} type="video/mp4" />
							<track
								kind="captions"
								src="/assets/captions.vtt"
								label="فارسی"
								srcLang="fa"
								default
							/>
							مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
						</video>
					</div>
					{media.caption && (
						<p className="p-2 text-xs text-center text-muted bg-content/30">
							{media.caption}
						</p>
					)}
				</div>
			)
		}
		return null
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'آپدیت جدید نصب شد 🎉'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="p-4 max-h-[80vh] overflow-y-auto">
				<div className="flex flex-col items-center mb-2 text-center">
					<h2
						className={'text-2xl font-bold mb-2 text-content animate-fade-in'}
						style={{ animationDelay: '0.1s' }}
					>
						{VERSION_NAME}
					</h2>
					<div className="w-16 h-1 mb-2 bg-blue-500 rounded-full"></div>
					<img
						src={
							'https://widgetify-ir.storage.c2.liara.space/extension/user-moods.png'
						}
						alt={'تصویر بروزرسانی'}
						className="object-contain w-full h-auto rounded-2xl"
						loading="lazy"
					/>
				</div>

				<div className="flex flex-col h-64 gap-2">
					{releaseNotes.map((note, index) => (
						<article
							key={index}
							className="pb-4 border-b blog-post border-content animate-fade-in animate-slide-up"
							style={{ animationDelay: `${0.2 + index * 0.1}s` }}
						>
							<div className="flex items-start justify-between mb-3">
								<h3 className="text-xl font-bold text-content">
									{note.title}
								</h3>
								<span
									className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getTypePriority(note.type)}`}
								>
									{getTypeIcon(note.type)}
									<span className="mr-1">
										{getTypeLabel(note.type)}
									</span>
								</span>
							</div>

							<div className="mt-2">
								<p className="leading-relaxed text-justify text-muted">
									{note.description}
								</p>
							</div>

							{note.media && note.media.length > 0 && (
								<div className="media-container">
									{note.media.map((mediaItem, mediaIndex) => (
										<div key={mediaIndex}>
											{renderMedia(mediaItem)}
										</div>
									))}
								</div>
							)}
						</article>
					))}
					<div
						className="flex items-center justify-center p-4 mt-2 rounded-lg animate-fade-in bg-content/10"
						style={{ animationDelay: '0.6s' }}
					>
						<div className="flex items-center">
							<RiThumbUpLine className="ml-2 text-blue-500" size={20} />
							<p className="text-sm text-muted">
								از اینکه ویجتی‌فای را انتخاب کرده‌اید سپاسگزاریم 💙
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between p-4 border-t border-content">
				<a
					href="https://feedback.widgetify.ir"
					target="_blank"
					rel="noreferrer"
					className="text-xs underline transition-colors duration-300 text-muted hover:text-blue-500"
				>
					گزارش مشکل / پیشنهاد
				</a>
				<Button
					onClick={onClose}
					disabled={counter > 0}
					className="transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] px-5 py-2 rounded-2xl"
					size="md"
					isPrimary={true}
				>
					شروع استفاده {counter > 0 ? `(${counter})` : ''}
				</Button>
			</div>
		</Modal>
	)
}

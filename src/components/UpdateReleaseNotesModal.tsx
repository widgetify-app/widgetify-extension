import {
	RiBug2Line,
	RiInformationLine,
	RiStarLine,
	RiThumbUpLine,
	RiToolsLine,
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

const VERSION_NAME = 'فیروزه'
const releaseNotes: ReleaseNote[] = [
	{
		title: '🔐 کنترل کامل بر روی بوکمارک‌های مرورگر',
		description:
			'حالا می‌تونید خودتون تصمیم بگیرید که آیا ویجتی‌فای به بوکمارک‌هاتون دسترسی داشته باشه یا نه! این قابلیت رو از قسمت تنظیمات فعال یا غیرفعال کنید و حریم خصوصی‌تون رو کنترل کنید.',
		media: [],
		type: 'feature',
	},
	{
		title: '👁️‍🗨️ حالت پنهان برای حفظ حریم شخصی',
		description:
			'کارتون محرمانه است؟ نگران نباشید! حالت پنهان جدید محتوای حساس ویجت‌هاتون مثل یادداشت‌ها، تسک‌ها و جلسات کلندرتون رو از چشم فضول‌ها مخفی می‌کنه. کافیه یک کلیک کنید تا همه چیز امن و پنهان بشه.',
		media: [],
		type: 'feature',
	},
	{
		title: 'بهبود تم زرنا',
		description: 'بهبود در رنگ بندی زرنا',
		media: [],
		type: 'improvement',
	},
]

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
}: UpdateReleaseNotesModalProps) => {
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
						className="object-cover w-full h-auto"
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
			title={'بروزرسانی‌های ویجتی‌فای 🎉'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="p-4 max-h-[80vh] overflow-y-auto">
				{/* Header with version name */}
				<div className="flex flex-col items-center text-center">
					<h2
						className={'text-2xl font-bold mb-2 text-content animate-fade-in'}
						style={{ animationDelay: '0.1s' }}
					>
						{VERSION_NAME}
					</h2>
					<div className="w-16 h-1 mb-4 bg-blue-500 rounded-full"></div>
				</div>

				{/* Blog-style article */}
				<div className="flex flex-col h-64 gap-2">
					{releaseNotes.map((note, index) => (
						<article
							key={index}
							className="pb-4 border-b blog-post border-content animate-fade-in animate-slide-up"
							style={{ animationDelay: `${0.2 + index * 0.1}s` }}
						>
							{/* Type badge and title */}
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

							{/* Media section (if available) */}
							{note.media && note.media.length > 0 && (
								<div className="media-container">
									{note.media.map((mediaItem, mediaIndex) => (
										<div key={mediaIndex}>
											{renderMedia(mediaItem)}
										</div>
									))}
								</div>
							)}

							{/* Content */}
							<div className="mt-2">
								<p className="leading-relaxed text-justify text-muted">
									{note.description}
								</p>
							</div>
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
					className="transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] px-5 py-2 rounded-md"
					size="md"
					isPrimary={true}
				>
					شروع استفاده
				</Button>
			</div>
		</Modal>
	)
}

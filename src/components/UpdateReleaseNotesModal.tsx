import { useEffect, useState } from 'react'
import {
	RiBug2Line,
	RiCheckboxCircleLine,
	RiThumbUpLine,
	RiSparklingLine,
} from 'react-icons/ri'
import { Button } from './button/button'
import Modal from './modal'
import { ConfigKey } from '@/common/constant/config.key'

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
		type: 'feature',
		title: 'امکان سرچ با عکس',
		description:
			'حالا میتونی با آپلود عکس، چیزایی که میخوای رو پیدا کنی! امتحانش کن، ممکنه عاشقش بشی! 🖼️🔍',
	},
	{
		type: 'feature',
		title: 'امکان جستجوی صوتی',
		description:
			'حالا میتونی با صدات جستجو کنی! فقط کافی‌یه روی آیکون میکروفون کلیک کنی و شروع به صحبت کنی! 🎤',
	},
	{
		type: 'feature',
		title: 'امکان فیلتر تگ وظایف',
		description:
			'حالا میتونی توی ویجت وظایف، فقط اونایی که تگ خاصی دارن رو ببینی! یه عالمه کارایی که میتونی باهاش انجام بدی 🏷️',
	},
	{
		type: 'improvement',
		title: 'بهبود ظاهری',
		description: 'یکم به ظاهر رسیدگی کردیم، حالا همه چیز جذاب‌تر و دلنشین‌تر شده!',
	},
	{
		type: 'improvement',
		title: 'بهبود عملکرد کلی',
		description:
			'با بهینه‌سازی‌های انجام شده، حالا همه چیز سریع‌تر و روان‌تر از قبل اجرا میشه',
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
			title={'🥳 نسخه جدید، آمادست!'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="flex flex-col max-h-[80vh]">
				<div className="relative overflow-hidden border-b border-base-300/20 rounded-2xl h-28">
					<div className="absolute inset-0 scale-105 bg-center bg-no-repeat bg-cover animate-pan" />

					<div className="relative flex flex-col gap-1 p-5">
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<h2 className="text-3xl font-black text-content">
									{VERSION_NAME}
								</h2>
								<p className="mt-1 text-xs font-medium text-muted">
									آپدیت جدید با کلی ویژگی و بهبود جذاب اومده!
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
					<div className="flex flex-col gap-1">
						{releaseNotes.map((note, index) => (
							<div
								key={index}
								className="flex flex-col gap-2 p-4 border bg-base-200/10 border-base-300/20 rounded-2xl animate-in fade-in slide-in-from-bottom-3"
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
								<p className="text-[10px] leading-relaxed text-base-content/80  pr-1">
									{note.description}
								</p>
							</div>
						))}
					</div>

					<div className="flex items-center justify-center p-6 text-muted">
						<RiThumbUpLine className="ml-2" size={16} />
						<span className="text-xs">دمت گرم که همراه مایی</span>
					</div>
				</div>

				<div className="flex items-center justify-between p-5 border-t border-base-300/10 bg-base-200/40">
					<a
						href="https://feedback.widgetify.ir"
						target="_blank"
						rel="noreferrer"
						className="text-[10px]  font-black text-muted hover:text-content transition-all underline decoration-dotted underline-offset-4"
					>
						پیشنهاد یا گزارش مشکل
					</a>
					<Button
						size="sm"
						onClick={onClose}
						disabled={counter > 0}
						className="min-w-[130px] h-11 !rounded-2xl font-black text-xs shadow-lg shadow-primary/10 disabled:shadow-none active:scale-90 transition-all disabled:text-base-content/30"
						isPrimary={true}
					>
						{counter > 0 ? `یه چند لحظه صبر کن (${counter})` : 'فهمیدم'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

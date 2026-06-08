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
		title: 'امکان پیشنمایش در فروشگاه',
		description:
			'الان دیگه قبل اینکه از فروشگاه والپیپر یا هرچیز دیگه ای بخری، میتونی پیشنمایش داشته باشی🐳',
	},
	{
		type: 'feature',
		title: 'مدیریت اعلانات',
		description: '',
	},
	{
		type: 'improvement',
		title: 'بهبود ظاهری فروشگاه',
		description: '',
	},
	{
		type: 'improvement',
		title: 'بهبود قسمت سرچ های پیشنهادی',
		description: '',
	},
	{
		type: 'improvement',
		title: 'بهبود برنامک ها',
		description: '',
	},
	{
		type: 'improvement',
		description: '',
		title: 'بهبود عملکرد کلی',
	},
	{
		type: 'bugfix',
		description: '',
		title: 'رفع مشکلات گزارش شده',
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
			setCounter(counterValue === null ? 2 : counterValue)
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
			title={'🏖️ نسخه جدید نصب شد!'}
			size="lg"
			direction="rtl"
			closeOnBackdropClick={false}
			showCloseButton={false}
		>
			<div className="flex flex-col max-h-[85vh]">
				<div className="relative overflow-hidden border-b border-base-300/20 rounded-2xl h-62">
					<div
						className="absolute inset-0 scale-105 bg-top bg-no-repeat bg-contain animate-pan"
						style={{
							backgroundImage:
								'url(http://cdn.widgetify.ir/extension/sahel-update.jpg)',
							maskImage:
								'linear-gradient(to bottom, black 65%, transparent 100%)',
							WebkitMaskImage:
								'linear-gradient(to bottom, black 65%, transparent 100%)',
						}}
					/>
				</div>

				<div className="flex-1 p-2 space-y-1 overflow-y-auto max-h-40">
					<div className="flex flex-col gap-1">
						{releaseNotes.map((note, index) => (
							<div
								key={index}
								className="flex flex-col gap-2 px-2 py-1 border bg-base-200/10 border-base-300/20 rounded-2xl animate-in fade-in slide-in-from-bottom-3"
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

					<div className="flex items-center justify-center p-2 text-muted">
						<RiThumbUpLine className="ml-2" size={16} />
						<span className="text-xs">دمت گرم که همراه مایی</span>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-between p-2 border-t border-base-300/10 bg-base-200/40">
				<a
					href="https://ble.ir/widgetify"
					target="_blank"
					rel="noreferrer"
					className="text-[10px] border-none outline-none ring-0 font-black text-muted hover:text-content transition-all underline decoration-dotted underline-offset-4"
				>
					کانال و گروه ما در بله
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
		</Modal>
	)
}

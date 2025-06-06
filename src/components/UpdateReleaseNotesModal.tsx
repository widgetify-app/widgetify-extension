import {
	RiBug2Line,
	RiCheckboxCircleFill,
	RiGiftLine,
	RiInformationLine,
	RiStarLine,
	RiThumbUpLine,
	RiToolsLine,
} from 'react-icons/ri'
import { Button } from './button/button'
import Modal from './modal'

type ReleaseNote = {
	type: 'feature' | 'bugfix' | 'improvement' | 'info'
	description: string
}

const VERSION_NAME = 'تهران'
const SUMMARY =
	'در این نسخه از ویجتی‌فای، ویجت ساب‌شمار برای نمایش آمار کانال یوتیوب، سیستم غذادهی به حیوانات خانگی، دو حیوان جدید (گربه و قورباغه) و قابلیت نمایش وظایف ماه و روز اضافه شده است. همچنین بهبودهایی در دکمه بازگشت بوکمارک‌ها، ظاهر ویجت آب و هوا و سایز حیوانات خانگی اعمال شده است.'
const releaseNotes: ReleaseNote[] = [
	{
		type: 'feature',
		description: '📊 اضافه شدن ویجت ساب شمار (آمار کانال یوتیوب)',
	},
	{
		type: 'feature',
		description: '🍲 اضافه شدن سیستم غذا دهی به پت ها',
	},
	{
		type: 'feature',
		description: '🐱 اضافه شدن گربه به بخش حیوان خانگی',
	},
	{
		type: 'feature',
		description: '🐸 اضافه شدن قورباغه به بخش حیوان خانگی',
	},
	{
		type: 'feature',
		description: '📅 اضافه شدن نوع وظیفه (نمایش وظایف ماه و روز)',
	},
	{
		type: 'improvement',
		description: '🔙 بهبود دکمه بازگشت در بوکمارک ها',
	},
	{
		type: 'improvement',
		description: '🌦️ بهبود ظاهری ویجت آب و هوا',
	},
	{
		type: 'improvement',
		description: '🐾 بهبود سایز پت ها',
	},
	{
		type: 'info',
		description:
			'برای دیدن تمامی تغییرات و ارسال بازخورد، به صفحه گیت‌هاب ما مراجعه کنید',
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

	const sortNotesByType = (notes: ReleaseNote[]) => {
		return [...notes].sort(
			(a, b) => getTypePriority(a.type) - getTypePriority(b.type)
		)
	}

	const getCategoryTitle = (type: 'feature' | 'bugfix' | 'improvement' | 'info') => {
		switch (type) {
			case 'feature':
				return 'ویژگی‌های جدید'
			case 'bugfix':
				return 'رفع اشکالات'
			case 'improvement':
				return 'بهبودها'
			case 'info':
				return 'اطلاعات'
			default:
				return ''
		}
	}

	const sortedNotes = sortNotesByType(releaseNotes)
	const groupedNotes = sortedNotes.reduce(
		(acc, note) => {
			if (!acc[note.type]) {
				acc[note.type] = []
			}
			acc[note.type].push(note)
			return acc
		},
		{} as Record<string, ReleaseNote[]>
	)

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={'ویجتی‌فای به نسخه جدید بروزرسانی شد 🎉'}
			size="md"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="p-2 max-h-[32rem] sm:max-h-85 overflow-y-auto">
				<div className="flex flex-col items-center mb-2 text-center">
					<h2
						className={'text-xl font-bold mb-1 text-content animate-fade-in'}
						style={{ animationDelay: '0.1s' }}
					>
						{VERSION_NAME}
					</h2>
				</div>

				<div
					className={
						'mb-5 p-4 rounded-lg bg-content border border-content animate-fade-in animate-slide-up'
					}
					style={{ animationDelay: '0.2s' }}
				>
					<div className="flex items-center mb-3">
						<RiGiftLine className="ml-2 text-amber-500" size={20} />
						<h3 className={'font-semibold text-content'}>
							به روزرسانی ویجتی‌فای
						</h3>
					</div>
					<p className={'text-sm text-muted'}>{SUMMARY}</p>
				</div>

				<div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
					{Object.entries(groupedNotes).map(([type, notes], idx) => (
						<div
							key={type}
							className="mb-5 animate-fade-in animate-slide-up"
							style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
						>
							<div className="flex items-center mb-3">
								<div className="inline-flex items-center">
									{getTypeIcon(type as any)}
									<h3 className={'mr-2 font-medium text-content'}>
										{getCategoryTitle(type as any)}
									</h3>
								</div>
								<div
									className={'flex-1 h-px border border-content mr-2'}
								></div>
							</div>

							<ul className="mr-2 space-y-3">
								{notes.map((note, noteIdx) => (
									<li
										key={noteIdx}
										className="flex animate-fade-in animate-slide-right"
										style={{ animationDelay: `${noteIdx * 0.05}s` }}
									>
										<div className="mt-0.5 ml-2">
											{type !== 'info' ? (
												<RiCheckboxCircleFill
													className="text-blue-500"
													size={16}
												/>
											) : (
												getTypeIcon(note.type)
											)}
										</div>
										<div>
											<p className={'text-sm text-muted'}>
												{note.description}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div
					className="flex items-center justify-center mt-6 animate-fade-in"
					style={{ animationDelay: '0.6s' }}
				>
					<div className="flex items-center">
						<RiThumbUpLine className="ml-1 text-blue-500" size={18} />
						<p className={'text-sm text-muted'}>
							از اینکه ویجتی‌فای را انتخاب کرده‌اید سپاسگزاریم 💙
						</p>
					</div>
				</div>
			</div>
			<div
				className={
					'p-3 border-t border-content flex justify-between items-center'
				}
			>
				{' '}
				<a
					href="https://github.com/widgetify-app"
					target="_blank"
					rel="noreferrer"
					className={
						'text-xs underline text-muted hover:text-blue-500 transition-colors duration-300'
					}
				>
					گزارش مشکل / پیشنهاد
				</a>
				<Button
					onClick={onClose}
					className={
						'transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] px-5 py-2 rounded-md'
					}
					size="md"
					isPrimary={true}
				>
					شروع استفاده
				</Button>
			</div>
		</Modal>
	)
}

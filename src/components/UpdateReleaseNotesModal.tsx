import {
	getBorderColor,
	getButtonStyles,
	getCardBackground,
	getDescriptionTextStyle,
	getHeadingTextStyle,
	getTextColor,
	useTheme,
} from '@/context/theme.context'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import {
	RiBug2Line,
	RiCheckboxCircleFill,
	RiGiftLine,
	RiInformationLine,
	RiStarLine,
	RiThumbUpLine,
	RiToolsLine,
} from 'react-icons/ri'
import Modal from './modal'

type ReleaseNote = {
	type: 'feature' | 'bugfix' | 'improvement' | 'info'
	description: string
}

const CURRENT_VERSION = '1.0.5'
const VERSION_NAME = 'خلیــج فارس'
const SUMMARY = `در این نسخه از ویجتی‌فای، ویجت یادداشت، مدیریت دوستان و تنظیمات منطقه زمانی
							اضافه شده است. همچنین بسیاری از بخش‌های برنامه با هدف بهبود تجربه کاربری
							به‌روزرسانی شده‌اند.`
const releaseNotes: ReleaseNote[] = [
	{
		type: 'feature',
		description: '📝 اضافه شدن ویجت یادداشت، برای یادداشت‌برداری سریع و آسان',
	},
	{
		type: 'feature',
		description: '🫂 اضافه شدن امکان افزودن و مدیریت دوستان به حساب کاربری شما',
	},
	{
		type: 'feature',
		description: '👀 امکان به اشتراک‌گذاری وضعیت فعلی با دوستان',
	},
	{
		type: 'feature',
		description: '🌍 قابلیت انتخاب و تنظیم منطقه زمانی متناسب با موقعیت شما',
	},
	{
		type: 'improvement',
		description: 'شورت کات های جدید برای بوکمارک ها ',
	},
	{
		type: 'improvement',
		description: '🧰 بهبود قسمت مدیریت ویجت ها',
	},
	{
		type: 'improvement',
		description: '✓ ارتقای عملکرد و رابط کاربری ویجت وظیفه‌ها (Todo List)',
	},
	{
		type: 'improvement',
		description: '📅 بهبود ظاهری ویجت تقویم',
	},
	{
		type: 'improvement',
		description: '⛅ بهبود ظاهری ویجت آب و هوا',
	},
	{
		type: 'improvement',
		description: '✨ بهینه‌سازی چیدمان ویجت‌ها برای تجربه کاربری بهتر',
	},
	{
		type: 'info',
		description: 'برای دیدن تمامی تغییرات و ارسال بازخورد، به صفحه گیت‌هاب ما مراجعه کنید',
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
	const { theme } = useTheme()
	const prefersReducedMotion = useReducedMotion()

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
		type: 'feature' | 'bugfix' | 'improvement' | 'info',
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
		return [...notes].sort((a, b) => getTypePriority(a.type) - getTypePriority(b.type))
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

	const fadeInUpVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: custom * 0.1,
				duration: 0.4,
				ease: 'easeOut',
			},
		}),
	}

	const listItemVariants = {
		hidden: { opacity: 0, x: 5 },
		visible: (custom: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: custom * 0.05,
				duration: 0.3,
				ease: 'easeOut',
			},
		}),
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
		{} as Record<string, ReleaseNote[]>,
	)

	const animationProps = prefersReducedMotion
		? { animate: 'visible', initial: 'visible' }
		: { animate: 'visible', initial: 'hidden' }

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`ویجتی‌فای به نسخه ${CURRENT_VERSION} بروزرسانی شد 🎉`}
			size="md"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<LazyMotion features={domAnimation} strict>
				<div className="p-2 max-h-[32rem] sm:max-h-85 overflow-y-auto">
					<div className="flex flex-col items-center mb-2 text-center">
						<m.h2
							variants={fadeInUpVariants}
							{...animationProps}
							custom={1}
							className={`text-xl font-bold mb-1 ${getHeadingTextStyle(theme)}`}
						>
							{VERSION_NAME} - نسخه {CURRENT_VERSION}
						</m.h2>
					</div>

					<m.div
						variants={fadeInUpVariants}
						{...animationProps}
						custom={2}
						className={`mb-5 p-4 rounded-lg ${getCardBackground(theme)} border ${getBorderColor(theme)}`}
					>
						<div className="flex items-center mb-3">
							<RiGiftLine className="ml-2 text-amber-500" size={20} />
							<h3 className={`font-semibold ${getHeadingTextStyle(theme)}`}>
								به روزرسانی ویجتی‌فای
							</h3>
						</div>
						<p className={`text-sm ${getDescriptionTextStyle(theme)}`}>{SUMMARY}</p>
					</m.div>

					<m.div variants={fadeInUpVariants} {...animationProps} custom={3}>
						{Object.entries(groupedNotes).map(([type, notes], idx) => (
							<m.div
								key={type}
								variants={fadeInUpVariants}
								{...animationProps}
								custom={3 + idx}
								className="mb-5"
							>
								<div className="flex items-center mb-3">
									<div className="inline-flex items-center">
										{getTypeIcon(type as any)}
										<h3 className={`mr-2 font-medium ${getTextColor(theme)}`}>
											{getCategoryTitle(type as any)}
										</h3>
									</div>
									<div className={`flex-1 h-px ${getBorderColor(theme)} mr-2`}></div>
								</div>

								<ul className="mr-2 space-y-3">
									{notes.map((note, noteIdx) => (
										<m.li
											key={noteIdx}
											variants={listItemVariants}
											{...animationProps}
											custom={noteIdx}
											className="flex"
										>
											<div className="mt-0.5 ml-2">
												{type !== 'info' ? (
													<RiCheckboxCircleFill className="text-blue-500" size={16} />
												) : (
													getTypeIcon(note.type)
												)}
											</div>
											<div>
												<p className={`text-sm ${getDescriptionTextStyle(theme)}`}>
													{note.description}
												</p>
											</div>
										</m.li>
									))}
								</ul>
							</m.div>
						))}
					</m.div>

					<m.div
						variants={fadeInUpVariants}
						{...animationProps}
						custom={6}
						className="flex items-center justify-center mt-6"
					>
						<div className="flex items-center">
							<RiThumbUpLine className="ml-1 text-blue-500" size={18} />
							<p className={`text-sm ${getDescriptionTextStyle(theme)}`}>
								از اینکه ویجتی‌فای را انتخاب کرده‌اید سپاسگزاریم 💙
							</p>
						</div>
					</m.div>
				</div>
			</LazyMotion>
			<div
				className={`p-3 border-t ${getBorderColor(theme)} flex justify-between items-center`}
			>
				{' '}
				<a
					href="https://github.com/widgetify-app"
					target="_blank"
					rel="noreferrer"
					className={`text-xs underline ${getDescriptionTextStyle(theme)} hover:text-blue-500 transition-colors duration-300`}
				>
					گزارش مشکل / پیشنهاد
				</a>
				<m.button
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.98 }}
					onClick={onClose}
					className={`${getButtonStyles(theme, true)} cursor-pointer transition-all duration-300 px-5 py-2 rounded-md`}
				>
					شروع استفاده
				</m.button>
			</div>
		</Modal>
	)
}

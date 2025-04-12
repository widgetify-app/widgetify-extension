import { useTheme } from '@/context/theme.context'
import { motion } from 'framer-motion'
import { RiBug2Line, RiCheckboxCircleFill, RiStarLine, RiToolsLine } from 'react-icons/ri'
import Modal from './modal'

type ReleaseNotes = Record<
	string,
	{
		type: 'feature' | 'bugfix' | 'improvement'
		description: string
	}[]
>
const releaseNotes: ReleaseNotes = {
	'1.0.2': [
		{
			type: 'feature',
			description: 'اضافه شدن ویجت آخرین خبرهای روز',
		},
		{
			type: 'feature',
			description: 'اضافه شدن قابلیت فعال و غیرفعال کردن ویجت‌ها',
		},
		{
			type: 'feature',
			description: 'اضافه شدن ایجاد حساب کاربری و ورود به آن',
		},
		{
			type: 'feature',
			description: 'اضافه شدن امکان همگام‌سازی اطلاعات با حساب کاربری (sync)',
		},
		{
			type: 'feature',
			description: 'نمایش تاریخ میلادی و قمری روز در ویجت تقویم',
		},
		{
			type: 'improvement',
			description: 'بهبود نمایش ویجت‌ها در اندازه‌های مختلف صفحه نمایش و دستگاه‌های مختلف',
		},
		{
			type: 'improvement',
			description: 'بهبود طراحی در قسمت های: ویجت ها و تنظیمات',
		},
		{
			type: 'bugfix',
			description: 'رفع چندین مشکل جزئی',
		},
	],
	'1.0.1': [
		{ type: 'improvement', description: 'بهبود قسمت سرچ باکس' },
		{ type: 'improvement', description: 'بهینه‌سازی تقویم و سیستم مدیریت یادداشت‌ها' },
		{ type: 'feature', description: 'افزودن قابلیت Pomodoro Timer برای مدیریت زمان' },
		{ type: 'bugfix', description: 'رفع باگ نمایش آیکون‌های بوکمارک' },
		{ type: 'improvement', description: 'بازطراحی رابط کاربری افزودن بوکمارک' },
		{ type: 'improvement', description: 'بهبود نمایش مسیر پوشه‌ها در بخش بوکمارک‌ها' },
	],
	'1.0.0': [
		{ type: 'feature', description: 'انتشار نسخه اولیه ویجتی‌فای با امکانات پایه' },
	],
}

type UpdateReleaseNotesModalProps = {
	isOpen: boolean
	onClose: () => void

	currentVersion?: string
}

export const UpdateReleaseNotesModal = ({
	isOpen,
	onClose,
	currentVersion,
}: UpdateReleaseNotesModalProps) => {
	const { themeUtils } = useTheme()

	const getTypeIcon = (type: 'feature' | 'bugfix' | 'improvement') => {
		switch (type) {
			case 'feature':
				return <RiStarLine className="text-blue-500" size={16} />
			case 'bugfix':
				return <RiBug2Line className="text-red-500" size={16} />
			case 'improvement':
				return <RiToolsLine className="text-green-500" size={16} />
		}
	}

	const getTypePriority = (type: 'feature' | 'bugfix' | 'improvement'): number => {
		switch (type) {
			case 'feature':
				return 1
			case 'improvement':
				return 2
			case 'bugfix':
				return 3
			default:
				return 4
		}
	}

	const sortNotesByType = (notes: (typeof releaseNotes)[string]) => {
		return [...notes].sort((a, b) => getTypePriority(a.type) - getTypePriority(b.type))
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="نسخه جدید ویجتی‌فای تو مرورگرته 🎉"
			size="md"
			direction="rtl"
		>
			<div className="p-4 max-h-[28rem] sm:max-h-[32rem] overflow-y-auto">
				{Object.entries(releaseNotes).map(([version, notes], idx) => (
					<motion.div
						key={version}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.1 }}
						className="mb-6"
					>
						<div className="flex items-center mb-2">
							<h3
								className={`text-base sm:text-lg font-bold ${
									version === currentVersion
										? themeUtils.getHeadingTextStyle()
										: themeUtils.getTextColor()
								}`}
							>
								نسخه {version}
							</h3>
							{version === currentVersion && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2 }}
									className="mr-2"
								>
									<RiCheckboxCircleFill className="text-blue-500" size={20} />
								</motion.div>
							)}
						</div>

						<ul className={`mr-2 ${themeUtils.getDescriptionTextStyle()}`}>
							{sortNotesByType(notes).map((note, noteIdx) => (
								<motion.li
									key={noteIdx}
									initial={{ opacity: 0, x: 5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: idx * 0.1 + noteIdx * 0.05 }}
									className="flex mb-3"
								>
									<div className="mt-0.5 ml-2">{getTypeIcon(note.type)}</div>
									<div>
										<p className="text-sm font-light">{note.description}</p>
									</div>
								</motion.li>
							))}
						</ul>
					</motion.div>
				))}
			</div>
			<div
				className={`p-4 cursor-pointer border-t ${themeUtils.getBorderColor()} flex justify-end`}
			>
				<button onClick={onClose} className={themeUtils.getButtonStyles()}>
					متوجه شدم
				</button>
			</div>
		</Modal>
	)
}

import { useTheme } from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { RiBug2Line, RiCheckboxCircleFill, RiStarLine, RiToolsLine } from 'react-icons/ri'
import Modal from './modal'

type ReleaseNotes = Record<
	string,
	{
		name: string
		notes: {
			type: 'feature' | 'bugfix' | 'improvement'
			description: string
		}[]
	}
>
const releaseNotes: ReleaseNotes = {
	'1.0.4': {
		name: 'کیهان',
		notes: [
			{
				type: 'feature',
				description: 'امکان شخصی‌سازی کامل بوکمارک‌ها با تغییر رنگ پس زمینه و متن',
			},
			{
				type: 'feature',
				description: 'قابلیت افزودن استیکر به بوکمارک‌ها برای شناسایی سریع‌تر',
			},
			{
				type: 'feature',
				description: 'سازماندهی آسان بوکمارک‌ها با قابلیت درگ و دراپ',
			},
			{
				type: 'feature',
				description: 'استفاده همزمان از ویجی‌ارز و ویجی‌نیوز به طور همزمان',
			},
			{
				type: 'improvement',
				description: 'بهبود ظاهری',
			},
		],
	},
	'1.0.3': {
		name: 'طلوع',
		notes: [
			{
				type: 'feature',
				description: 'اضافه شدن اوقات شرعی به ویجت تقویم',
			},
			{
				type: 'feature',
				description: 'اضافه شدن امکان اتصال به اکانت گوگل برای دسترسی به گوگل کلندر',
			},
			{
				type: 'feature',
				description: 'اضافه شدن قابلیت افزودن فیدهای (RSS) منابع خبری',
			},
			{
				type: 'feature',
				description: 'اضافه شدن گرادیان ها به عنوان تصویر زمینه',
			},
			{
				type: 'feature',
				description: 'اضافه شدن یادداورهای روزانه به کارت ویجتی‌فای',
			},
			{
				type: 'feature',
				description: 'همگام سازی بوکمارک ها با اکانت کاربری',
			},
			{
				type: 'feature',
				description: 'اضافه شدن ترندهای روز و ویجی‌باکس به سرچ باکس',
			},
			{
				type: 'improvement',
				description: 'بهبود عملکرد و سرعت بارگذاری ویجت‌ها',
			},
			{
				type: 'improvement',
				description: 'بهبود طراحی و کارایی ویجت‌ها',
			},
			{
				type: 'bugfix',
				description: 'رفع چندین مشکل جزئی و بهبود تجربه کاربری',
			},
		],
	},
	'1.0.2': {
		name: 'آسمان',
		notes: [
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
	},
	'1.0.1': {
		name: 'نسیم',
		notes: [
			{ type: 'improvement', description: 'بهبود قسمت سرچ باکس' },
			{ type: 'improvement', description: 'بهینه‌سازی تقویم و سیستم مدیریت یادداشت‌ها' },
			{ type: 'feature', description: 'افزودن قابلیت Pomodoro Timer برای مدیریت زمان' },
			{ type: 'bugfix', description: 'رفع باگ نمایش آیکون‌های بوکمارک' },
			{ type: 'improvement', description: 'بازطراحی رابط کاربری افزودن بوکمارک' },
			{ type: 'improvement', description: 'بهبود نمایش مسیر پوشه‌ها در بخش بوکمارک‌ها' },
		],
	},
	'1.0.0': {
		name: 'شروع',
		notes: [
			{ type: 'feature', description: 'انتشار نسخه اولیه ویجتی‌فای با امکانات پایه' },
		],
	},
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

	const sortNotesByType = (notes: (typeof releaseNotes)[string]['notes']) => {
		return [...notes].sort((a, b) => getTypePriority(a.type) - getTypePriority(b.type))
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="نسخه جدید ویجتی‌فای تو مرورگرته 🎉"
			size="md"
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<LazyMotion features={domAnimation}>
				<div className="p-2 max-h-[28rem] sm:max-h-80 overflow-y-auto">
					{Object.entries(releaseNotes).map(([version, versionData], idx) => (
						<m.div
							key={version}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: idx * 0.1 }}
							className={`mb-6 rounded-lg p-3 ${
								version === currentVersion ? ` border ${themeUtils.getBorderColor()}` : ''
							}`}
						>
							<div className="flex items-center mb-3">
								<div className="flex flex-col">
									<h3
										className={`text-base sm:text-lg font-bold ${
											version === currentVersion
												? themeUtils.getHeadingTextStyle()
												: themeUtils.getTextColor()
										}`}
									>
										نسخه {version}{' '}
										<span className="text-sm font-normal opacity-80">
											(‌{versionData.name})
										</span>
									</h3>
								</div>
								{version === currentVersion && (
									<m.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ delay: 0.2 }}
										className="flex items-center mr-2"
									>
										<RiCheckboxCircleFill className="text-blue-500" size={20} />
										<span className="mr-1 text-xs font-medium text-blue-500">
											نسخه فعلی
										</span>
									</m.div>
								)}
							</div>

							<ul className={`mr-2 ${themeUtils.getDescriptionTextStyle()}`}>
								{sortNotesByType(versionData.notes).map((note, noteIdx) => (
									<m.li
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
									</m.li>
								))}
							</ul>
						</m.div>
					))}
				</div>
			</LazyMotion>
			<div className={`p-1 border-t ${themeUtils.getBorderColor()} flex justify-end`}>
				<button
					onClick={onClose}
					className={`${themeUtils.getButtonStyles()} cursor-pointer hover:scale-105 transition-transform px-4 py-2 rounded-md`}
				>
					متوجه شدم
				</button>
			</div>
		</Modal>
	)
}

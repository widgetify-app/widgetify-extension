import { FaCalendarAlt, FaGlobeAsia } from 'react-icons/fa'
import { FaMoon } from 'react-icons/fa6'
import { type WidgetifyDate, convertShamsiToHijri } from '../../utils'

export const toolTipContent = (cellDate: WidgetifyDate, theme: string) => {
	const hijri = convertShamsiToHijri(cellDate)
	const gregorian = cellDate.clone().doAsGregorian().format('YYYY MMMM DD')
	const jalali = cellDate.format('jYYYY/jMM/jD ddd')

	const headerStyle =
		'max-w-full p-1 text-center text-white bg-gradient-to-r from-blue-500 to-indigo-600'

	const adBackgroundStyle =
		theme === 'light'
			? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50'
			: theme === 'dark'
				? 'bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-violet-900/20'
				: 'bg-black/20 backdrop-blur-sm'

	const brandStyle = theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
	const infoStyle = theme === 'light' ? 'text-gray-600' : 'text-gray-400'

	return (
		<div className="flex flex-col min-w-[200px] rounded-md overflow-hidden">
			<div className={headerStyle}>
				<div className="flex items-center justify-center gap-2">
					<FaCalendarAlt className="text-white/80" />
					<span className="text-sm font-bold truncate">{jalali}</span>
				</div>
			</div>

			<div className="p-3 space-y-2.5">
				<div className="flex items-center gap-2">
					<FaMoon className="flex-shrink-0 text-amber-500" />
					<span className="text-sm font-medium rtl">
						{hijri.format('iD iMMMM iYYYY')}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<FaGlobeAsia className="flex-shrink-0 text-blue-500" />
					<span className={`text-sm ${infoStyle}`}>{gregorian}</span>
				</div>
			</div>

			<div className="mt-2 border-t border-gray-200 dark:border-gray-700">
				<div
					className={`px-3 py-2.5 text-xs text-center rounded-b-md ${adBackgroundStyle}`}
				>
					<span className={`font-semibold ${brandStyle}`}>ویجتیفای</span>
					<span className="font-light"> | این فیچر با گزارش شما ایجاد شده است.</span>
				</div>
			</div>
		</div>
	)
}

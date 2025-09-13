import { IoMdMoon, IoMdStar, IoMdSunny } from 'react-icons/io'
import { MdOutlineBlurOn } from 'react-icons/md'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'

export function ThemeSelector() {
	const { setTheme, theme } = useTheme()
	const themes = [
		{
			id: 'glass',
			name: 'شیشه‌ای',
			icon: <MdOutlineBlurOn size={18} />,
			buttonClass: 'backdrop-blur-md text-white bg-black/40',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'glass-white',
			name: 'یخی (بتا)',
			icon: <MdOutlineBlurOn size={18} />,
			buttonClass:
				'backdrop-blur-md text-gray-800 bg-white/50 border border-white/20',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'light',
			name: 'روشن',
			icon: <IoMdSunny size={18} />,
			buttonClass: 'bg-gray-100 text-gray-800 border border-gray-200',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'dark',
			name: 'تیره',
			icon: <IoMdMoon size={18} />,
			buttonClass: 'text-white',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'zarna',
			name: 'زرنا',
			icon: <IoMdStar size={18} />,
			buttonClass: 'text-content',
			activeClass: 'ring-2 ring-blue-500',
		},
	]

	return (
		<SectionPanel title="انتخاب تم" delay={0.2}>
			<div className="flex flex-col gap-4">
				<p className="text-muted">تم ظاهری ویجتی‌فای را انتخاب کنید.</p>

				<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
					{themes.map((item) => (
						<div
							data-theme={item.id}
							key={item.id}
							onClick={() => setTheme(item.id)}
							className={`
                relative flex flex-col p-2 rounded-lg transition-all cursor-pointer duration-300 shadow-md hover:shadow-lg bg-base-100  justify-center
                ${item.buttonClass}
                ${theme === item.id ? item.activeClass : 'hover:ring-2 hover:ring-blue-300'}
              `}
						>
							<div className="flex items-center gap-2">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-black/10">
									{item.icon}
								</span>
								<span className="text-xs font-medium">{item.name}</span>
								{theme === item.id && (
									<div className="absolute w-2 h-2 bg-blue-500 rounded-full top-2 right-2" />
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}

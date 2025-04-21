import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
import { MdOutlineBlurOn } from 'react-icons/md'

export function ThemeSelector() {
	const { setTheme, theme, themeUtils } = useTheme()

	const themes = [
		{
			id: 'glass',
			name: 'شیشه‌ای',
			icon: <MdOutlineBlurOn size={24} />,
			buttonClass: 'bg-black/40 backdrop-blur-md text-white',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'light',
			name: 'روشن',
			icon: <IoMdSunny size={24} />,
			buttonClass: 'bg-gray-100 text-gray-800 border border-gray-200',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'dark',
			name: 'تیره',
			icon: <IoMdMoon size={24} />,
			buttonClass: 'bg-neutral-800 text-white',
			activeClass: 'ring-2 ring-blue-500',
		},
	]

	return (
		<SectionPanel title="انتخاب تم" delay={0.2}>
			<div className="flex flex-col gap-4">
				<p className={themeUtils.getDescriptionTextStyle()}>
					تم ظاهری ویجتی‌فای را انتخاب کنید.
				</p>

				<div className="flex justify-start gap-4">
					{themes.map((item) => (
						<button
							key={item.id}
							onClick={() => setTheme(item.id)}
							className={`
                relative p-3 rounded-full transition-all cursor-pointer duration-300 shadow-lg hover:scale-110 active:scale-90
                ${item.buttonClass}
                ${theme === item.id ? item.activeClass : ''}
              `}
							title={item.name}
						>
							{item.icon}
							{theme === item.id && (
								<div className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1 -right-1" />
							)}
						</button>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}

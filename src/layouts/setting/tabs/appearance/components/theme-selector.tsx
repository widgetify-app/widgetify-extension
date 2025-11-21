import type React from 'react'
import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { IoMdMoon, IoMdStar, IoMdSunny } from 'react-icons/io'
import { MdOutlineBlurOn } from 'react-icons/md'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import Tooltip from '@/components/toolTip'
import { useTheme } from '@/context/theme.context'
import type {
	UserInventoryItem,
	UserInventoryResponse,
} from '@/services/hooks/market/market.interface'

interface ThemeItem {
	id: string
	name: string
	icon: React.ReactElement
	description?: string
}

const defaultThemes: ThemeItem[] = [
	{
		id: 'glass',
		name: 'شیشه‌ای',
		icon: <MdOutlineBlurOn size={14} />,
		description: 'تم شفاف با افکت شیشه‌ای',
	},
	{
		id: 'icy',
		name: 'یخی',
		icon: <MdOutlineBlurOn size={14} />,
		description: 'تم سفید شفاف با حالت یخی',
	},
	{
		id: 'light',
		name: 'روشن',
		icon: <IoMdSunny size={14} />,
		description: 'تم کلاسیک روشن',
	},
	{
		id: 'dark',
		name: 'تیره',
		icon: <IoMdMoon size={14} />,
		description: 'تم کلاسیک تیره',
	},
	{
		id: 'zarna',
		name: 'زرنا',
		icon: <IoMdStar size={14} />,
		description: 'تم زرنا با رنگ‌های گرم',
	},
]

interface Props {
	fetched_themes: UserInventoryItem[]
}

export function ThemeSelector({ fetched_themes }: Props) {
	const { setTheme, theme } = useTheme()
	const themes = [
		{
			id: 'glass',
			name: 'شیشه‌ای تیره',
			icon: <MdOutlineBlurOn size={18} />,
			buttonClass: 'backdrop-blur-md text-white bg-black/40',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'lightglass',
			name: 'شیشه‌ای روشن',
			icon: <MdOutlineBlurOn size={18} />,
			buttonClass: 'backdrop-blur-md text-gray-800 bg-white/55',
			activeClass: 'ring-2 ring-blue-500',
		},
		{
			id: 'icy',
			name: 'یخی (آزمایشی)',
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
		<SectionPanel title="انتخاب تم" delay={0.2} size="sm">
			<div className="space-y-3">
				<p className="text-sm text-muted">تم ظاهری ویجتی‌فای را انتخاب کنید.</p>

				<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
					{themes.map((item) => (
						<ItemSelector
							isActive={selected?.id === item.id}
							onClick={() => onClick(item)}
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
					<div
						className="flex items-center justify-center w-full h-20 text-xs border border-content border-muted gap-0.5 text-muted hover:!text-primary cursor-pointer hover:!border-primary transition-all duration-200 rounded-xl"
						onClick={() => handleMoreClick()}
					>
						<FiShoppingBag size={18} />
						<span>فروشگاه</span>
					</div>
				</div>
			</div>
		</SectionPanel>
	)
}

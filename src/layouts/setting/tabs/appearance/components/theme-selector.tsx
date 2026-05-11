import type React from 'react'
import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import { IoMdMoon, IoMdStar, IoMdSunny } from 'react-icons/io'
import { MdOutlineBlurOn } from 'react-icons/md'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'

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
	const [themes, setThemes] = useState<ThemeItem[]>(defaultThemes)
	const [selected, setSelected] = useState<ThemeItem | null>(null)

	function onClick(item: ThemeItem) {
		setTheme(item.id)
		setSelected(item)
		Analytics.event('theme_selected')
	}

	useEffect(() => {
		const currentTheme = themes.find((t) => t.id === theme)
		if (currentTheme) {
			setSelected(currentTheme)
		}
	}, [themes])

	useEffect(() => {
		if (fetched_themes.length) {
			const mapped: ThemeItem[] = fetched_themes.map((item) => ({
				id: item.value,
				name: item.name ?? 'بدون نام',
				icon: <IoMdStar size={14} />,
				description: item?.description || 'تم خریداری شده',
			}))
			setThemes([...defaultThemes, ...mapped])
		}
	}, [fetched_themes])

	const handleMoreClick = () => {
		Analytics.event('theme_market_opened')
		callEvent('openMarketModal')
	}

	return (
		<SectionPanel title="انتخاب تم" delay={0.2} size="sm">
			<div className="space-y-3">
				<p className="text-sm text-muted">تم ظاهری ویجتیفای را انتخاب کنید.</p>

				<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
					{themes.map((item) => (
						<ItemSelector
							isActive={selected?.id === item.id}
							key={item.id}
							label={item.name}
							onClick={() => onClick(item)}
						/>
					))}
					<div
						className="flex items-center justify-center w-full h-10 text-xs border border-content border-muted gap-0.5 text-muted hover:!text-primary cursor-pointer hover:!border-primary transition-all duration-200 rounded-xl"
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

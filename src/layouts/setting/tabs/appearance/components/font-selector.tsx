import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { SectionPanel } from '@/components/section-panel'
import { FontFamily, useAppearanceSetting } from '@/context/appearance.context'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'

interface FontItem {
	value: FontFamily
	label: string
	description?: string
}

const defaultFonts: FontItem[] = [
	{
		value: FontFamily.Vazir,
		label: 'وزیر',
		description: 'وقتی بچه بودم می‌خواستم بزرگ بشم!',
	},
	{
		value: FontFamily.Samim,
		label: 'صمیم',
		description: 'وقتی بچه بودم می‌خواستم بزرگ بشم!',
	},
	{
		value: FontFamily.Pofak,
		label: 'پفـک',
		description: 'وقتی بچه بودم می‌خواستم بزرگ بشم!',
	},
	{
		value: FontFamily.rooyin,
		label: 'رویین',
		description: 'وقتی بچه بودم می‌خواستم بزرگ بشم!',
	},
]

interface FontSelectorProps {
	fetched_fonts: UserInventoryItem[]
}

export function FontSelector({ fetched_fonts }: FontSelectorProps) {
	const { fontFamily, setFontFamily } = useAppearanceSetting()

	const [fonts, setFonts] = useState<FontItem[]>(defaultFonts)

	useEffect(() => {
		if (fetched_fonts.length) {
			const mapped: FontItem[] = fetched_fonts.map((item) => ({
				value: item.value as FontFamily,
				label: item.name ?? 'بدون نام',
				description: item?.description || 'فونت خریداری شده',
			}))
			setFonts([...defaultFonts, ...mapped])
		}
	}, [fetched_fonts])

	const handleMoreClick = () => {
		Analytics.event('font_market_opened')
		callEvent('openMarketModal')
	}

	const renderFontPreview = ({ value }: FontItem) => (
		<span className="text-lg truncate" style={{ fontFamily: value }}>
			دریایچه‌ای از آرامش
		</span>
	)

	return (
		<SectionPanel title="فونت افزونه" delay={0.15} size="sm">
			<div className="space-y-3">
				<p className={'text-sm text-muted'}>
					فونت مورد نظر خود را برای نمایش در تمامی بخش‌های افزونه انتخاب کنید:
				</p>
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
					{fonts.map((font) => (
						<ItemSelector
							isActive={fontFamily === font.value}
							onClick={() => setFontFamily(font.value)}
							key={font.value}
							className="w-full !h-20 !max-h-20 !min-h-20"
							label={font.label}
							description={renderFontPreview(font)}
							style={{ fontFamily: font.value }}
						/>
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

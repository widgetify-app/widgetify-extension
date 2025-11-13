import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getFromStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import { SectionPanel } from '@/components/section-panel'
import type { UserInventoryResponse } from '@/services/hooks/market/market.interface'

interface BrowserTitle {
	name: string
	template: string
}
const defaultBrowserTitles: BrowserTitle[] = [
	{
		name: 'پیشفرض',
		template: '💫 New Tab',
	},
]

interface Prop {
	fetched_browserTitles: UserInventoryResponse['browser_titles']
}
export function BrowserTitleSelector({ fetched_browserTitles }: Prop) {
	const [browserTitles, setBrowserTitles] =
		useState<BrowserTitle[]>(defaultBrowserTitles)
	const [selected, setSelected] = useState<BrowserTitle | null>(null)

	function onClick(item: BrowserTitle) {
		document.title = item.template
		setSelected(item)
		Analytics.event('browser_title_selected')
	}

	useEffect(() => {
		async function init() {
			const title = await getFromStorage('browserTitle')
			setSelected({
				name: '',
				template: title || defaultBrowserTitles[0].template,
			})
		}

		init()
	}, [])

	useEffect(() => {
		if (fetched_browserTitles.length) {
			const mapped = fetched_browserTitles.map((item) => ({
				name: item.name,
				template: item.meta.template,
			}))
			setBrowserTitles([...defaultBrowserTitles, ...mapped])
		}
	}, [fetched_browserTitles])

	const handleMoreClick = () => {
		Analytics.event('browser_title_market_opened')
		callEvent('openMarketModal')
	}

	return (
		<SectionPanel title="عنوان مرورگر" size="sm">
			<div className="space-y-3">
				<p className={'text-sm text-muted'}>
					عنوان تب مرورگر خود را همین‌جا تغییر دهید تا هر وقت روی تب بودید،
					راحت‌تر پیدایش کنید.
				</p>
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
					{browserTitles?.map((item) => (
						<ItemSelector
							isActive={selected?.template === item.template}
							onClick={() => onClick(item)}
							key={item.template}
							className="w-full h-20"
							label={item.name}
							description={renderBrowserTitlePreview(item)}
						/>
					))}
					<div
						className="flex items-center justify-center w-full h-20 text-xs border border-content border-muted gap-0.5  text-muted hover:!text-primary cursor-pointer hover:!border-primary transition-all duration-200  rounded-xl"
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

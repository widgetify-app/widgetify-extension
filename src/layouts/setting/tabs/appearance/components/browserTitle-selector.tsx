import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { FiShoppingBag } from 'react-icons/fi'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector } from '@/components/item-selector'
import { renderBrowserTitlePreview } from '@/components/market/title/title-render-preview'
import { SectionPanel } from '@/components/section-panel'
import { safeAwait } from '@/services/api'
import { useChangeBrowserTitle } from '@/services/hooks/extension/updateSetting.hook'
import type { UserInventoryItem } from '@/services/hooks/market/market.interface'
import { translateError } from '@/utils/translate-error'
import { showToast } from '@/common/toast'

interface BrowserTitle {
	id: string
	name: string
	template: string
}
const defaultBrowserTitles: BrowserTitle[] = [
	{
		id: 'default',
		name: 'پیشفرض',
		template: '✨ New Tab',
	},
]

interface Prop {
	fetched_browserTitles: UserInventoryItem[]
	isAuthenticated: boolean
}
export function BrowserTitleSelector({ fetched_browserTitles, isAuthenticated }: Prop) {
	const [browserTitles, setBrowserTitles] =
		useState<BrowserTitle[]>(defaultBrowserTitles)
	const [selected, setSelected] = useState<BrowserTitle | null>(null)

	const { mutateAsync } = useChangeBrowserTitle()

	async function onClick(item: BrowserTitle) {
		setSelected(item)
		Analytics.event('browser_title_selected')

		if (isAuthenticated) {
			const [error] = await safeAwait<AxiosError, any>(
				mutateAsync({ browserTitleId: item.id })
			)
			if (error) {
				showToast(translateError(error) as string, 'error')
				return
			}
			setToStorage('browserTitle', item)
		} else {
			await setToStorage('browserTitle', item)
		}

		document.title = item.template
	}

	useEffect(() => {
		async function init() {
			const title = await getFromStorage('browserTitle')
			if (!title) return setSelected(defaultBrowserTitles[0])
			setSelected(title)
		}

		init()
	}, [])

	useEffect(() => {
		const updateAndCheck = async () => {
			const mapped: BrowserTitle[] = fetched_browserTitles.map((item) => ({
				name: item.name || 'بدون نام',
				id: item.id,
				template: item.value,
			}))
			const updated = [...defaultBrowserTitles, ...mapped]
			setBrowserTitles(updated)

			const value = await getFromStorage('browserTitle')

			const selectedBrowserTitle = updated.find((item) => item.id === value?.id)
			if (selectedBrowserTitle) {
				setSelected(selectedBrowserTitle)
			}
		}
		if (fetched_browserTitles?.length) {
			updateAndCheck()
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

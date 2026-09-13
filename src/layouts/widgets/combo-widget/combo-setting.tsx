import { useEffect, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { TabNavigation } from '@/components/ui'
import { Icon } from '@/icons'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import { RssFeedSetting } from '../news/rss-feed-setting'
import { WigiArzSetting } from '../wigi-arz/wigi-arz-setting'

type ComboSettingTab = 'currency' | 'news'

interface ComboSettingProps {
	instanceId?: string
	size?: { w: number; h: number }
}

export function ComboSetting({ instanceId, size }: ComboSettingProps) {
	const [activeTab, setActiveTab] = useState<ComboSettingTab>('currency')

	useEffect(() => {
		async function load() {
			const savedTab = await getFromStorage('comboTabs')
			if (savedTab === 'news' || savedTab === 'currency') {
				setActiveTab(savedTab)
			}
		}

		load()
	}, [])

	const handleTabChange = (tab: ComboSettingTab) => {
		setActiveTab(tab)
		setToStorage('comboTabs', tab)
	}

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-4">
				<TabNavigation<ComboSettingTab>
					tabMode="simple"
					activeTab={activeTab}
					onTabClick={handleTabChange}
					tabs={[
						{
							id: 'currency',
							label: 'تنظیمات ارزها',
							icon: <Icon name="currency" size={14} />,
						},
						{
							id: 'news',
							label: 'تنظیمات اخبار',
							icon: <Icon name="outlineNewspaper" size={14} />,
						},
					]}
					size="medium"
					className="w-full"
				/>

				<div>
					{activeTab === 'currency' ? (
						<WigiArzSetting instanceId={instanceId} size={size} />
					) : (
						<RssFeedSetting />
					)}
				</div>
			</div>
		</WidgetSettingWrapper>
	)
}

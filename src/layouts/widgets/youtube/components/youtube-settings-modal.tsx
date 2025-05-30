import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { Button } from '@/components/button/button'
import { ItemSelector } from '@/components/item-selector'
import Modal from '@/components/modal'
import { SectionPanel } from '@/components/section-panel'
import { TextInput } from '@/components/text-input'
import { useEffect, useState } from 'react'

interface YouTubeSettingsModalProps {
	isOpen: boolean
	onClose: (data: YouTubeSettings | null) => void
}

export interface YouTubeSettings {
	username: string | null
	subscriptionStyle: 'short' | 'long'
}

export function YouTubeSettingsModal({ isOpen, onClose }: YouTubeSettingsModalProps) {
	if (!isOpen) return null
	const [settings, setSettings] = useState<YouTubeSettings>({
		username: '',
		subscriptionStyle: 'short',
	})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		loadSettings()
	}, [])

	const loadSettings = async () => {
		const storedSettings = await getFromStorage('youtubeSettings')
		if (storedSettings) {
			setSettings(storedSettings)
		}
	}

	const handleSave = async () => {
		setLoading(true)
		try {
			await setToStorage('youtubeSettings', settings)
			onClose(settings)
		} finally {
			setLoading(false)
		}
	}
	const handleUsernameChange = (value: string) => {
		setSettings({ ...settings, username: value || null })
	}

	const handleSubscriptionStyleChange = (style: 'short' | 'long') => {
		setSettings({ ...settings, subscriptionStyle: style })
		Analytics.event(`youtube_subscription_style_to_${style}`)
	}

	const subscriptionStyleOptions = [
		{
			value: 'short' as const,
			label: 'کوتاه',
			description: '1.2M - نمایش کوتاه تعداد مشترکین',
		},
		{
			value: 'long' as const,
			label: 'بلند',
			description: '1,234,567 - نمایش کامل تعداد مشترکین',
		},
	]

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose(null)}
			title="⚙️ تنظیمات یوتیوب"
			size="sm"
			direction="rtl"
		>
			<div className="p-0.5 space-y-1">
				<SectionPanel title="	نام کاربری یوتیوب" size="xs">
					<TextInput
						type="text"
						value={settings.username || ''}
						onChange={(value) => handleUsernameChange(value)}
						placeholder="@username یا username"
						className={'w-full px-3 py-2 border rounded-md'}
					/>
					<p className={'text-xs mt-1 text-content opacity-70'}>
						نام کاربری کانال یوتیوب خود را وارد کنید (با یا بدون @)
					</p>
				</SectionPanel>
				<SectionPanel title="تعداد مشترکین" size="xs">
					<p className={'text-sm mb-3 text-muted'}>
						نحوه نمایش تعداد مشترکین را انتخاب کنید:
					</p>
					<div className="flex flex-wrap gap-2">
						{subscriptionStyleOptions.map((option) => (
							<ItemSelector
								isActive={settings.subscriptionStyle === option.value}
								key={option.value}
								label={option.label}
								description={option.description}
								onClick={() => handleSubscriptionStyleChange(option.value)}
								defaultActive="short"
								className="!w-full"
							/>
						))}
					</div>
				</SectionPanel>
				<div className="flex justify-end gap-2 pt-4 space-x-2 space-x-reverse">
					<Button onClick={() => onClose(null)} size="md">
						لغو
					</Button>
					<Button
						type="submit"
						disabled={loading}
						size="md"
						isPrimary={true}
						onClick={() => handleSave()}
					>
						{loading ? 'در حال ذخیره...' : 'ذخیره'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

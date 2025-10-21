import { FiMonitor } from 'react-icons/fi'
import { getFromStorage, setToStorage } from '@/common/storage'
import { ToggleSwitch } from '@/components/toggle-switch.component'

const NEEDS_PERMISSION: globalThis.Browser.runtime.ManifestPermissions[] = [
	'tabs',
	'sidePanel',
	'tabGroups',
]

export interface VerticalTabsSettings {
	enabled: boolean
}
const checkPermissions = async () => {
	try {
		const granted = await browser.permissions.contains({
			permissions: NEEDS_PERMISSION,
		})
		return granted
	} catch (error) {
		console.error('Error checking permission:', error)
		return false
	}
}

export function VerticalTabsSettings() {
	const [settings, setSettings] = useState<VerticalTabsSettings>({
		enabled: false,
	})

	useEffect(() => {
		loadSettings()
	}, [])

	const loadSettings = async () => {
		try {
			const savedSettings = await getFromStorage('verticalTabsSettings')
			if (savedSettings) {
				setSettings(savedSettings as VerticalTabsSettings)
			}
		} catch {}
	}

	const updateSettings = async (newSettings: Partial<VerticalTabsSettings>) => {
		const updatedSettings = { ...settings, ...newSettings }
		setSettings(updatedSettings)
		await setToStorage('verticalTabsSettings', updatedSettings)
		browser.runtime.sendMessage({
			type: 'VERTICAL_TABS_SETTINGS_UPDATED',
			payload: updatedSettings,
		})
	}

	const handleToggle = async (enabled: boolean) => {
		if (enabled) {
			const granted = await checkPermissions()

			if (!granted) {
				try {
					const result = await browser.permissions.request({
						permissions: NEEDS_PERMISSION,
					})

					if (result) {
						await updateSettings({ enabled: true })
						try {
							if (browser.sidePanel) {
								const currentWindow = await browser.windows.getCurrent()
								if (currentWindow.id) {
									await browser.sidePanel.open({
										windowId: currentWindow.id,
									})
								}
							}
						} catch {}
					}
				} catch {}
			} else {
				await updateSettings({ enabled: true })
				try {
					if (browser.sidePanel) {
						const currentWindow = await browser.windows.getCurrent()
						if (currentWindow.id) {
							await browser.sidePanel.open({
								windowId: currentWindow.id,
							})
						}
					}
				} catch (error) {
					console.error('Error opening side panel:', error)
				}
			}
		} else {
			await updateSettings({ enabled: false })
			await browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: false })
		}
	}

	return (
		<div className="p-6 mb-4 border border-content backdrop-blur-sm rounded-xl">
			<div className="flex items-start gap-4">
				<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl">
					<FiMonitor className="text-2xl text-blue-400" />
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-lg font-semibold text-content">
							تب‌های عمودی
						</h3>
						<ToggleSwitch
							enabled={settings.enabled}
							onToggle={() => handleToggle(!settings.enabled)}
						/>
					</div>
					<p className="mb-3 text-sm text-muted">
						مشاهده و مدیریت تب‌های باز در یک پنل کناری. این قابلیت به شما امکان
						می‌دهد تب‌های خود را به راحتی جابجا کرده، ببندید یا گروه‌بندی کنید.
					</p>

					{settings.enabled && (
						<div className="p-3 border rounded-lg bg-primary/20 border-primary/30">
							<p className="text-xs text-primary">
								✓ قابلیت فعال است. برای استفاده، دکمه سایدپنل را در نوار
								ابزار مرورگر کلیک کنید.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

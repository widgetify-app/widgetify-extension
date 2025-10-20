import { FiMonitor } from 'react-icons/fi'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useVerticalTabs } from '@/entrypoints/sidepanel/context/vertical-tabs.context'

const NEEDS_PERMISSION: globalThis.Browser.runtime.ManifestPermissions[] = [
	'tabs',
	'sidePanel',
	'tabGroups',
]
export function VerticalTabsSettings() {
	const { settings, updateSettings } = useVerticalTabs()

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

	const handleToggle = async (enabled: boolean) => {
		if (enabled) {
			// Check if permissions are already granted
			const granted = await checkPermissions()

			if (!granted) {
				// Request permissions
				try {
					const result = await browser.permissions.request({
						permissions: NEEDS_PERMISSION,
					})

					if (result) {
						await updateSettings({ enabled: true })
						// Open side panel
						try {
							if (browser.sidePanel) {
								await browser.sidePanel.open({
									windowId: browser.windows.WINDOW_ID_CURRENT,
								})
							}
						} catch (error) {
							console.error('Error opening side panel:', error)
						}
					}
				} catch (error) {
					console.error('Error requesting permissions:', error)
				}
			} else {
				await updateSettings({ enabled: true })
				// Open side panel
				try {
					if (browser.sidePanel) {
						await browser.sidePanel.open({
							windowId: browser.windows.WINDOW_ID_CURRENT,
						})
					}
				} catch (error) {
					console.error('Error opening side panel:', error)
				}
			}
		} else {
			await updateSettings({ enabled: false })
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

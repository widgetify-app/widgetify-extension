import { useEffect, useState } from 'react'
import { FiInfo, FiShield } from 'react-icons/fi'
import { GoTable } from 'react-icons/go'
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

export function VerticalTabsTab() {
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
			await browser.sidePanel.setPanelBehavior({
				openPanelOnActionClick: false,
			})
		}
	}

	return (
		<div className="w-full max-w-xl mx-auto border border-content rounded-xl">
			<div className="p-2">
				<div className="flex items-start gap-4">
					<div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-xl">
						<GoTable className="text-2xl text-blue-400" />
					</div>
					<div className="flex-1">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-lg font-semibold text-content">
								پنل کناری تب‌ها
							</h3>
							<ToggleSwitch
								enabled={settings.enabled}
								onToggle={() => handleToggle(!settings.enabled)}
							/>
						</div>
						<p className="mb-4 text-sm leading-relaxed text-muted">
							پنل کناریِ زیبا و کاربردی برای مدیریت تب‌ها: جابه‌جایی، بستن،
							گروه‌بندی و ذخیرهٔ سایت‌های محبوب. رابط سبک و سریع است و به‌ویژه
							روی مانیتورهای بزرگ تجربهٔ کاربری بهتری ارائه می‌دهد.
						</p>

						<div className="p-4 mb-4 border rounded-lg bg-green-500/5 border-green-500/20">
							<div className="flex items-start gap-3">
								<FiShield className="mt-0.5 text-lg text-green-400 flex-shrink-0" />
								<div>
									<h4 className="mb-1 text-sm font-semibold text-success">
										حریم خصوصی شما محفوظ است
									</h4>
									<p className="text-xs leading-relaxed text-muted">
										این قابلیت هیچ‌گونه اطلاعاتی از تب‌های شما را ذخیره،
										ارسال یا به اشتراک نمی‌گذارد. تمام داده‌ها به صورت
										محلی در مرورگر شما نگهداری می‌شوند و فقط برای نمایش
										و مدیریت تب‌ها استفاده می‌شوند. هیچ اطلاعاتی به سرور
										ارسال نمی‌شود.
									</p>
								</div>
							</div>
						</div>

						{settings.enabled && (
							<div className="space-y-3">
								<div className="p-4 border rounded-lg bg-primary/10 border-primary/30">
									<div className="flex items-start gap-3">
										<FiInfo className="mt-0.5 text-lg text-primary flex-shrink-0" />
										<div>
											<h4 className="mb-2 text-sm font-semibold text-primary">
												نحوه استفاده
											</h4>
											<ol className="mr-4 space-y-2 text-xs leading-relaxed list-decimal text-muted">
												<li>
													روی{' '}
													<strong className="text-content">
														آیکون افزونه ویجتیفای
													</strong>{' '}
													در نوار ابزار مرورگر کلیک کنید
												</li>
												<li>
													پنل مدیریت تب‌ها در سمت راست صفحه باز
													خواهد شد
												</li>
												<li>
													تب‌های باز خود را مشاهده کنید، بین آن‌ها
													جابجا شوید یا آن‌ها را ببندید
												</li>
												<li>
													سایت‌های مورد علاقه خود را برای دسترسی
													سریع‌تر اضافه کنید
												</li>
												<li>
													از قابلیت جستجو برای پیدا کردن سریع‌تر
													تب‌ها استفاده کنید
												</li>
											</ol>
										</div>
									</div>
								</div>

								<div className="p-3 text-center border rounded-lg bg-orange-500/5 border-orange-500/20">
									<p className="text-xs text-orange-400">
										💡 نکته: برای بستن پنل، دوباره روی آیکون افزونه
										کلیک کنید یا دکمه × را در پنل بزنید
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

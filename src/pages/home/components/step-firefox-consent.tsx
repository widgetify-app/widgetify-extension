import { useState } from 'react'
import { Button, ItemSelector } from '@/components/ui'
import { Icon } from '@/icons'
import { getFromStorage, setToStorage } from '@/common/storage'

interface StepFirefoxConsentProps {
	onGetStarted: () => void
}

export const StepFirefoxConsent = ({ onGetStarted }: StepFirefoxConsentProps) => {
	const [allowIcon, setAllowIcon] = useState(true)
	const [allowAnalytics, setAllowAnalytics] = useState(true)

	const handleDecline = () => {
		if (browser.management?.uninstallSelf) {
			// @ts-expect-error browser.management type definition in firefox
			browser.management.uninstallSelf({
				showConfirmDialog: true,
				dialogMessage:
					'برای کارکرد کامل افزونه به این دسترسی‌ها نیاز داریم، می‌خوای افزونه رو حذف کنی؟',
			})
		}
	}

	const handleConfirm = async () => {
		const current = (await getFromStorage('generalSettings')) || {}
		await setToStorage('generalSettings', {
			...current,
			analyticsEnabled: allowAnalytics,
		})
		localStorage.setItem('wxt_local:allowFaviconService', String(allowIcon))

		onGetStarted()
	}

	return (
		<div className="flex flex-col gap-3 text-right">
			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-bold text-content">حریم خصوصی</h3>
					<span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-raised text-muted">
						Privacy Notice
					</span>
				</div>
				<p className="text-xs text-muted leading-relaxed">
					تمام تنظیمات در مرورگر خودت ذخیره می‌شن، انتخاب کن کدوم موارد فعال باشن
				</p>
			</div>

			<div className="space-y-2">
				<ItemSelector
					isActive={allowIcon}
					onClick={() => setAllowIcon(!allowIcon)}
					label="دریافت آیکون سایت‌ها (Google Favicon)"
					description="ارسال دامنه سایت به سرویس رسمی گوگل برای نمایش آیکون بوکمارک‌ها"
				/>

				<ItemSelector
					isActive={allowAnalytics}
					onClick={() => setAllowAnalytics(!allowAnalytics)}
					label="ارسال آمار فنی و کارایی (Google Analytics)"
					description="ارسال داده‌های کاملا ناشناس و بدون اطلاعات هویتی برای رفع باگ‌ها"
				/>
			</div>

			<div className="flex items-center justify-between text-[11px] text-muted pt-1">
				<span>می‌تونی بعداً توی تنظیمات این موارد رو تغییر بدی</span>
				<a
					href="https://widgetify.ir/privacy"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-primary hover:underline"
				>
					<Icon name="externalLink" className="w-3 h-3" />
					سیاست حریم خصوصی
				</a>
			</div>

			<div className="flex items-center gap-2 pt-2 border-t border-subtle">
				<Button
					onClick={handleDecline}
					size="md"
					variant="ghost"
					color="danger"
					rounded="2xl"
					className="flex-1 text-xs"
				>
					حذف افزونه
				</Button>
				<Button
					onClick={handleConfirm}
					size="md"
					color="primary"
					rounded="2xl"
					className="flex-1 text-xs"
				>
					تایید و ادامه
				</Button>
			</div>
		</div>
	)
}

import { autoFormatErrorToast, showToast } from '@/common/toast'
import { ToggleSwitch } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/hooks/extension/update-setting.hook'

export function SearchAutocompleteSwitch() {
	const { isAuthenticated, user } = useAuth()
	const { mutateAsync, isPending } = useUpdateSearchAutocomplete()

	const onToggle = async () => {
		if (!isAuthenticated) {
			showToast('نیازمند ورود به حساب کاربری', 'error')
			return
		}

		const [er] = await safeAwait(
			mutateAsync({ isActive: !user?.searchAutocompleteEnabled })
		)
		if (er) {
			autoFormatErrorToast(er)
		}
	}

	return (
		<div className="flex items-start justify-between gap-4 p-3.5 transition-colors rounded-xl hover:bg-subtle">
			<div className="flex-1 space-y-1">
				<h3 className="text-sm font-medium text-content">پیشنهادهای جستجو</h3>
				<p className="text-xs font-normal leading-relaxed text-muted">
					هنگام تایپ در نوار جستجو، پیشنهادها مستقیما از گوگل دریافت و تاریخچه
					در دستگاه خودت ذخیره می‌شه و به سرور افزونه ارسال نمی‌شن
				</p>
			</div>
			<div className="shrink-0 pt-0.5">
				<ToggleSwitch
					enabled={user?.searchAutocompleteEnabled || false}
					onToggle={onToggle}
					disabled={isPending}
					loading={isPending}
				/>
			</div>
		</div>
	)
}

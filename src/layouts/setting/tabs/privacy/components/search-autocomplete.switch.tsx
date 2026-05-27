import { autoFormatErrorToast } from '@/common/toast'
import { ToggleSwitch } from '@/components/toggle-switch.component'
import { useAuth } from '@/context/auth.context'
import { safeAwait } from '@/services/api'
import { useUpdateSearchAutocomplete } from '@/services/hooks/extension/updateSetting.hook'

export function SearchAutocompleteSwitch() {
	const { isAuthenticated, user } = useAuth()
	const { mutateAsync, isPending } = useUpdateSearchAutocomplete()

	const onToggle = async () => {
		const [er, _] = await safeAwait(
			mutateAsync({ isActive: !user?.searchAutocompleteEnabled })
		)
		if (er) {
			autoFormatErrorToast(er)
		}
	}

	return (
		<div className="flex items-center justify-between">
			<div className="flex-1 space-y-2">
				<h3 className="font-medium text-content">پیشنهادهای جستجو</h3>
				<p className="text-sm font-light leading-relaxed text-muted">
					با فعال کردن این گزینه، هنگام تایپ در باکس جستجو، پیشنهادها مستقیما از
					گوگل دریافت می‌شوند. هیچ اطلاعاتی ذخیره نمی‌شود.
				</p>
			</div>
			<div className="flex-shrink-0 ml-4">
				<ToggleSwitch
					enabled={user?.searchAutocompleteEnabled || false}
					onToggle={onToggle}
					disabled={!isAuthenticated || isPending}
					loading={isPending}
				/>
			</div>
		</div>
	)
}

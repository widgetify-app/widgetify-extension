import { callEvent } from '@/common/utils/call-event'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface HabitEmptyProps {
	onAdd: () => void
}

export function HabitEmpty({ onAdd }: HabitEmptyProps) {
	return (
		<WidgetEmpty
			art="habits"
			title="یه عادت خوب شروع کن"
			description="مثلاً روزی ۸ لیوان چای، یا ۲۰ دقیقه مطالعه"
			action={{ label: 'عادت جدید', onClick: onAdd }}
		/>
	)
}

export function HabitSignedOut() {
	return (
		<WidgetEmpty
			art="user"
			title="عادت‌هات توی حسابته"
			description="برای دیدنشون وارد حسابت شو"
			action={{ label: 'ورود', onClick: () => callEvent('openProfile') }}
		/>
	)
}

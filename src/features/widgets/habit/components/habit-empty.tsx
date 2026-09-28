import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function HabitEmpty() {
	return (
		<WidgetEmpty
			art="illustration"
			title="عادت‌های خوب رو از اینجا شروع کن 🌱"
			description={
				<>
					اولین عادتت رو اضافه کن
					<br />
					مثلا:
					<br />💧 نوشیدن ۸ لیوان آب
					<br />📖 ۲۰ دقیقه مطالعه
					<br />🚶 ۳۰ دقیقه پیاده‌روی
				</>
			}
		/>
	)
}

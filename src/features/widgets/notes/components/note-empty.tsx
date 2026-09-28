import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function NoteEmpty() {
	return (
		<WidgetEmpty
			art="illustration"
			title="اینجا هنوز سفیده..."
			description={
				<>
					اولین یادداشتت رو بنویس.
					<br />
					مثلا:
					<br />💡 ایده‌ی پروژه
					<br />🛒 لیست خرید
					<br />
					یه جمله برای خودت واسه بعدا
				</>
			}
		/>
	)
}

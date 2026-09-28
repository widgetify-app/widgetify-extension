import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function TodosEmpty() {
	return (
		<WidgetEmpty
			art="illustration"
			title="اینجا فعلا خیلی آرومه..."
			description={
				<>
					هنوز هیچ تسکی نداری
					<br />
					وقتشه یه چیزی اضافه کنی، مثلا:
					<br />🛒 خرید خونه
					<br />☕ یه استراحت کوتاه
				</>
			}
		/>
	)
}

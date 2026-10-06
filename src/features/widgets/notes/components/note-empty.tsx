import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

interface NoteEmptyProps {
	onAdd: () => void
}

export function NoteEmpty({ onAdd }: NoteEmptyProps) {
	return (
		<WidgetEmpty
			art="notebook"
			title="هنوز یادداشتی نداری"
			description="ایده، لیست خرید یا یه جمله برای بعد؛ همین‌جا نگهش دار"
			action={{ label: 'یادداشت جدید', onClick: onAdd }}
		/>
	)
}

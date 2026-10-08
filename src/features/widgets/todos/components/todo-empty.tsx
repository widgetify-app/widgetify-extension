import { WidgetEmpty } from '@/features/widgets/components/widget-empty'

export function TodosEmpty({ onAdd }: { onAdd?: () => void }) {
	return (
		<WidgetEmpty
			art="tasks"
			title="هنوز تسکی نداری"
			description={
				onAdd
					? 'اولین کاری که باید انجام بدی رو بنویس'
					: 'اولین کاری که باید انجام بدی رو همین پایین بنویس'
			}
			action={onAdd ? { label: 'تسک جدید', onClick: onAdd } : undefined}
		/>
	)
}

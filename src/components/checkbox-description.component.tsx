import CustomCheckbox from '@/components/checkbox'

interface Props {
	isEnabled: boolean
	onToggle: () => void
	title: string
	description?: string
}

export function CheckBoxWithDescription({
	isEnabled,
	onToggle,
	title,
	description,
}: Props) {
	return (
		<div
			className={
				'group flex items-start gap-3 p-2 transition-all duration-200 cursor-pointer rounded'
			}
			onClick={onToggle}
		>
			<CustomCheckbox checked={isEnabled} onChange={onToggle} className='active:scale-95' />
			<div className="flex-1">
				<p className={'font-bold text-content'}>{title}</p>
				{description ? (
					<p className={'text-sm mt-1 font-light text-muted'}>{description}</p>
				) : null}
			</div>
		</div>
	)
}

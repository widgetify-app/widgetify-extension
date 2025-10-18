import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CurrencyColorMode } from '@/context/currency.context'
import { CurrencyBox } from './currency-box'

interface SortableCurrencyBoxProps {
	code: string
	currencyColorMode: CurrencyColorMode | null
	id: string
}

export function SortableCurrencyBox({
	code,
	currencyColorMode,
	id,
}: SortableCurrencyBoxProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id,
		})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`transition-transform duration-200 ${isDragging ? 'z-10 opacity-50' : ''}`}
		>
			<CurrencyBox
				code={code}
				currencyColorMode={currencyColorMode}
				dragHandle={{ ...attributes, ...listeners }}
			/>
		</div>
	)
}

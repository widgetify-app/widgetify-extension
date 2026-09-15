import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type React from 'react'
import Analytics from '@/analytics'
import type { CurrencyColorMode } from '@/context/currency.context'
import { SortableCurrencyBox } from './sortable-currency-box'

const DRAG_ACTIVATION_DISTANCE = 5

interface CurrencyListProps {
	currencies: string[]
	currencyColorMode: CurrencyColorMode | null
	onReorder: (currencies: string[]) => void
	className?: string
}

export const CurrencyList: React.FC<CurrencyListProps> = ({
	currencies,
	currencyColorMode,
	onReorder,
	className,
}) => {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE },
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		const activeIndex = currencies.indexOf(String(active.id))
		const overIndex = currencies.indexOf(String(over.id))
		if (activeIndex === -1 || overIndex === -1) return

		onReorder(arrayMove(currencies, activeIndex, overIndex))
		Analytics.event('currency_reorder')
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={currencies} strategy={verticalListSortingStrategy}>
				<ul className={className} aria-label="لیست ارزها">
					{currencies.map((currency) => (
						<li key={currency}>
							<SortableCurrencyBox
								id={currency}
								code={currency}
								currencyColorMode={currencyColorMode}
							/>
						</li>
					))}
				</ul>
			</SortableContext>
		</DndContext>
	)
}

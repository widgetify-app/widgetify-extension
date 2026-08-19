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
import Analytics from '@/analytics'
import { useCurrencyStore } from '@/context/currency.context'
import { SortableCurrencyBox } from '../components/sortable-currency-box'

interface CurrencyWideGridProps {
	currencies: string[]
}

export function CurrencyWideGrid({ currencies }: CurrencyWideGridProps) {
	const { currencyColorMode, reorderCurrencies } = useCurrencyStore()

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const activeIndex = currencies.indexOf(String(active.id))
		const overIndex = currencies.indexOf(String(over.id))

		if (activeIndex !== -1 && overIndex !== -1) {
			const reorderedCurrencies = arrayMove(currencies, activeIndex, overIndex)
			reorderCurrencies(reorderedCurrencies)
			Analytics.event('currency_reorder')
		}
	}

	return (
		<div className="h-full w-full p-1 overflow-y-auto scrollbar-none select-none">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 w-full">
					<SortableContext
						items={currencies}
						strategy={verticalListSortingStrategy}
					>
						{currencies.map((currency) => (
							<SortableCurrencyBox
								key={currency}
								id={currency}
								code={currency}
								currencyColorMode={currencyColorMode}
							/>
						))}
					</SortableContext>
				</div>
			</DndContext>
		</div>
	)
}

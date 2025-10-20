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
import { FiDollarSign } from 'react-icons/fi'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/button/button'
import { useCurrencyStore } from '@/context/currency.context'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetContainer } from '../widget-container'
import { ArzHeader } from './components/arz-header'
import { SortableCurrencyBox } from './components/sortable-currency-box'

interface WigiArzLayoutProps {
	enableBackground?: boolean
	inComboWidget: boolean
}

export function WigiArzLayout({
	enableBackground = true,
	inComboWidget,
}: WigiArzLayoutProps) {
	const { selectedCurrencies, currencyColorMode, reorderCurrencies } =
		useCurrencyStore()

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

		const activeIndex = selectedCurrencies.indexOf(String(active.id))
		const overIndex = selectedCurrencies.indexOf(String(over.id))

		if (activeIndex !== -1 && overIndex !== -1) {
			const reorderedCurrencies = arrayMove(
				selectedCurrencies,
				activeIndex,
				overIndex
			)
			reorderCurrencies(reorderedCurrencies)
			Analytics.event('currency_reorder')
		}
	}

	function onSettingClick() {
		callEvent('openWidgetsSettings', { tab: WidgetTabKeys.wigiArz })
	}

	return (
		<>
			{inComboWidget ? (
				<div className="flex items-center justify-between pb-2">
					{selectedCurrencies.length === 0 ? (
						<div
							className={
								'flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-16'
							}
						>
							<div
								className={
									'flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70'
								}
							>
								<FiDollarSign className="text-content" size={24} />
							</div>
							<p className="mt-1 text-center text-content">
								ارزهای مورد نظر خود را اضافه کنید
							</p>
							<Button
								rounded="full"
								size="sm"
								className="mt-1 border border-base-300/70 px-5 bg-base-300/70 hover:!bg-primary hover:text-white hover:border-primary"
								onClick={onSettingClick}
							>
								افزودن ارز
							</Button>
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<div
								className={`mt-2 flex flex-col w-full gap-1 overflow-x-hidden ${inComboWidget ? '' : 'overflow-y-auto'}`}
								style={{
									scrollbarWidth: 'none',
								}}
							>
								<SortableContext
									items={selectedCurrencies}
									strategy={verticalListSortingStrategy}
								>
									{selectedCurrencies.map((currency) => (
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
					)}
				</div>
			) : (
				<WidgetContainer
					background={enableBackground}
					className={'flex flex-col gap-1'}
				>
					<ArzHeader
						title="ویجی‌ ارز"
						onSettingsClick={() => onSettingClick()}
					/>

					{selectedCurrencies.length === 0 ? (
						<div
							className={
								'flex-1 flex flex-col items-center justify-center gap-y-1 px-5 py-12'
							}
						>
							<div
								className={
									'mt-1 flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300'
								}
							>
								<FiDollarSign className="text-content" size={24} />
							</div>
							<p className="text-center text-content">
								ارزهای مورد نظر خود را اضافه کنید.
							</p>
							<Button
								rounded="full"
								onClick={() => onSettingClick()}
								size="sm"
								className="border border-base-300/70 px-5 bg-base-300/70 hover:!bg-primary hover:text-white hover:border-primary"
							>
								افزودن ارز
							</Button>
						</div>
					) : (
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<div
								className={`flex flex-col gap-1 overflow-x-hidden ${inComboWidget ? '' : 'overflow-y-auto'}`}
								style={{
									scrollbarWidth: 'none',
								}}
							>
								<SortableContext
									items={selectedCurrencies}
									strategy={verticalListSortingStrategy}
								>
									{selectedCurrencies.map((currency) => (
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
					)}
				</WidgetContainer>
			)}
		</>
	)
}

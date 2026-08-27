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
import { callEvent } from '@/common/utils/call-event'
import { useCurrencyStore } from '@/context/currency.context'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { WidgetContainer } from '../widget-container'
import { SortableCurrencyBox } from './components/sortable-currency-box'
import { CurrencyCompactSquare } from './variants/currency-1x1'
import { CurrencyStackedVariant } from './variants/currency-2x2'
import { Button } from '@/components/ui'
import { Icon } from '@/src/icons'

import type { WidgetSize } from '../layout-engine/types'

interface WigiArzLayoutProps {
	enableBackground?: boolean
	inComboWidget?: boolean
	comboClassName?: string
	size?: WidgetSize
	instanceId?: string
	meta?: Record<string, any>
}

export function WigiArzLayout({
	enableBackground = true,
	inComboWidget = false,
	comboClassName,
	size = { w: 2, h: 3 },
	instanceId,
	meta,
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

	if (!inComboWidget) {
		if (size.w === 1 && size.h === 1) {
			return (
				<WidgetContainer
					background={enableBackground}
					padding={false}
					className="h-full"
				>
					<CurrencyCompactSquare
						defaultCode={
							meta?.currencyCode ||
							(!instanceId ? selectedCurrencies[0] || 'USD' : undefined)
						}
						instanceId={instanceId}
						meta={meta}
					/>
				</WidgetContainer>
			)
		}

		if ((size.w === 2 && size.h === 2) || meta?.variant === 'stacked') {
			return (
				<WidgetContainer
					background={enableBackground}
					padding={false}
					className="h-full"
				>
					<CurrencyStackedVariant instanceId={instanceId} meta={meta} />
				</WidgetContainer>
			)
		}
	}

	if (inComboWidget) {
		return (
			<div className={`flex items-center justify-between pb-2 mt-1`}>
				{selectedCurrencies.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-y-1.5 px-5 py-16">
						<div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-base-300/70 border-base/70">
							💲
						</div>
						<p className="mt-1 text-center text-content">
							ارزهای مورد نظر خود را اضافه کنید
						</p>
						<Button
							rounded="xl"
							size="sm"
							variant={'primary'}
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
							className={`flex flex-col w-full gap-1 overflow-x-hidden ${comboClassName}`}
							style={{ scrollbarWidth: 'none' }}
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
		)
	}

	return (
		<WidgetContainer
			background={enableBackground}
			className={'flex flex-col h-full w-full overflow-y-auto scrollbar-none'}
			style={{ scrollbarWidth: 'none' }}
		>
			<div className="top-0 z-20 flex items-center justify-between w-full pb-2 shrink-0">
				<div className="flex items-center gap-1.5">
					<span className="text-base leading-none">💰</span>
					<p className="text-base font-medium text-content">قیمت ارزها</p>
				</div>

				<Button
					onClick={onSettingClick}
					size="xs"
					className="h-6 w-6 p-0 flex items-center justify-center rounded-full !border-none !shadow-none hover:bg-base-300"
				>
					<Icon
						name="menuOption"
						size={12}
						className="text-content opacity-70 hover:opacity-100"
					/>
				</Button>
			</div>

			{selectedCurrencies.length === 0 ? (
				<div className="flex flex-col items-center justify-center flex-1 px-5 py-8 text-center gap-y-2">
					<div className="flex items-center justify-center w-12 h-12">
						<img
							src="https://cdn.widgetify.ir/system/no-items.png"
							alt="بدون عادت"
							className="object-contain w-48 h-auto select-none"
						/>
					</div>
					<div className="flex flex-col gap-0.5">
						<p className="text-xs font-bold text-content">
							هنوز ارزی اضافه نکردی
						</p>
						<p className="text-[11px] text-muted">
							برای مشاهده قیمت لحظه‌ای، ارزهای دلخواهت رو انتخاب کن
						</p>
					</div>
					<Button
						rounded="xl"
						size="sm"
						variant={'primary'}
						onClick={onSettingClick}
						className="mt-1"
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
					<div className="flex flex-col gap-1.5 overflow-y-auto overflow-x-hidden h-full scrollbar-none">
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
	)
}

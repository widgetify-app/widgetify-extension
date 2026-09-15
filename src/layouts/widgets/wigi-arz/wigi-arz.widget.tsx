import { useCurrencyStore } from '@/context/currency.context'
import { useOptionalFreeWidgets } from '@/context/free-widget/free-widget.context'
import type { WidgetSize } from '../layout-engine/types'
import { WidgetContainer } from '../widget-container'
import { CurrencyEmptyState } from './components/currency-empty-state'
import { CurrencyList } from './components/currency-list'
import type { WigiArzMeta } from './types'
import { CurrencyCompactSquare } from './variants/wigi-arz-1x1'
import { WigiArz2x3 } from './variants/wigi-arz-2x3'

interface WigiArzLayoutProps {
	enableBackground?: boolean
	inComboWidget?: boolean
	comboClassName?: string
	size?: WidgetSize
	instanceId?: string
	meta?: WigiArzMeta
}

export function WigiArzLayout({
	enableBackground = true,
	inComboWidget = false,
	comboClassName,
	size = { w: 2, h: 3 },
	instanceId,
	meta,
}: WigiArzLayoutProps) {
	const { selectedCurrencies, reorderCurrencies } =
		useCurrencyStore()
	const freeWidgets = useOptionalFreeWidgets()

	const ownsList = Boolean(
		instanceId && freeWidgets?.runtimeLayout.some((w) => w.instanceId === instanceId)
	)
	const currencies = (ownsList && meta?.currencies) || selectedCurrencies

	const handleReorder = (reordered: string[]) => {
		if (ownsList && instanceId) {
			freeWidgets?.updateWidgetSettings(instanceId, {
				...meta,
				currencies: reordered,
			})
			return
		}

		reorderCurrencies(reordered)
	}

	if (inComboWidget) {
		return (
			<div className="flex items-center justify-between pb-2 mt-1">
				{selectedCurrencies.length === 0 ? (
					<CurrencyEmptyState compact />
				) : (
					<CurrencyList
						currencies={selectedCurrencies}
						onReorder={reorderCurrencies}
						className={`flex flex-col w-full gap-1 overflow-x-hidden scrollbar-none ${comboClassName ?? ''}`}
					/>
				)}
			</div>
		)
	}

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
					meta={meta}
				/>
			</WidgetContainer>
		)
	}

	return (
		<WidgetContainer
			background={enableBackground}
			className="flex flex-col w-full h-full overflow-y-auto scrollbar-none"
		>
			<WigiArz2x3
				currencies={currencies}
				onReorder={handleReorder}
				instanceId={ownsList ? instanceId : undefined}
			/>
		</WidgetContainer>
	)
}

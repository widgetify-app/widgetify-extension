import { useState } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { Button } from '@/components/ui'
import { WidgetCenteredHeader } from '@/features/widgets/components/widget-header'
import { WidgetTabKeys } from '@/features/widgets/types'
import { Icon } from '@/icons'
import { CurrencyModalComponent } from '../components/currency-modal'
import { PriceChange } from '../components/price-change'
import { useCurrencyPrice } from '../hooks/use-currency-price'
import type { WigiArzMeta } from '../types'
import { getPrice } from '../utils/get-price'

const PRICE_MAX_FONT_SIZE = '1.375rem'

interface CurrencyCompactSquareProps {
	defaultCode?: string
	instanceId?: string
	meta?: WigiArzMeta
}

export function CurrencyCompactSquare({
	defaultCode,
	instanceId,
	meta,
}: CurrencyCompactSquareProps) {
	const activeCode = meta?.currencyCode || defaultCode
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { currency, priceChange, hasFailed, refetch } = useCurrencyPrice(
		activeCode || ''
	)

	const toggleModal = () => setIsModalOpen((prev) => !prev)

	if (!activeCode) {
		return (
			<>
				<WidgetCenteredHeader title="ویجی ارز" />
				<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1.5 select-none">
					<Icon
						name="coin"
						size={20}
						className="text-fg-faint"
						aria-hidden="true"
					/>
					<Button
						size="xs"
						color="brand"
						rounded="lg"
						onClick={() => {
							callEvent('openWidgetsSettings', {
								tab: WidgetTabKeys.wigiArz,
								instanceId,
								size: { w: 1, h: 1 },
							})
						}}
					>
						انتخاب ارز
					</Button>
				</div>
			</>
		)
	}

	const header = (
		<WidgetCenteredHeader
			title={
				<span className="inline-flex items-center gap-1.5">
					{currency?.icon && (
						<img
							src={currency.icon}
							alt=""
							className="object-cover rounded-full size-4 bg-fill"
						/>
					)}
					<span dir="ltr">{activeCode}</span>
				</span>
			}
		/>
	)

	if (hasFailed) {
		return (
			<>
				{header}
				<div className="flex flex-col items-center justify-center flex-1 min-h-0 gap-1.5 text-center select-none">
					<p className="leading-tight text-2xs text-fg-muted">
						نتونستیم قیمت رو بیاریم
					</p>
					<Button size="xs" color="base" rounded="lg" onClick={() => refetch()}>
						دوباره
					</Button>
				</div>
			</>
		)
	}

	if (!currency) {
		return (
			<>
				{header}
				<div
					aria-hidden="true"
					className="flex flex-col items-center justify-center flex-1 min-h-0 gap-2"
				>
					<div className="w-16 h-5 rounded-sm skeleton" />
					<div className="w-10 h-2.5 rounded-sm skeleton" />
				</div>
			</>
		)
	}

	const price = getPrice(activeCode, currency)

	return (
		<>
			{header}
			<button
				type="button"
				onClick={toggleModal}
				aria-label={`${currency.name?.fa || activeCode}، ${price.formatted}`}
				className="flex flex-col items-center justify-center flex-1 w-full min-h-0 gap-1 text-center rounded-lg cursor-pointer select-none focus-visible:focus-ring"
			>
				<span
					className="font-extrabold leading-none tracking-tight tabular-nums text-fg-strong"
					style={{
						fontSize: `min(${PRICE_MAX_FONT_SIZE}, ${Math.floor(160 / Math.max(price.formatted.length, 1))}cqw)`,
					}}
				>
					<data value={price.value}>{price.formatted}</data>
				</span>

				<span className="flex items-center gap-1">
					<span className="font-medium text-3xs text-fg-faint">
						{price.isDollar ? 'دلار' : 'تومان'}
					</span>
					<PriceChange changePercentage={currency.changePercentage} />
				</span>
			</button>

			<CurrencyModalComponent
				key={activeCode}
				code={activeCode}
				currency={currency}
				priceChange={priceChange}
				isModalOpen={isModalOpen}
				toggleCurrencyModal={toggleModal}
			/>
		</>
	)
}

import { useState } from 'react'
import { callEvent } from '@/common/utils/call-event'
import { useCurrencyStore } from '@/context/currency.context'
import { Icon } from '@/icons'
import { WidgetTabKeys } from '@/layouts/widgets-settings/tab-keys'
import { CurrencyModalComponent } from '../components/currency-modal'
import { useCurrencyPrice } from '../hooks/use-currency-price'
import type { WigiArzMeta } from '../types'
import { getPrice } from '../utils/get-price'

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
	const { currency, priceChange, hasFailed, refetch } = useCurrencyPrice(activeCode || '')

	const toggleModal = () => setIsModalOpen((prev) => !prev)

	if (!activeCode) {
		return (
			<button
				type="button"
				onClick={() => {
					callEvent('openWidgetsSettings', {
						tab: WidgetTabKeys.wigiArz,
						instanceId,
						size: { w: 1, h: 1 },
					})
				}}
				className="group flex flex-col items-center justify-center w-full h-full p-2 text-center cursor-pointer select-none transition-ui hover:bg-subtle focus-visible:focus-ring"
			>
				<span className="relative flex items-center justify-center w-12 h-12 transition-transform duration-200 group-hover:scale-105">
					<img
						src="https://cdn.widgetify.ir/extension/wigi-arz-empty.jpg"
						alt=""
						className="object-contain w-full h-full pointer-events-none select-none drop-shadow-sm"
						draggable={false}
					/>
				</span>
				<span className="mt-1.5 text-[11px] font-bold text-content leading-tight transition-colors duration-200 group-hover:text-primary">
					انتخاب ارز
				</span>
				<span className="mt-0.5 text-[9px] text-muted leading-tight font-medium">
					کلیک کن
				</span>
			</button>
		)
	}

	if (hasFailed) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full gap-[4.2cqh] p-[10.4cqh] text-center select-none">
				<Icon
					name="alert"
					size={16}
					className="text-muted"
					aria-hidden="true"
				/>
				<p className="text-[9.4cqh] leading-tight text-muted">
					قیمت {activeCode} دریافت نشد
				</p>
				<button
					type="button"
					onClick={() => refetch()}
					className="px-[8.3cqh] py-[4.2cqh] rounded-lg bg-muted text-[9.4cqh] font-bold text-content cursor-pointer transition-ui hover:bg-strong focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			</div>
		)
	}

	if (!currency) {
		return (
			<div
				aria-hidden="true"
				className="flex flex-col items-center justify-between w-full h-full p-[10.4cqh] select-none"
			>
				<div className="flex items-center justify-between w-full gap-1.5">
					<div className="w-5 h-5 rounded-full skeleton" />
					<div className="h-3.5 w-14 rounded skeleton" />
				</div>
				<div className="w-20 h-6 my-auto rounded skeleton" />
				<div className="w-12 h-4 rounded skeleton" />
			</div>
		)
	}

	const price = getPrice(activeCode, currency)

	return (
		<div className="relative w-full h-full">
			<button
				type="button"
				onClick={toggleModal}
				aria-label={`${currency.name?.fa || activeCode}، ${price.formatted}`}
				className="flex flex-col justify-between w-full h-full p-[10.4cqh] text-center cursor-pointer select-none transition-ui hover:bg-subtle focus-visible:focus-ring"
			>
				<span className="flex items-center justify-between w-full gap-1">
					<span className="flex items-center gap-1.5 min-w-0">
						<img
							src={currency.icon}
							alt=""
							className="object-cover rounded-md w-4.5 h-4.5 shrink-0"
						/>
						<span className="flex flex-col items-start min-w-0 text-right">
							<span className="text-[11.5cqh] font-bold text-content truncate leading-tight">
								{currency.name?.fa || activeCode}
							</span>
							<span className="text-[9.4cqh] text-muted font-mono uppercase leading-tight">
								{activeCode}
							</span>
						</span>
					</span>
				</span>

				<span
					dir="ltr"
					className="block my-auto text-[18.8cqh] font-black leading-tight tracking-tight text-content"
				>
					<data value={price.value}>
						{price.isDollar && '💲'}
						{price.formatted}
					</data>
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
		</div>
	)
}

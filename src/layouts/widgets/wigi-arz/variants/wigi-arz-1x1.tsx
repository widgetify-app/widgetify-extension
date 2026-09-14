import { useState } from 'react'
import { useCurrencyStore } from '@/context/currency.context'
import { Icon } from '@/icons'
import { CurrencyModalComponent } from '../components/currency-modal'
import { useCurrencyPrice } from '../hooks/use-currency-price'
import type { WigiArzMeta } from '../types'
import { getPrice } from '../utils/get-price'

interface CurrencyCompactSquareProps {
	defaultCode?: string
	meta?: WigiArzMeta
}

export function CurrencyCompactSquare({
	defaultCode = 'USD',
	meta,
}: CurrencyCompactSquareProps) {
	const { currencyColorMode } = useCurrencyStore()

	const activeCode = meta?.currencyCode || defaultCode || 'USD'
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { currency, priceChange, hasFailed, refetch } = useCurrencyPrice(activeCode)

	const toggleModal = () => setIsModalOpen((prev) => !prev)

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
					className="px-[8.3cqh] py-[4.2cqh] rounded-lg bg-base-content/10 text-[9.4cqh] font-bold text-content cursor-pointer transition-ui hover:bg-base-content/20 focus-visible:focus-ring"
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
				className="flex flex-col justify-between w-full h-full p-[10.4cqh] text-center cursor-pointer select-none transition-ui hover:bg-base-content/5 focus-visible:focus-ring"
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
				currencyColorMode={currencyColorMode}
				currency={currency}
				priceChange={priceChange}
				isModalOpen={isModalOpen}
				toggleCurrencyModal={toggleModal}
			/>
		</div>
	)
}

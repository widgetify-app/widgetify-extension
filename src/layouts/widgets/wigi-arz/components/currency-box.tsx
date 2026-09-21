import type React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Analytics from '@/analytics'
import { showToast } from '@/common/toast'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/icons'
import { useCurrencyPrice } from '../hooks/use-currency-price'
import { getPrice } from '../utils/get-price'
import { CurrencyModalComponent } from './currency-modal'

const PARTNER_REDIRECT_DELAY_MS = 1000

interface CurrencyBoxProps {
	code: string
	dragHandle?: React.HTMLAttributes<HTMLElement>
}

export const CurrencyBox = ({ code, dragHandle }: CurrencyBoxProps) => {
	const { currency, priceChange, hasFailed } = useCurrencyPrice(code)
	const [isModalOpen, setIsModalOpen] = useState(false)

	function toggleCurrencyModal() {
		if (currency?.url && currency?.isPartnerShip) {
			showToast('🔗 درحال انتقال به سایت همکار...', 'success')
			setTimeout(() => {
				toast.dismiss()
				Analytics.event('currency_sponsor', {
					currency: currency.name.en,
					url: currency.url,
				})

				if (currency.url) {
					window.open(currency.url, '_blank', 'noopener,noreferrer')
				}
			}, PARTNER_REDIRECT_DELAY_MS)
		} else {
			setIsModalOpen(!isModalOpen)
		}
	}

	const price = currency ? getPrice(code, currency) : null

	return (
		<>
			<div
				dir="ltr"
				className="group flex items-center gap-2 px-2.5 py-3 rounded-2xl hover:bg-base-content/10 border bg-base-content/2 border-base-content/5 transition-ui active:scale-[0.98]"
			>
				{dragHandle && (
					<span
						{...dragHandle}
						aria-label={`جابه‌جایی ${code}`}
						className="flex items-center justify-center w-4 h-4 transition-opacity cursor-grab active:cursor-grabbing text-muted opacity-40 group-hover:opacity-90 shrink-0"
					>
						<Icon name="dragIndicator" size={14} aria-hidden="true" />
					</span>
				)}

				<button
					type="button"
					onClick={toggleCurrencyModal}
					aria-label={`${currency?.name?.fa || code}${price ? `، ${price.formatted}` : ''}`}
					className="flex items-center justify-between flex-1 min-w-0 gap-2 cursor-pointer focus-visible:focus-ring"
				>
					<span className="flex items-center min-w-0 gap-2">
						<span className="relative shrink-0">
							{currency?.icon ? (
								<img
									src={currency.icon}
									alt=""
									className="object-cover w-5 h-5 rounded-lg bg-base-200"
								/>
							) : (
								<span
									aria-hidden="true"
									className="block w-5 h-5 rounded-full bg-base-content/10 animate-pulse"
								/>
							)}

							{currency?.partnershipLogo && (
								<img
									className="absolute right-0 w-3 h-3 -bottom-0.5"
									src={currency.partnershipLogo}
									alt="نماد همکار"
								/>
							)}
						</span>

						<span className="text-xs font-bold uppercase truncate text-content">
							{code}
						</span>
					</span>

					<span className="flex items-baseline gap-1.5 shrink-0">
						<span className="text-xs font-bold tracking-tight text-content">
							{price ? (
								<data value={price.value}>
									{price.isDollar && '💲'}
									{price.formatted}
								</data>
							) : hasFailed ? (
								<span className="text-muted">-</span>
							) : (
								'-'
							)}
						</span>
					</span>
				</button>
			</div>

			{currency && !currency.url && isModalOpen && (
				<CurrencyModalComponent
					key={code}
					code={code}
					currency={currency}
					priceChange={priceChange}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleCurrencyModal}
				/>
			)}
		</>
	)
}

import type React from 'react'
import { useState } from 'react'
import Analytics from '@/analytics'
import { dismissToasts, showToast } from '@/common/toast'
import { Icon } from '@/icons'
import { useCurrencyPrice } from '../hooks/use-currency-price'
import { getPrice } from '../utils/get-price'
import { CurrencyModalComponent } from './currency-modal'
import { PriceChange } from './price-change'
import { t } from '@/common/i18n'

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
			showToast(t('widgets.wigiArz.toast.partner'), 'success')
			setTimeout(() => {
				dismissToasts()
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
			<div className="relative flex items-center px-2 group/row rounded-xl min-h-11 transition-ui hover:bg-fill">
				{dragHandle && (
					<button
						type="button"
						{...dragHandle}
						aria-label={t('widgets.wigiArz.reorderAria', { code })}
						className="absolute inset-y-0 grid w-2.5 opacity-0 -start-2.5 place-items-center cursor-grab active:cursor-grabbing text-fg-faint transition-ui group-hover/row:opacity-100 focus-visible:opacity-100"
					>
						<Icon name="dragIndicator" size={12} aria-hidden="true" />
					</button>
				)}

				<button
					type="button"
					onClick={toggleCurrencyModal}
					aria-label={t('widgets.wigiArz.priceAria', {
						name: currency?.name?.fa || code,
						price: price ? price.formatted : '',
					})}
					className="flex items-center flex-1 min-w-0 gap-2.5 py-1.5 rounded-lg cursor-pointer text-start focus-visible:focus-ring"
				>
					<span className="relative flex-none">
						{currency?.icon ? (
							<img
								src={currency.icon}
								alt=""
								className="object-cover rounded-full size-6.5 bg-fill"
							/>
						) : (
							<span
								aria-hidden="true"
								className="block rounded-full size-6.5 skeleton"
							/>
						)}

						{currency?.partnershipLogo && (
							<img
								className="absolute right-0 size-3 -bottom-0.5"
								src={currency.partnershipLogo}
								alt={t('widgets.wigiArz.partnerAlt')}
							/>
						)}
					</span>

					<span className="flex flex-col flex-1 min-w-0">
						<span
							dir="ltr"
							className="font-mono text-xs font-bold uppercase truncate text-end text-fg-strong"
						>
							{code}
						</span>
						<span className="truncate text-3xs text-fg-faint">
							{currency?.name?.fa}
							{price?.isDollar && t('widgets.wigiArz.dollarSuffix')}
						</span>
					</span>

					<span className="flex flex-col items-end flex-none">
						<span className="text-xs font-bold tabular-nums text-fg-strong">
							{price ? (
								<data value={price.value}>{price.formatted}</data>
							) : (
								<span className={hasFailed ? 'text-fg-muted' : undefined}>
									-
								</span>
							)}
						</span>
						{currency && (
							<PriceChange changePercentage={currency.changePercentage} />
						)}
					</span>
				</button>
			</div>

			{currency && !currency.url && (
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

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { CurrencyColorMode } from '@/context/currency.context'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'
import { GetPrice } from '../utils/get-price'
import { CurrencyModalComponent } from './currency-modal'
import { showToast } from '@/common/toast'
import { Icon } from '@/src/icons'

interface CurrencyBoxProps {
	code: string
	currencyColorMode: CurrencyColorMode | null
	dragHandle?: React.HTMLAttributes<HTMLDivElement>
}

export const CurrencyBox = ({
	code,
	currencyColorMode,
	dragHandle,
}: CurrencyBoxProps) => {
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)
	const [priceChange, setPriceChange] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const prevPriceRef = useRef<number | null>(null)

	useEffect(() => {
		async function load() {
			const cached = await getFromStorage(`currency:${code}`)
			if (cached) {
				setCurrency(cached)
			}
		}
		load()
	}, [code])

	useEffect(() => {
		if (data) {
			setCurrency(data)
			setToStorage(`currency:${code}`, data)
		}
		const event = new Event('fetched-data')
		window.dispatchEvent(event)
	}, [dataUpdatedAt, code, data])

	useEffect(() => {
		if (currency?.price) {
			if (prevPriceRef.current !== currency.price) {
				prevPriceRef.current = currency.price
				if (currency.changePercentage) {
					const changeAmount =
						(currency.changePercentage / 100) * currency.rialPrice
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price, currency?.changePercentage, currency?.rialPrice])

	function toggleCurrencyModal() {
		if (currency?.url && currency?.isPartnerShip) {
			showToast('🔗 درحال انتقال به سایت همکار...', 'success')
			setTimeout(() => {
				toast.dismiss()
				Analytics.event('currency_sponsor', {
					currency: currency.name.en,
					url: currency.url,
				})

				if (currency.url) window.open(currency.url, '_blank')
			}, 1000)
		} else {
			setIsModalOpen(!isModalOpen)
		}
	}

	const priceChangeColor =
		currencyColorMode === CurrencyColorMode.NORMAL
			? `${priceChange > 0 ? 'text-error' : 'text-success'}`
			: `${priceChange > 0 ? 'text-success' : 'text-error'}`

	return (
		<>
			<div
				className="group flex items-center justify-between gap-2 px-2.5 py-3 rounded-2xl cursor-pointer bg-base-300/70 hover:bg-base-300/40 border border-base-300/70 transition-all duration-200 active:scale-[0.98]"
				onClick={toggleCurrencyModal}
				dir="ltr"
			>
				<div className="flex items-center min-w-0 gap-2">
					{dragHandle && (
						<div
							{...dragHandle}
							className="flex items-center justify-center w-4 h-4 transition-opacity cursor-grab active:cursor-grabbing text-muted opacity-40 group-hover:opacity-90 shrink-0"
						>
							<Icon name="dragIndicator" size={14} />
						</div>
					)}

					<div className="relative shrink-0">
						{currency?.icon ? (
							<img
								src={currency.icon}
								alt={currency?.name?.en || code}
								className="object-cover w-5 h-5 rounded-lg bg-base-200"
							/>
						) : (
							<div className="w-5 h-5 rounded-full bg-base-content/10 animate-pulse" />
						)}

						{currency?.partnershipLogo && (
							<img
								className="absolute right-0 z-50 w-3 h-3 -bottom-0.5"
								src={currency.partnershipLogo}
								alt="partnership"
							/>
						)}
					</div>

					<div className="flex items-center min-w-0">
						<span className="text-xs font-bold uppercase truncate text-content">
							{code}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<div className="flex items-baseline gap-1.5">
						<span className="text-xs font-bold tracking-tight text-content">
							{currency ? GetPrice(code, currency).label : '-'}
						</span>
						{priceChange !== 0 && (
							<span className={`text-xs ${priceChangeColor}`}>
								{priceChange > 0 ? (
									<Icon name="upLong" className="inline" />
								) : (
									<Icon name="downLong" className="inline" />
								)}
							</span>
						)}
					</div>
				</div>
			</div>

			{currency && !currency.url && isModalOpen && (
				<CurrencyModalComponent
					code={code}
					currencyColorMode={currencyColorMode}
					currency={currency}
					priceChange={priceChange}
					imgMainColor={''}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleCurrencyModal}
					key={code}
				/>
			)}
		</>
	)
}

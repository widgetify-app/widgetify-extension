import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { CurrencyColorMode } from '@/context/currency.context'
import { useGetImageMainColor } from '@/hooks/useGetImageMainColor'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/getCurrencyByCode.hook'
import { CurrencyModalComponent } from './currency-modal'

interface CurrencyBoxProps {
	code: string
	currencyColorMode: CurrencyColorMode | null
}

export const CurrencyBox = ({ code, currencyColorMode }: CurrencyBoxProps) => {
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)
	const [displayPrice, setDisplayPrice] = useState(0)
	const [priceChange, setPriceChange] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const prevPriceRef = useRef<number | null>(null)

	const imgMainColor = useGetImageMainColor(currency?.icon)

	useEffect(() => {
		async function load() {
			const currency = await getFromStorage(`currency:${code}`)
			if (currency) {
				setCurrency(currency)
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
	}, [dataUpdatedAt])

	useEffect(() => {
		if (currency?.price) {
			if (prevPriceRef.current !== currency.price) {
				// Directly set the display price without animation
				setDisplayPrice(currency.rialPrice)
				prevPriceRef.current = currency.price

				if (currency.changePercentage) {
					const changeAmount =
						(currency.changePercentage / 100) * currency.price
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price])

	function toggleCurrencyModal() {
		if (currency?.url && currency?.isSponsored) {
			toast.success('🔗 درحال انتقال به سایت اسپانسر...')
			setTimeout(() => {
				toast.dismiss()
				Analytics.event('currency-sponsor', {
					currency: currency.name.en,
					url: currency.url,
				})

				if (currency.url) window.open(currency.url, '_blank')
			}, 1000)
		} else {
			setIsModalOpen(!isModalOpen)
		}
	}

	const longPressTimeout = useRef<NodeJS.Timeout | null>(null)

	const handleMouseDown = () => {
		longPressTimeout.current = setTimeout(() => {
			toggleCurrencyModal()
		}, 500)
	}

	const handleMouseUp = () => {
		if (longPressTimeout.current) {
			clearTimeout(longPressTimeout.current)
			longPressTimeout.current = null
		}
	}

	const priceChangeColor =
		currencyColorMode === CurrencyColorMode.NORMAL
			? `${priceChange > 0 ? 'text-red-500' : 'text-green-500'}`
			: `${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`

	return (
		<>
			<div
				className={`flex items-center justify-between gap-2 p-2 pr-3 rounded-2xl cursor-pointer 
				bg-base-300 opacity-100 hover:!bg-gray-500/10
				hover:scale-95
				transition-all duration-200 ease-in-out
				transform`}
				onClick={() => toggleCurrencyModal()}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchEnd={handleMouseUp}
				dir="ltr"
			>
				<div className="flex items-center gap-x-2.5 max-w-full">
					<div className="relative">
						<img
							src={currency?.icon}
							alt={currency?.name?.en}
							className="object-cover w-6 h-6 rounded-full min-h-6 min-w-6"
						/>
						<div
							className="absolute inset-0 border rounded-full border-opacity-20"
							style={{ borderColor: imgMainColor }}
						/>
					</div>
					<div className="flex items-center min-w-0 space-x-2 text-sm font-medium">
						<span className="block text-sm truncate text-content">
							{code}
						</span>
					</div>
				</div>

				<div className="flex items-baseline gap-2 pr-2">
					<span className={'text-sm font-bold text-content'}>
						{displayPrice ? displayPrice.toLocaleString() : '-'}
					</span>
					{priceChange !== 0 && (
						<span className={`text-xs ${priceChangeColor}`}>
							{priceChange > 0 ? (
								<FaArrowUpLong className="inline" />
							) : (
								<FaArrowDownLong className="inline" />
							)}
						</span>
					)}
				</div>
			</div>
			{currency && !currency.url && (
				<CurrencyModalComponent
					code={code}
					currencyColorMode={currencyColorMode}
					priceChange={priceChange}
					currency={currency}
					displayPrice={displayPrice}
					imgMainColor={imgMainColor}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleCurrencyModal}
					key={code}
				/>
			)}
		</>
	)
}

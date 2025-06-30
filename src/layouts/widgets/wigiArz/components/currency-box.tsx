import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useGetImageMainColor } from '@/hooks/useGetImageMainColor'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/getCurrencyByCode.hook'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
import { CurrencyModalComponent } from './currency-modal'

interface CurrencyBoxProps {
	code: string
}

export const CurrencyBox = ({ code }: CurrencyBoxProps) => {
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
				Analytics.featureUsed('currency-sponsor', {
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

	return (
		<>
			<div
				className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer 
				bg-content opacity-100 hover:!bg-gray-500/30
				transition-all duration-300 ease-in-out hover:shadow-lg
				transform hover:scale-100 active:scale-95 translate-y-0`}
				style={{
					border: '1px solid transparent',
					borderColor: imgMainColor ? `${imgMainColor}30` : 'transparent',
				}}
				onClick={() => toggleCurrencyModal()}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchEnd={handleMouseUp}
				dir="ltr"
			>
				<div className="flex items-center space-x-2.5">
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
					<div className="flex items-center space-x-2 text-sm font-medium">
						<span className={'md:visible text-content opacity-90'}>
							{currency?.name?.en}
						</span>
						<span className={'text-xs text-content opacity-40'}>{code}</span>
					</div>
				</div>

				<div className="flex items-baseline gap-2">
					<span className={'text-sm font-bold text-content'}>
						{displayPrice.toLocaleString()}
					</span>
					{priceChange !== 0 && (
						<span
							className={`text-xs ${priceChange > 0 ? 'text-red-500' : 'text-green-500'}`}
						>
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

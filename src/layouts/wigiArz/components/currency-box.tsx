import { getMainColorFromImage } from '@/common/color'
import { getFromStorage, setToStorage } from '@/common/storage'
import {
	getCardBackground,
	getContainerBackground,
	getTextColor,
	getWidgetItemBackground,
	useTheme,
} from '@/context/theme.context'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/getMethodHooks/getCurrencyByCode.hook'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
import { CurrencyModalComponent } from './currency-modal'

interface CurrencyBoxProps {
	code: string
}

export const CurrencyBox = ({ code }: CurrencyBoxProps) => {
	const { theme } = useTheme()
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)
	const [imgColor, setImgColor] = useState<string>()
	const [displayPrice, setDisplayPrice] = useState(0)
	const [priceChange, setPriceChange] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const prevPriceRef = useRef<number | null>(null)

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
		if (currency?.icon) {
			getMainColorFromImage(currency.icon).then((color) => {
				setImgColor(color)
			})
		}
	}, [currency?.icon])

	useEffect(() => {
		if (currency?.price) {
			if (prevPriceRef.current !== currency.price) {
				// Directly set the display price without animation
				setDisplayPrice(currency.rialPrice)
				prevPriceRef.current = currency.price

				if (currency.changePercentage) {
					const changeAmount = (currency.changePercentage / 100) * currency.price
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price])

	function toggleCurrencyModal() {
		setIsModalOpen(!isModalOpen)
	}

	const longPressTimeout = useRef<NodeJS.Timeout | null>(null)

	const handleMouseDown = () => {
		longPressTimeout.current = setTimeout(() => {
			toggleCurrencyModal()
		}, 500) // 500ms for long press
	}

	const handleMouseUp = () => {
		if (longPressTimeout.current) {
			clearTimeout(longPressTimeout.current)
			longPressTimeout.current = null
		}
	}

	return (
		<>
			<LazyMotion features={domAnimation}>
				<m.div
					whileHover={{ scale: 1, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
					whileTap={{ scale: 0.98 }}
					className={`flex items-center justify-between gap-2 p-2 transition-all duration-200 rounded-lg  cursor-pointer  ${getWidgetItemBackground(theme)} opacity-60`}
					style={{
						border: '1px solid transparent',
						borderColor: imgColor ? `${imgColor}20` : 'transparent',
					}}
					initial={{ opacity: 0, y: -10 }}
					animate={{
						opacity: 1,
						y: 0,
						borderColor: imgColor ? `${imgColor}30` : 'transparent',
					}}
					transition={{
						type: 'spring',
						stiffness: 150,
						damping: 15,
						borderColor: { duration: 0.3 },
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
								className="object-cover w-6 h-6 rounded-full"
							/>
							<div
								className="absolute inset-0 border rounded-full border-opacity-20"
								style={{ borderColor: imgColor }}
							/>
						</div>
						<div className="flex items-center space-x-2 text-sm font-medium">
							<span className={`md:visible ${getTextColor(theme)} opacity-90`}>
								{currency?.name?.en}
							</span>
							<span className={`text-xs ${getTextColor(theme)} opacity-40`}>{code}</span>
						</div>
					</div>

					<div className="flex items-baseline gap-2">
						<span className={`text-sm font-bold ${getTextColor(theme)}`}>
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
				</m.div>
			</LazyMotion>
			{currency && (
				<CurrencyModalComponent
					code={code}
					priceChange={priceChange}
					currency={currency}
					displayPrice={displayPrice}
					imgColor={imgColor}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleCurrencyModal}
					key={code}
				/>
			)}
		</>
	)
}

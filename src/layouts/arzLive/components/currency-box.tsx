import { motion, useMotionValue, useSpring } from 'motion/react'
import ms from 'ms'
import { useEffect, useRef, useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
import { getMainColorFromImage } from '../../../common/color'
import { getFromStorage, setToStorage } from '../../../common/storage'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '../../../services/getMethodHooks/getCurrencyByCode.hook'
import { CurrencyModalComponent } from './currency-modal'

interface CurrencyBoxProps {
	code: string
}

export const CurrencyBox = ({ code }: CurrencyBoxProps) => {
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: ms('3m'),
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)

	const [imgColor, setImgColor] = useState<string>()
	const [displayPrice, setDisplayPrice] = useState(0)
	const [priceChange, setPriceChange] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const prevPriceRef = useRef<number | null>(null)

	const priceMotion = useMotionValue(0)
	const defaultDamping = 20
	const [damping, setDamping] = useState(defaultDamping)

	const animatedPrice = useSpring(priceMotion, {
		stiffness: 100,
		damping,
	})

	useEffect(() => {
		async function load() {
			const currency = await getFromStorage<FetchedCurrency>(`currency:${code}`)
			if (currency) {
				setCurrency(currency)
			}
		}
		load()
	}, [code])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (currency?.price) {
			if (prevPriceRef.current !== currency.price) {
				priceMotion.set(currency.rialPrice)
				prevPriceRef.current = currency.price
				if (currency.changePercentage) {
					const changeAmount = (currency.changePercentage / 100) * currency.price
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price, priceMotion])

	useEffect(() => {
		const unsubscribe = animatedPrice.on('change', (v) => {
			setDisplayPrice(Math.round(v))

			const diff = Math.abs(v - (currency?.rialPrice || 0))
			setDamping(diff < 5 ? 50 : defaultDamping)
		})
		return () => unsubscribe()
	}, [animatedPrice, currency?.rialPrice])

	function toggleCurrencyModal() {
		if (!isModalOpen === true) {
			if (!data) return
			// vibration
			if ('vibrate' in navigator) {
				navigator.vibrate(100)
			}
		}
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
			<motion.div
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
				className="flex items-center justify-between gap-2 p-2 transition-all duration-200 rounded-lg bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80"
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
					<div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
						<span className=" md:visible">{currency?.name?.en}</span>
						<span className="text-xs text-gray-500">{code}</span>
					</div>
				</div>

				<div className="flex items-baseline gap-2">
					<motion.span
						className="text-sm font-bold text-gray-200"
						animate={{ scale: [1, 1.02, 1] }}
						transition={{ duration: 0.3 }}
					>
						{displayPrice.toLocaleString()}
					</motion.span>
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
			</motion.div>
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

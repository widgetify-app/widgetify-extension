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
	const [currency, setCurrency] = useState<FetchedCurrency | null>(
		getFromStorage<FetchedCurrency>(`currency:${code}`) || null,
	)

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
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className="flex flex-col h-24 p-3 transition-shadow shadow-lg rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 hover:shadow-xl"
				onClick={() => toggleCurrencyModal()}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onTouchStart={handleMouseDown}
				onTouchEnd={handleMouseUp}
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="relative">
						<img
							src={currency?.icon}
							alt={currency?.name?.en}
							className="object-cover w-6 h-6 rounded-full "
						/>
						<div
							className="absolute inset-0 border-2 rounded-full opacity-20"
							style={{ borderColor: imgColor }}
						/>
						<div
							className="absolute inset-0 blur-xl opacity-30 "
							style={{ backgroundColor: imgColor }}
						/>
					</div>

					<div className="flex-1">
						<p className="text-sm font-semibold text-right dark:text-gray-200">
							{currency?.name.en}
						</p>
						<p className="text-xs text-right text-gray-500 dark:text-gray-400">
							{code.toUpperCase()}
						</p>
					</div>
				</div>

				<div className="relative flex items-end justify-between mt-auto">
					{/* {currency?.changePercentage ? ( */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className={`flex items-center gap-1 text-xs font-medium ${
							priceChange > 0 ? 'text-red-500' : 'text-green-500'
						} ${currency?.changePercentage ? 'opacity-100' : 'invisible'}`}
					>
						{priceChange > 0 ? <FaArrowUpLong /> : <FaArrowDownLong />}
						<span>{Number(priceChange.toFixed()).toLocaleString()}</span>
					</motion.div>
					{/* // ) : null} */}
					<motion.p
						className="text-lg font-bold leading-none text-right text-gray-800 dark:text-gray-100"
						animate={{ scale: [1, 1.02, 1] }}
						transition={{ duration: 0.3 }}
					>
						{displayPrice !== 0 ? displayPrice.toLocaleString() : ''}
					</motion.p>
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

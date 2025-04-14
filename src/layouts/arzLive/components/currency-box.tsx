import { getMainColorFromImage } from '@/common/color'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useTheme } from '@/context/theme.context'

import { AnimationContext } from '@/App'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/getMethodHooks/getCurrencyByCode.hook'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import ms from 'ms'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
import { CurrencyModalComponent } from './currency-modal'

interface CurrencyBoxProps {
	code: string
}

export const CurrencyBox = ({ code }: CurrencyBoxProps) => {
	const { theme } = useTheme()
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

	const { skipAnimations } = useContext(AnimationContext)

	const animatedPrice = skipAnimations
		? priceMotion
		: useSpring(priceMotion, {
				stiffness: 100,
				damping,
			})

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
				// If animations are disabled, directly set the display price
				if (skipAnimations) {
					setDisplayPrice(currency.rialPrice)
				} else {
					priceMotion.set(currency.rialPrice)
				}

				prevPriceRef.current = currency.price
				if (currency.changePercentage) {
					const changeAmount = (currency.changePercentage / 100) * currency.price
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price, priceMotion, skipAnimations])

	useEffect(() => {
		// Only subscribe to animation changes if animations are enabled
		if (skipAnimations) {
			return
		}

		const unsubscribe = animatedPrice.on('change', (v) => {
			setDisplayPrice(Math.round(v))

			const diff = Math.abs(v - (currency?.rialPrice || 0))
			setDamping(diff < 5 ? 50 : defaultDamping)
		})
		return () => unsubscribe()
	}, [animatedPrice, currency?.rialPrice, skipAnimations])

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

	const getBoxStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 hover:bg-gray-200/80'
			case 'dark':
				return 'bg-neutral-900/70 hover:bg-neutral-800/80'
			default: // glass
				return 'bg-black/20 hover:bg-black/30'
		}
	}

	const getCodeStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-500'
			default:
				return 'text-gray-500'
		}
	}

	const getNameStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-700'
			default:
				return 'text-gray-400'
		}
	}

	const getPriceStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-800'
			default:
				return 'text-gray-200'
		}
	}

	return (
		<>
			<motion.div
				whileHover={
					skipAnimations ? {} : { scale: 1.02, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }
				}
				whileTap={skipAnimations ? {} : { scale: 0.98 }}
				className={`flex items-center justify-between gap-2 p-2 transition-all duration-200 rounded-lg cursor-pointer  ${getBoxStyle()}`}
				style={{
					border: '1px solid transparent',
					borderColor: imgColor ? `${imgColor}20` : 'transparent',
				}}
				initial={skipAnimations ? {} : { opacity: 0, y: -10 }}
				animate={
					skipAnimations
						? { opacity: 1 }
						: {
								opacity: 1,
								y: 0,
								borderColor: imgColor ? `${imgColor}30` : 'transparent',
							}
				}
				transition={
					skipAnimations
						? { duration: 0 }
						: {
								type: 'spring',
								stiffness: 150,
								damping: 15,
								borderColor: { duration: 0.3 },
							}
				}
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
						<span className={`md:visible ${getNameStyle()}`}>{currency?.name?.en}</span>
						<span className={`text-xs ${getCodeStyle()}`}>{code}</span>
					</div>
				</div>

				<div className="flex items-baseline gap-2">
					<motion.span
						className={`text-sm font-bold ${getPriceStyle()}`}
						animate={skipAnimations ? {} : { scale: [1, 1.02, 1] }}
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

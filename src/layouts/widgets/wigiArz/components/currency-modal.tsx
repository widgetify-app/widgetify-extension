import { useEffect, useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong, FaChartLine } from 'react-icons/fa6'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { CurrencyColorMode } from '@/context/currency.context'
import { GetPrice } from '../utils/getPrice'

interface CurrencyModalComponentProps {
	code: string
	currency: any

	imgMainColor: string | undefined
	isModalOpen: boolean
	priceChange: number
	currencyColorMode: CurrencyColorMode | null
	toggleCurrencyModal: () => void
}

export const CurrencyModalComponent = ({
	code,
	currency,
	priceChange,
	imgMainColor,
	isModalOpen,
	toggleCurrencyModal,
	currencyColorMode,
}: CurrencyModalComponentProps) => {
	const [showChart, setShowChart] = useState(true)
	const [isVisible, setIsVisible] = useState(false)
	const [currencyAmount, setCurrencyAmount] = useState<number>(1)
	const [tomanAmount, setTomanAmount] = useState<number>(0)

	useEffect(() => {
		let timerId: NodeJS.Timeout
		if (isModalOpen) {
			timerId = setTimeout(() => {
				setIsVisible(true)
			}, 50)
		} else {
			setIsVisible(false)
		}
		return () => clearTimeout(timerId)
	}, [isModalOpen])

	// Initialize amounts when modal opens
	useEffect(() => {
		if (isModalOpen && currency?.rialPrice) {
			setCurrencyAmount(1)
			setTomanAmount(currency.rialPrice)
		}
	}, [isModalOpen, currency?.rialPrice])

	// Handle currency amount changes
	const handleCurrencyAmountChange = (value: number) => {
		setCurrencyAmount(value)
		if (currency?.rialPrice) {
			setTomanAmount(value * currency.rialPrice)
		}
	}

	// Handle toman amount changes
	const handleTomanAmountChange = (value: number) => {
		setTomanAmount(value)
		if (currency?.rialPrice) {
			setCurrencyAmount(value / currency.rialPrice)
		}
	}


	// Format number with thousands separator for input display
	const formatNumberWithCommas = (num: number) => {
		return num.toLocaleString('en-US')
	}

	// Parse number from formatted string (remove commas)
	const parseFormattedNumber = (str: string) => {
		return parseFloat(str.replace(/,/g, '')) || 0
	}

	const priceChangeColor =
		currencyColorMode === CurrencyColorMode.NORMAL
			? `${priceChange > 0 ? 'text-red-500' : 'text-green-500'}`
			: `${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`

	return (
		<Modal isOpen={isModalOpen} onClose={toggleCurrencyModal} size="sm">
			<div
				className={`relative p-8 flex flex-col items-center justify-center space-y-2 transition-all duration-300 ease-out ${
					isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				}`}
			>
				<div className="relative transition-transform duration-200 ease-out">
					<img
						src={currency?.icon}
						alt={currency?.name?.en}
						className="z-50 object-cover rounded-full shadow w-14 h-14"
					/>
					<div
						className="absolute top-0 z-10 w-14 h-14 blur-xl opacity-30"
						style={{ backgroundColor: imgMainColor }}
					/>
				</div>

				<div className="mt-2 space-y-1 text-center">
					<p className={'text-xl font-bold text-base-content'}>
						{currency?.name.en}
					</p>
					<p className={'text-sm font-medium text-base-content opacity-60'}>
						{code.toUpperCase()}
					</p>
				</div>

				<div className="w-full space-y-0">
					<div className="relative flex flex-row items-center justify-center gap-2 transition-transform duration-150 ease-out hover:scale-102">
						<p className={'text-xl font-bold text-base-content opacity-95'}>
							{GetPrice(code, currency).label}
						</p>

						{priceChange > 0 && (
							<div
								className={`flex items-center text-sm transition-all duration-300 ease-out ${priceChangeColor}`}
							>
								{priceChange > 0 ? (
									<FaArrowUpLong className="mr-1" />
								) : (
									<FaArrowDownLong className="mr-1" />
								)}

								<span>
									{Math.abs(
										Number(priceChange.toFixed())
									).toLocaleString()}
								</span>
							</div>
						)}

						{currency?.priceHistory?.length ? (
							<Button
								onClick={() => setShowChart(!showChart)}
								className={
									'btn-ghost p-1 rounded-lg opacity-70 hover:opacity-100 cursor-pointer transition-all duration-150 ease-in-out'
								}
								size="xs"
							>
								<div
									className={`transition-transform duration-300 ease-in-out ${
										showChart ? 'rotate-0' : 'rotate-180'
									}`}
								>
									<FaChartLine className={'w-5 h-5 text-content'} />
								</div>
							</Button>
						) : null}
					</div>
				</div>

				{/* Calculator Section */}
				<div className="w-full mt-6 space-y-3">
					<div className="text-center">
						<p className="text-sm font-medium text-base-content opacity-70">
							مبدل قیمت
						</p>
					</div>
					
					{/* Currency to Toman */}
					<div className="flex items-center gap-2 p-1 transition-colors duration-200 border border-transparent rounded-2xl bg-content hover:bg-base-200 hover:border-base-300">
						<input
							type="text"
							value={formatNumberWithCommas(currencyAmount)}
							onChange={(e) => handleCurrencyAmountChange(parseFormattedNumber(e.target.value))}
							className="w-full h-auto px-2 min-h-0 p-0 text-lg font-medium text-right input input-ghost !outline-primary !bg-transparent"
							placeholder="مبلغ"
						/>
						<span className="text-sm font-medium text-base-content min-w-fit">
							{code.toUpperCase()}
						</span>
					</div>

					{/* Toman to Currency */}
					<div className="flex items-center gap-2 p-1 transition-colors duration-200 border border-transparent rounded-2xl bg-content hover:bg-base-200 hover:border-base-300">
						<input
							type="text"
							value={formatNumberWithCommas(tomanAmount)}
							onChange={(e) => handleTomanAmountChange(parseFormattedNumber(e.target.value))}
							className="w-full h-auto px-2 min-h-0 p-0 text-lg font-medium text-right input input-ghost !outline-primary !bg-transparent"
							placeholder="مبلغ"
						/>
						<span className="text-sm font-medium text-base-content min-w-fit">
							تومان
						</span>
					</div>
				</div>
			</div>
		</Modal>
	)
}

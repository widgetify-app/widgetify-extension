import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FaArrowDownLong, FaArrowUpLong, FaChartLine } from 'react-icons/fa6'
import Modal from '../../../components/modal'
import { CurrencyChart } from './currency-chart'

interface CurrencyModalComponentProps {
	code: string
	currency: any
	displayPrice: number
	imgColor: string | undefined
	isModalOpen: boolean
	priceChange: number | null
	toggleCurrencyModal: () => void
}

export const CurrencyModalComponent = ({
	code,
	currency,
	displayPrice,
	imgColor,
	isModalOpen,
	priceChange,
	toggleCurrencyModal,
}: CurrencyModalComponentProps) => {
	const [showChart, setShowChart] = useState(true)

	return (
		<Modal isOpen={isModalOpen} onClose={toggleCurrencyModal} size="sm">
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className="flex flex-col items-center justify-center space-y-2 font-[balooTamma] p-1"
			>
				<motion.div
					className="relative"
					whileHover={{ scale: 1.05 }}
					transition={{ type: 'spring', stiffness: 300 }}
				>
					<img
						src={currency?.icon}
						alt={currency?.name?.en}
						className="z-50 object-cover w-16 h-16 rounded-full shadow"
					/>
					<div
						className="absolute top-0 z-10 w-16 h-16 blur-xl opacity-30"
						style={{ backgroundColor: imgColor }}
					/>
				</motion.div>

				<div className="text-center">
					<p className="text-xl font-bold text-gray-800 dark:text-gray-200">
						{currency?.name.en}
					</p>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{code.toUpperCase()}
					</p>
				</div>

				<div className="w-full space-y-0">
					<motion.div
						className="relative flex items-center justify-center gap-2"
						whileHover={{ scale: 1.02 }}
					>
						<PriceChangeComponent priceChange={priceChange} />
						<p className="text-xl font-bold text-gray-900 dark:text-gray-200">
							{displayPrice.toLocaleString()}
						</p>

						{currency?.priceHistory?.length ? (
							<motion.button
								onClick={() => setShowChart(!showChart)}
								className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<motion.div
									animate={{ rotate: showChart ? 0 : 180 }}
									transition={{ type: 'spring' }}
								>
									<FaChartLine className="w-5 h-5 text-gray-500 dark:text-gray-400" />
								</motion.div>
							</motion.button>
						) : null}
					</motion.div>

					<AnimatePresence initial={false}>
						{showChart && currency?.priceHistory?.length && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 256, opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ type: 'spring', stiffness: 200, damping: 20 }}
								className="w-full overflow-hidden"
							>
								<div className="w-full h-64 mt-4">
									<CurrencyChart priceHistory={currency?.priceHistory} />
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Additional currency info */}
				{currency?.type === 'crypto' && (
					<p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400">
						${Number(currency.price.toFixed()).toLocaleString()}
					</p>
				)}
			</motion.div>
		</Modal>
	)
}

interface Prop {
	priceChange: number
}
export function PriceChangeComponent({ priceChange }: Prop) {
	return (
		<motion.div
			className={`flex items-center text-sm ${
				priceChange > 0 ? 'text-red-500' : 'text-green-500'
			}`}
			initial={{ y: -10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ type: 'spring', stiffness: 300 }}
		>
			{priceChange > 0 ? (
				<FaArrowUpLong className="mr-1" />
			) : (
				<FaArrowDownLong className="mr-1" />
			)}

			<span>{Math.abs(Number(priceChange.toFixed()))}</span>
		</motion.div>
	)
}

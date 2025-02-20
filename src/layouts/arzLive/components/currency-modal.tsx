import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6'
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
	return (
		<Modal isOpen={isModalOpen} onClose={toggleCurrencyModal} size="sm">
			<div className="flex flex-col items-center justify-center space-y-2 font-[balooTamma] p-1">
				<div className="relative">
					<img
						src={currency?.icon}
						alt={currency?.name?.en}
						className="z-50 object-cover w-16 h-16 rounded-full shadow"
					/>
					<div
						className="absolute top-0 z-10 w-16 h-16 blur-xl opacity-30"
						style={{ backgroundColor: imgColor }}
					/>
				</div>
				<div className="text-center">
					<p className="text-xl font-bold text-gray-800 dark:text-gray-200">
						{currency?.name.en}
					</p>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{code.toUpperCase()}
					</p>
				</div>
				<div className="space-y-0">
					<div className="relative text-xl font-bold text-gray-900 dark:text-gray-200">
						{priceChange ? <PriceChangeComponent priceChange={priceChange} /> : null}
						<p>{displayPrice !== 0 ? displayPrice.toLocaleString() : ''} </p>
						{currency?.type === 'crypto' ? (
							<p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400">
								$
								{currency?.price ? Number(currency.price.toFixed()).toLocaleString() : ''}
							</p>
						) : null}

						{currency?.type === 'coin' ? (
							<p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 font-[Vazir]">
								{currency?.name ? currency.name.fa : ''}
							</p>
						) : null}
					</div>
				</div>
				{currency?.priceHistory?.length ? (
					<div className="w-full h-64">
						<CurrencyChart priceHistory={currency?.priceHistory} />
					</div>
				) : null}
			</div>
		</Modal>
	)
}
interface Prop {
	priceChange: number
}
export function PriceChangeComponent({ priceChange }: Prop) {
	return (
		<div
			className={` text-xs  ml-1 flex  z-50 ${
				priceChange > 0 ? 'text-red-500' : 'text-green-500'
			}`}
		>
			{priceChange > 0 ? <FaArrowUpLong /> : <FaArrowDownLong />}
			<p className="">{Number(priceChange.toFixed()).toLocaleString()}</p>
		</div>
	)
}

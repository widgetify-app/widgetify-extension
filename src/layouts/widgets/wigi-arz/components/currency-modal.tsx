import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { cn } from '@/common/utils/cn'
import { Modal, TextInput } from '@/components/ui'
import { Icon } from '@/icons'
import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'
import { getPrice } from '../utils/get-price'

interface CurrencyModalComponentProps {
	code: string
	currency: FetchedCurrency
	isModalOpen: boolean
	priceChange: number
	toggleCurrencyModal: () => void
}

export const CurrencyModalComponent = ({
	code,
	currency,
	priceChange,
	isModalOpen,
	toggleCurrencyModal,
}: CurrencyModalComponentProps) => {
	const [showConverter, setShowConverter] = useState(false)
	const [currencyAmount, setCurrencyAmount] = useState<number>(1)
	const [tomanAmount, setTomanAmount] = useState<number>(0)

	useEffect(() => {
		if (isModalOpen && currency?.rialPrice) {
			setCurrencyAmount(1)
			setTomanAmount(currency.rialPrice)
		}
	}, [isModalOpen, currency?.rialPrice])

	const handleCurrencyAmountChange = (value: number) => {
		setCurrencyAmount(value)
		if (currency?.rialPrice) {
			setTomanAmount(value * currency.rialPrice)
		}
	}

	const handleTomanAmountChange = (value: number) => {
		setTomanAmount(value)
		if (currency?.rialPrice) {
			setCurrencyAmount(value / currency.rialPrice)
		}
	}

	const formatNumberWithCommas = (num: number) => num?.toLocaleString('en-US')

	const parseFormattedNumber = (str: string) =>
		Number.parseFloat(str.replace(/,/g, '')) || 0

	const onClickConverter = () => {
		setShowConverter(!showConverter)
		Analytics.event('toggle_currency_converter_on_modal')
	}

	const isPositive = priceChange > 0
	const priceChangeColor = isPositive ? 'text-error' : 'text-success'

	const price = getPrice(code, currency)

	return (
		<Modal isOpen={isModalOpen} onClose={toggleCurrencyModal} size="sm">
			<section className="relative flex flex-col items-center justify-center p-8 space-y-2">
				<img
					src={currency?.icon}
					alt=""
					className="object-cover rounded-full shadow w-14 h-14"
				/>

				<header className="mt-2 space-y-1 text-center">
					<h2 className="text-xl font-bold text-strong">
						{currency?.name?.en}
					</h2>
					<div className="flex items-center justify-center gap-1 text-sm font-medium text-muted">
						<span>{code.toUpperCase()}</span>
						<button
							type="button"
							onClick={onClickConverter}
							aria-label="تبدیل ارز"
							aria-expanded={showConverter}
							className="cursor-pointer hover:text-primary focus-visible:focus-ring"
						>
							<Icon name="arrowRightLeft" aria-hidden="true" />
						</button>
					</div>
				</header>

				<div className="relative flex flex-row items-center justify-center gap-2 transition-transform duration-150 ease-out hover:scale-102">
					<p className="text-xl font-bold text-strong opacity-95">
						<data value={price.value}>
							{price.isDollar && '💲'}
							{price.formatted}
						</data>
					</p>

					{priceChange !== 0 && (
						<div
							className={cn(
								'flex items-center text-sm transition-ui',
								priceChangeColor
							)}
						>
							<Icon
								name={isPositive ? 'upLong' : 'downLong'}
								className="mr-1"
								aria-hidden="true"
							/>
							<span>
								{Math.abs(Number(priceChange.toFixed())).toLocaleString()}
							</span>
						</div>
					)}
				</div>

				<div
					className={cn(
						'flex flex-col gap-0.5 transition-[opacity,max-height] duration-300 ease-out',
						showConverter
							? 'opacity-100 max-h-96'
							: 'opacity-0 max-h-0 overflow-hidden'
					)}
				>
					<div className="flex items-center gap-2 p-1 transition-colors duration-200 border border-transparent rounded-2xl bg-content hover:bg-content hover:border-content">
						<span className="text-sm font-medium text-strong min-w-fit">
							{code.toUpperCase()}
						</span>
						<TextInput
							type="text"
							value={String(currencyAmount)}
							onChange={(e) =>
								handleCurrencyAmountChange(parseFormattedNumber(e))
							}
							className="!rounded-2xl !px-4 border-content"
							placeholder="مبلغ"
						/>
					</div>

					<div className="flex items-center gap-2 p-1 transition-colors duration-200 border border-transparent rounded-2xl bg-content hover:bg-content hover:border-content">
						<span className="text-sm font-medium text-strong min-w-fit">
							تومان
						</span>
						<TextInput
							type="text"
							value={formatNumberWithCommas(tomanAmount)}
							onChange={(value) =>
								handleTomanAmountChange(parseFormattedNumber(value))
							}
							className="!rounded-2xl !px-4 border-content"
							placeholder="مبلغ"
						/>
					</div>
				</div>
			</section>
		</Modal>
	)
}

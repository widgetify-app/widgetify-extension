import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { cn } from '@/common/utils/cn'
import { Modal, TextInput } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { Icon } from '@/icons'
import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'
import type { CurrencyHistoryRange } from '@/services/currency/get-currency-history.hook'
import { getPrice } from '../utils/get-price'
import {
	CurrencyHistory,
	DEFAULT_HISTORY_RANGE,
	HistoryRangeTabs,
} from './currency-history'
import { PriceChange } from './price-change'

interface CurrencyModalComponentProps {
	code: string
	currency: FetchedCurrency
	isModalOpen: boolean
	toggleCurrencyModal: () => void
}

const formatNumberWithCommas = (num: number) => num?.toLocaleString('en-US')

const parseFormattedNumber = (str: string) =>
	Number.parseFloat(str.replace(/,/g, '')) || 0

export const CurrencyModalComponent = ({
	code,
	currency,
	isModalOpen,
	toggleCurrencyModal,
}: CurrencyModalComponentProps) => {
	const { isVip } = useAuth()
	const [range, setRange] = useState<CurrencyHistoryRange>(DEFAULT_HISTORY_RANGE)
	const [isSwapped, setIsSwapped] = useState(false)
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

	const onSwap = () => {
		setIsSwapped(!isSwapped)
		Analytics.event('currency_converter_swapped')
	}

	const price = getPrice(code, currency)

	const fields = [
		<div key="currency" className={FIELD_CLASS}>
			<TextInput
				variant="bare"
				value={String(currencyAmount)}
				onChange={(value) =>
					handleCurrencyAmountChange(parseFormattedNumber(value))
				}
				className={INPUT_CLASS}
				placeholder={t('widgets.wigiArz.amountPlaceholder')}
				aria-label={code.toUpperCase()}
			/>
			<span className="text-2xs text-fg-muted">{code.toUpperCase()}</span>
		</div>,
		<div key="toman" className={cn(FIELD_CLASS, 'flex-[1.4]')}>
			<TextInput
				variant="bare"
				value={formatNumberWithCommas(tomanAmount)}
				onChange={(value) => handleTomanAmountChange(parseFormattedNumber(value))}
				className={INPUT_CLASS}
				placeholder={t('widgets.wigiArz.amountPlaceholder')}
				aria-label={t('widgets.wigiArz.toman')}
			/>
			<span className="text-2xs text-fg-muted">{t('widgets.wigiArz.toman')}</span>
		</div>,
	]

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={toggleCurrencyModal}
			size="sm"
			showCloseButton={false}
			className="p-0 md:p-0"
			closeLabel={t('ui.common.close')}
		>
			<section className="flex flex-col">
				<div className="flex flex-col gap-3 px-5 pt-5">
					<header className="flex items-center gap-2.5">
						<img
							src={currency?.icon}
							alt=""
							className="object-cover rounded-full size-9 shrink-0"
						/>
						<div className="flex-1 min-w-0">
							<h2 className="text-sm font-bold truncate text-fg-strong">
								{currency?.name?.en}
							</h2>
							<p className="flex items-center gap-1.5 text-2xs text-fg-muted">
								<span>{code.toUpperCase()}</span>
								{currency.period && <span>{currency.period}</span>}
							</p>
						</div>
						{isVip && <HistoryRangeTabs range={range} onChange={setRange} />}
					</header>

					<div className="flex items-baseline gap-2">
						<p className="text-3xl font-black tabular-nums text-fg-strong">
							<data value={price.value}>{price.formatted}</data>
						</p>
						<span className="text-xs text-fg-muted">
							{price.isDollar
								? t('widgets.wigiArz.dollar')
								: t('widgets.wigiArz.toman')}
						</span>
						<PriceChange
							changePercentage={currency.changePercentage}
							className="px-2 py-0.5 text-2xs rounded-full ms-auto bg-fill"
						/>
					</div>
				</div>

				<div className="mt-1">
					<CurrencyHistory
						code={code}
						currency={currency}
						enabled={isModalOpen}
						range={range}
						onLeave={toggleCurrencyModal}
					/>
				</div>

				{currency.type !== 'service' ? (
					<div className="flex items-center gap-2 px-4 pt-3 pb-4 mt-3 border-t border-line">
						{isSwapped ? fields[1] : fields[0]}
						<button
							type="button"
							onClick={onSwap}
							aria-label={t('widgets.wigiArz.swapAria')}
							className="grid cursor-pointer size-8 shrink-0 place-items-center rounded-xl bg-fill text-fg-muted hover:text-fg transition-ui focus-visible:focus-ring"
						>
							<Icon name="arrowRightLeft" size={16} aria-hidden="true" />
						</button>
						{isSwapped ? fields[0] : fields[1]}
					</div>
				) : (
					<div className="h-4" />
				)}
			</section>
		</Modal>
	)
}

const FIELD_CLASS =
	'flex flex-1 min-w-0 items-center gap-1.5 h-10 px-3 border rounded-xl border-surface-3 bg-surface-2 transition-ui focus-within:border-brand'

const INPUT_CLASS = 'min-w-0 text-sm font-bold text-fg-strong'

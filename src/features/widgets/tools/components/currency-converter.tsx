import { t } from '@/common/i18n'
import type React from 'react'
import { type ReactNode, useState } from 'react'
import { SelectBox, TextInput } from '@/components/ui'
import { Icon } from '@/icons'
import { useGetCurrencyByCode } from '@/services/currency/get-currency-by-code.hook'
import { useGetSupportCurrencies } from '@/services/currency/get-support-currencies.hook'
import { CONVERTER_DEFAULT_PAIR } from '../constants'
import { ToolHeader } from './tool-header'

const formatNumber = (num: number) =>
	new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(num)

const selectClassName =
	'w-22! h-7.5! px-2! rounded-lg! bg-surface! border-line! shadow-none! text-xs font-bold'

interface CurrencyConverterProps {
	tabs?: ReactNode
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ tabs }) => {
	const [fromCurrency, setFromCurrency] = useState(CONVERTER_DEFAULT_PAIR.from.code)
	const [toCurrency, setToCurrency] = useState(CONVERTER_DEFAULT_PAIR.to.code)
	const [amount, setAmount] = useState<number>(1)

	const { data: supportedCurrencies, isLoading: isLoadingSupported } =
		useGetSupportCurrencies()
	const { data: fromCurrencyData } = useGetCurrencyByCode(fromCurrency, {
		refetchInterval: null,
	})
	const { data: toCurrencyData } = useGetCurrencyByCode(toCurrency, {
		refetchInterval: null,
	})

	const convertedAmount =
		fromCurrencyData && toCurrencyData && amount
			? (amount * fromCurrencyData.rialPrice) / toCurrencyData.rialPrice
			: 0

	const currencyOptions = supportedCurrencies?.map((c) => ({
		label: c.key,
		value: c.key,
	}))

	const handleSwap = () => {
		setFromCurrency(toCurrency)
		setToCurrency(fromCurrency)
	}

	return (
		<>
			<ToolHeader tabs={tabs} />

			{isLoadingSupported ? (
				<div
					aria-hidden="true"
					className="flex flex-col justify-center flex-1 gap-1.5"
				>
					<div className="h-12 rounded-xl skeleton" />
					<div className="h-12 rounded-xl skeleton" />
				</div>
			) : (
				<div className="flex flex-col justify-center flex-1 min-h-0 gap-1.5">
					<div className="flex items-center h-12 gap-2 px-3 rounded-xl bg-fill">
						<TextInput
							type="number"
							value={amount.toString()}
							onChange={(value) => setAmount(Number(value))}
							aria-label={t('widgets.tools.currency.amount')}
							className="flex-1 min-w-0 h-auto! p-0! text-lg font-extrabold tabular-nums bg-transparent! border-none! shadow-none! ring-0! text-fg-strong"
						/>
						<SelectBox
							options={currencyOptions}
							value={fromCurrency}
							onChange={setFromCurrency}
							className={selectClassName}
						/>
					</div>

					<button
						type="button"
						onClick={handleSwap}
						aria-label={t('widgets.tools.currency.swap')}
						className="relative z-10 grid self-center -my-3.5 rounded-full shadow-sm cursor-pointer size-7.5 place-items-center bg-surface ring-1 ring-line text-fg-muted transition-ui hover:text-fg-strong active:scale-95 focus-visible:focus-ring"
					>
						<Icon name="upDown" size={14} aria-hidden="true" />
					</button>

					<div className="flex items-center h-12 gap-2 px-3 rounded-xl bg-fill">
						<output className="flex-1 min-w-0 text-lg font-extrabold truncate tabular-nums text-fg-strong">
							{formatNumber(convertedAmount)}
						</output>
						<SelectBox
							options={currencyOptions}
							value={toCurrency}
							onChange={setToCurrency}
							className={selectClassName}
						/>
					</div>

					{fromCurrencyData && (
						<p className="mt-1.5 text-center font-medium text-3xs text-fg-faint">
							{t('widgets.tools.currency.per')} {fromCurrency}{' '}
							{formatNumber(fromCurrencyData.rialPrice)}{' '}
							{t('widgets.tools.currency.toman')}
						</p>
					)}
				</div>
			)}
		</>
	)
}

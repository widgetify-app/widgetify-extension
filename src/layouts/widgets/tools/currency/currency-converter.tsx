import { motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useState } from 'react'
import { TbArrowsUpDown, TbInfoCircle } from 'react-icons/tb'
import { SelectBox } from '@/components/selectbox/selectbox'
import { TextInput } from '@/components/text-input'
import { useGetCurrencyByCode } from '@/services/hooks/currency/getCurrencyByCode.hook'
import { useGetSupportCurrencies } from '@/services/hooks/currency/getSupportCurrencies.hook'

export const CurrencyConverter: React.FC = () => {
	const [fromCurrency, setFromCurrency] = useState<string>('EUR')
	const [toCurrency, setToCurrency] = useState<string>('USD')
	const [amount, setAmount] = useState<number>(1)
	const [convertedAmount, setConvertedAmount] = useState<number>(0)
	const [isSwapping, setIsSwapping] = useState<boolean>(false)

	const { data: supportedCurrencies, isLoading: isLoadingSupported } =
		useGetSupportCurrencies()
	const { data: fromCurrencyData } = useGetCurrencyByCode(fromCurrency, {
		refetchInterval: null,
	})
	const { data: toCurrencyData } = useGetCurrencyByCode(toCurrency, {
		refetchInterval: null,
	})

	useEffect(() => {
		if (fromCurrencyData && toCurrencyData && amount) {
			const converted =
				(amount * fromCurrencyData.rialPrice) / toCurrencyData.rialPrice
			setConvertedAmount(Number(converted.toFixed(2)))
		}
	}, [fromCurrencyData, toCurrencyData, amount])

	const handleSwap = () => {
		setIsSwapping(true)
		setFromCurrency(toCurrency)
		setToCurrency(fromCurrency)
		setTimeout(() => setIsSwapping(false), 300)
	}

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(num)
	}

	if (isLoadingSupported)
		return (
			<div className="flex items-center justify-center text-sm h-44 opacity-20">
				در حال بروزرسانی...
			</div>
		)

	return (
		<div className="flex flex-col w-full gap-3 p-1 select-none">
			<div className="bg-base-200/40 border border-base-300/40 rounded-[2.8rem] p-5 relative flex flex-col gap-6">
				<div className="flex items-center justify-between gap-3">
					<TextInput
						type="number"
						value={amount.toString()}
						onChange={(e) => setAmount(Number(e))}
						className="flex-1 text-3xl font-black !bg-transparent border-none !p-0 focus:ring-0 text-content"
					/>
					<SelectBox
						options={supportedCurrencies?.map((c) => ({
							label: c.key,
							value: c.key,
						}))}
						value={fromCurrency}
						onChange={setFromCurrency}
						className="!w-24 !h-11 !rounded-2xl !bg-base-100 border border-base-300 shadow-sm font-bold text-xs"
					/>
				</div>

				<div className="absolute z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
					<button
						onClick={handleSwap}
						className="flex items-center justify-center transition-all border rounded-full shadow-lg cursor-pointer bg-base-300 w-11 h-11 border-primary/10 text-content hover:text-primary active:scale-90 hover:scale-105"
					>
						<motion.div animate={{ rotate: isSwapping ? 180 : 0 }}>
							<TbArrowsUpDown size={20} />
						</motion.div>
					</button>
				</div>

				<div className="flex items-center justify-between gap-3 mt-1">
					<div className="flex-1 text-3xl font-black truncate text-primary">
						{formatNumber(convertedAmount)}
					</div>
					<SelectBox
						options={supportedCurrencies?.map((c) => ({
							label: c.key,
							value: c.key,
						}))}
						value={toCurrency}
						onChange={setToCurrency}
						className="!w-24 !h-11 !rounded-2xl  border border-primary/20 shadow-sm font-bold text-xs"
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2 px-2 mt-1">
				<div className="flex justify-between items-center text-[11px] font-bold opacity-50">
					<span>ارزش به تومان:</span>
					<span className="text-[12px] font-black text-content">
						{fromCurrencyData
							? formatNumber(fromCurrencyData.rialPrice * amount)
							: 0}{' '}
						تومان
					</span>
				</div>

				<div className="flex items-center justify-between p-3.5 bg-primary/5 rounded-[1.5rem] border border-primary/10">
					<div className="flex gap-5">
						<div className="flex flex-col gap-0.5">
							<span className="text-[8px] font-black opacity-30 uppercase">
								{fromCurrency}
							</span>
							<span className="text-[11px] font-black opacity-70">
								{fromCurrencyData
									? formatNumber(fromCurrencyData.rialPrice)
									: 0}
							</span>
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-[8px] font-black opacity-30 uppercase">
								{toCurrency}
							</span>
							<span className="text-[11px] font-black opacity-70">
								{toCurrencyData
									? formatNumber(toCurrencyData.rialPrice)
									: 0}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-1.5 text-[11px] font-black text-primary bg-background/50 px-2 py-1 rounded-lg">
						<TbInfoCircle size={14} className="opacity-40" />۱ ={' '}
						{fromCurrencyData && toCurrencyData
							? formatNumber(
									fromCurrencyData.rialPrice / toCurrencyData.rialPrice
								)
							: 0}
					</div>
				</div>
			</div>
		</div>
	)
}

import { useEffect, useRef, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useCurrencyStore, type CurrencyColorMode } from '@/context/currency.context'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'
import { GetPrice } from '../utils/get-price'
import { CurrencyModalComponent } from '../components/currency-modal'
import { useGetImageMainColor } from '@/hooks/use-get-image-main-color'
import { callEvent } from '@/common/utils/call-event'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import { Button } from '@/components/ui'

interface CurrencyStackedItemProps {
	code: string
	currencyColorMode: CurrencyColorMode | null
}

function CurrencyStackedItem({ code, currencyColorMode }: CurrencyStackedItemProps) {
	const { data, dataUpdatedAt } = useGetCurrencyByCode(code, {
		refetchInterval: null,
	})

	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)
	const [priceChange, setPriceChange] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const prevPriceRef = useRef<number | null>(null)
	const imgMainColor = useGetImageMainColor(currency?.icon)

	useEffect(() => {
		async function load() {
			const cached = await getFromStorage(`currency:${code}`)
			if (cached) {
				setCurrency(cached)
			}
		}
		load()
	}, [code])

	useEffect(() => {
		if (data) {
			setCurrency(data)
			setToStorage(`currency:${code}`, data)
		}
	}, [dataUpdatedAt, code, data])

	useEffect(() => {
		if (currency?.price) {
			if (prevPriceRef.current !== currency.price) {
				prevPriceRef.current = currency.price
				if (currency.changePercentage) {
					const changeAmount =
						(currency.changePercentage / 100) * currency.rialPrice
					setPriceChange(changeAmount)
				}
			}
		}
	}, [currency?.price, currency?.changePercentage, currency?.rialPrice])

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	return (
		<>
			<div
				onClick={toggleModal}
				className="flex items-center justify-between py-2 px-2.5 cursor-pointer group hover:bg-base-content/5 transition-all duration-150 active:scale-[0.99] flex-1 last:rounded-b-2xl first:rounded-t-2xl"
			>
				<div className="flex flex-col items-start gap-1">
					<div className="relative">
						{currency?.icon ? (
							<img
								src={currency.icon}
								alt={code}
								className="object-cover w-5 h-5 rounded-full bg-base-200"
							/>
						) : (
							<div className="w-5 h-5 rounded-full bg-base-content/10 animate-pulse" />
						)}
						{currency?.partnershipLogo && (
							<img
								className="absolute right-0 z-50 w-2.5 h-2.5 -bottom-0.5"
								src={currency.partnershipLogo}
								alt="partnership"
							/>
						)}
					</div>
					<span className="text-xs font-bold tracking-tight uppercase text-content">
						{code}
					</span>
				</div>

				<div className="flex items-center">
					<span className="text-sm font-black tracking-tight sm:text-base text-content">
						{currency ? GetPrice(code, currency).label : '-'}
					</span>
				</div>
			</div>

			{currency && !currency.url && (
				<CurrencyModalComponent
					code={code}
					currencyColorMode={currencyColorMode}
					currency={currency}
					priceChange={priceChange}
					imgMainColor={imgMainColor}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleModal}
					key={code}
				/>
			)}
		</>
	)
}

interface CurrencyStackedVariantProps {
	instanceId?: string
	meta?: Record<string, any>
}

export function CurrencyStackedVariant({
	instanceId,
	meta,
}: CurrencyStackedVariantProps) {
	const { selectedCurrencies, currencyColorMode } = useCurrencyStore()

	const displayCurrencies = selectedCurrencies.slice(0, 3)

	function onSettingClick() {
		callEvent('openWidgetsSettings', { tab: WidgetTabKeys.wigiArz })
	}

	if (displayCurrencies.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full p-4 text-center select-none">
				<div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-lg mb-1.5">
					💰
				</div>
				<p className="mb-2 text-xs font-bold text-content">
					هنوز ارزی اضافه نکردی
				</p>
				<Button rounded="xl" size="xs" variant="primary" onClick={onSettingClick}>
					افزودن ارز
				</Button>
			</div>
		)
	}

	return (
		<div
			className="flex flex-col justify-between h-full w-full p-1.5 select-none overflow-hidden"
			dir="ltr"
		>
			<div className="flex flex-col justify-between h-full divide-y divide-base-content/10">
				{displayCurrencies.map((code) => (
					<CurrencyStackedItem
						key={code}
						code={code}
						currencyColorMode={currencyColorMode}
					/>
				))}
			</div>
		</div>
	)
}

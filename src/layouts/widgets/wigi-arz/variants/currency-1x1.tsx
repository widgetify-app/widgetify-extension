import { useEffect, useRef, useState } from 'react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { useCurrencyStore } from '@/context/currency.context'
import {
	type FetchedCurrency,
	useGetCurrencyByCode,
} from '@/services/hooks/currency/get-currency-by-code.hook'
import { GetPrice } from '../utils/get-price'
import { CurrencyModalComponent } from '../components/currency-modal'
import { Icon } from '@/src/icons'
import { Button, Tooltip } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'

interface CurrencyCompactSquareProps {
	defaultCode?: string
	instanceId?: string
	meta?: {
		currencyCode?: string
		[key: string]: any
	}
}

export function CurrencyCompactSquare({
	defaultCode = 'USD',
	instanceId,
	meta,
}: CurrencyCompactSquareProps) {
	const { currencyColorMode } = useCurrencyStore()

	const activeCode = meta?.currencyCode || defaultCode || 'USD'
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [currency, setCurrency] = useState<FetchedCurrency | null>(null)
	const [priceChange, setPriceChange] = useState(0)
	const prevPriceRef = useRef<number | null>(null)

	const { data, dataUpdatedAt } = useGetCurrencyByCode(activeCode, {
		refetchInterval: null,
	})

	useEffect(() => {
		async function loadCache() {
			if (!activeCode) return
			const cached = await getFromStorage(`currency:${activeCode}`)
			if (cached) {
				setCurrency(cached)
			}
		}
		loadCache()
	}, [activeCode])

	useEffect(() => {
		if (data && activeCode) {
			setCurrency(data)
			setToStorage(`currency:${activeCode}`, data)
		}
	}, [dataUpdatedAt, activeCode, data])

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

	const handleOpenSettings = (e: React.MouseEvent) => {
		e.stopPropagation()
		callEvent('openWidgetsSettings', {
			tab: WidgetTabKeys.wigiArz,
			instanceId,
			size: { w: 1, h: 1 },
		})
	}

	const toggleModal = () => {
		setIsModalOpen((prev) => !prev)
	}

	if (!currency) {
		return (
			<div className="flex flex-col items-center justify-between h-full w-full p-2.5 select-none">
				<div className="flex items-center gap-1.5 w-full justify-between">
					<div className="w-5 h-5 rounded-full skeleton" />
					<div className="w-14 h-3.5 rounded skeleton" />
				</div>
				<div className="w-20 h-6 rounded skeleton my-auto" />
				<div className="w-12 h-4 rounded skeleton" />
			</div>
		)
	}

	const priceResult = GetPrice(activeCode, currency)

	return (
		<>
			<div
				onClick={toggleModal}
				className="relative flex flex-col justify-between h-full w-full p-2.5 text-center select-none cursor-pointer group hover:bg-base-content/5 transition-all duration-200"
			>
				<div className="flex items-center justify-between gap-1 w-full">
					<div className="flex items-center gap-1.5 min-w-0">
						<img
							src={currency.icon}
							alt={currency.name?.en || activeCode}
							className="w-4.5 h-4.5 rounded-md object-cover shrink-0"
						/>
						<div className="flex flex-col items-start min-w-0 text-right">
							<span className="text-[11px] font-bold text-content truncate leading-tight">
								{currency.name?.fa || activeCode}
							</span>
							<span className="text-[9px] text-muted font-mono uppercase leading-tight">
								{activeCode}
							</span>
						</div>
					</div>

					<Tooltip content="تنظیمات">
						<Button
							size="xs"
							variant="ghost"
							rounded="full"
							onClick={handleOpenSettings}
							className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-base-300 text-muted transition-opacity"
						>
							<Icon name="settings" size={11} />
						</Button>
					</Tooltip>
				</div>

				<div className="flex flex-col items-center justify-center gap-0.5 my-auto px-1 py-0.5">
					<span
						className="text-base sm:text-lg font-black text-content leading-tight tracking-tight"
						dir="ltr"
					>
						{priceResult.label}
					</span>
				</div>
			</div>

			{currency && (
				<CurrencyModalComponent
					imgMainColor=""
					code={activeCode}
					currencyColorMode={currencyColorMode}
					currency={currency}
					priceChange={priceChange}
					isModalOpen={isModalOpen}
					toggleCurrencyModal={toggleModal}
					key={activeCode}
				/>
			)}
		</>
	)
}

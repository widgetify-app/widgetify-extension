import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { SectionPanel, SelectBox } from '@/components/ui'
import { TextInput } from '@/components/ui'
import { useAuth } from '@/context/auth.context'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import { useGetSupportCurrencies } from '@/services/hooks/currency/get-support-currencies.hook'
import type { WidgetSize } from '../layout-engine/types'
import { CurrenciesType, type WigiArzMeta } from './types'
import { filterCurrencyGroups, getCurrencyOptions } from './utils/get-currency-options'

interface WigiArzSettingProps {
	instanceId?: string
	size?: WidgetSize
}

export function WigiArzSetting({ instanceId, size }: WigiArzSettingProps) {
	const { data: supportCurrencies } = useGetSupportCurrencies()
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()

	const [sharedCurrencies, setSharedCurrencies] = useState<string[]>([])
	const [currencyType, setCurrencyType] = useState<string>('all')
	const [searchQuery, setSearchQuery] = useState('')
	const { isAuthenticated } = useAuth()

	const targetWidget = instanceId
		? runtimeLayout.find((w) => w.instanceId === instanceId)
		: null

	const isCompact = size
		? size.w === 1 && size.h === 1
		: targetWidget
			? targetWidget.size.w === 1 && targetWidget.size.h === 1
			: false

	const targetMeta = targetWidget?.meta as WigiArzMeta | undefined
	const isListVariant = targetWidget
		? targetWidget.size.w === 2 && targetWidget.size.h === 3
		: !isCompact
	const ownsList = Boolean(isListVariant && instanceId && targetWidget)
	const selectedCurrencies = ownsList
		? Array.isArray(targetMeta?.currencies)
			? targetMeta.currencies
			: []
		: sharedCurrencies

	useEffect(() => {
		async function load() {
			const currencies = await getFromStorage('currencies')

			if (currencies) {
				setSharedCurrencies(currencies)
			}
		}

		load()
	}, [])

	const toggleCurrency = (currencyKey: string) => {
		if (isCompact && instanceId) {
			updateWidgetSettings(instanceId, {
				...targetMeta,
				currencyCode: currencyKey,
			})
			Analytics.event('currency_compact_setting_change', {
				currency: currencyKey,
				instanceId,
			})
			return
		}

		const isRemoving = selectedCurrencies.includes(currencyKey)
		const modifiedCurrencySelection = isRemoving
			? selectedCurrencies.filter((key) => key !== currencyKey)
			: [...selectedCurrencies, currencyKey]

		Analytics.event('currency_selection', {
			currency_key: currencyKey,
			action: isRemoving ? 'remove' : 'add',
		})

		if (modifiedCurrencySelection.length > 4 && !isAuthenticated) {
			callEvent('open_require_auth_modal')
			Analytics.event('currency_selection_blocked')
			return
		}

		if (ownsList && instanceId) {
			updateWidgetSettings(instanceId, {
				...targetMeta,
				currencies: modifiedCurrencySelection,
			})
			return
		}

		callEvent('currencies_updated', {
			currencies: modifiedCurrencySelection,
		})
		setSharedCurrencies(modifiedCurrencySelection)
		setToStorage('currencies', modifiedCurrencySelection)
	}

	const currencyGroups = getCurrencyOptions(
		supportCurrencies.filter((currency) =>
			currencyType !== 'all' ? currency.type === currencyType : true
		)
	)
	const filteredGroups = filterCurrencyGroups(currencyGroups, searchQuery)

	const activeCompactCode = targetMeta?.currencyCode || ''

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-3 transition-all duration-300 ease-out">
				<SectionPanel
					title={isCompact ? 'انتخاب ارز برای ویجت' : 'انتخاب ارزها'}
					size="xs"
				>
					<div className="flex flex-col gap-1 mb-2">
						<TextInput
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e)}
							placeholder="جستجو ..."
						/>
						<SelectBox
							options={[
								{ value: 'all', label: 'همه ارزها' },
								{ value: CurrenciesType.CRYPTO, label: 'ارزهای دیجیتال' },
								{ value: CurrenciesType.CURRENCY, label: 'ارزها' },
								{ value: CurrenciesType.COIN, label: 'طلا و سکه' },
							]}
							value={currencyType}
							onChange={(value) => setCurrencyType(value)}
						/>
					</div>

					<div className="px-2 pr-1 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ease-out min-h-64 max-h-64 scrollbar-thin scrollbar-thumb">
						{filteredGroups.map((group) => (
							<section key={group.label} className="mb-6">
								<h3 className="mb-3 text-sm font-medium text-content">
									{group.label}
								</h3>
								<ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
									{group.options.map((option) => {
										const isSelected = isCompact
											? activeCompactCode === option.value
											: selectedCurrencies.includes(option.value)

										return (
											<li key={option.value}>
												<button
													type="button"
													aria-pressed={isSelected}
													onClick={() =>
														toggleCurrency(option.value)
													}
													className={cn(
														'flex flex-col items-center justify-center w-full gap-1 p-3',
														'border shadow-xs cursor-pointer rounded-2xl',
														'transition-ui active:scale-98 hover:scale-95',
														'focus-visible:focus-ring',
														isSelected
															? 'border-brand-subtle bg-brand-subtle text-content'
															: 'border-content bg-content hover:!bg-brand-subtle'
													)}
												>
													<span
														className={
															isSelected
																? 'font-medium'
																: 'font-normal'
														}
													>
														{option.label}
													</span>
													<span
														className={cn(
															'text-xs font-light',
															isSelected
																? 'opacity-90'
																: 'opacity-70'
														)}
													>
														{option.value}
													</span>
												</button>
											</li>
										)
									})}
								</ul>
							</section>
						))}
					</div>
				</SectionPanel>
			</div>
		</WidgetSettingWrapper>
	)
}

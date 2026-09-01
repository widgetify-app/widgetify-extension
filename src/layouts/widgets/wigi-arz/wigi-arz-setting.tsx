import { useEffect, useState } from 'react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { ItemSelector, SectionPanel, SelectBox } from '@/components/ui'
import { TextInput } from '@/components/text-input'
import { useAuth } from '@/context/auth.context'
import { CurrencyColorMode } from '@/context/currency.context'
import { useFreeWidgets } from '@/context/free-widget/free-widget.context'
import { WidgetSettingWrapper } from '@/layouts/widgets-settings/widget-settings-wrapper'
import { useGetSupportCurrencies } from '@/services/hooks/currency/get-support-currencies.hook'
import { CurrenciesType, type SupportedCurrencies } from './wigi-arz-setting.interface'

interface WigiArzSettingProps {
	instanceId?: string
	size?: { w: number; h: number }
}

export function WigiArzSetting({ instanceId, size }: WigiArzSettingProps) {
	const { data: supportCurrencies } = useGetSupportCurrencies()
	const { runtimeLayout, updateWidgetSettings } = useFreeWidgets()

	const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
	const [currencyColorMode, setCurrencyColorMode] = useState<CurrencyColorMode>(
		CurrencyColorMode.NORMAL
	)
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

	useEffect(() => {
		async function load() {
			const [color, currencies] = await Promise.all([
				getFromStorage('currencyColorMode'),
				getFromStorage('currencies'),
			])

			if (color) {
				setCurrencyColorMode(color)
			}
			if (currencies) {
				setSelectedCurrencies(currencies)
			}
		}

		load()
	}, [])

	const toggleCurrency = (currencyKey: string) => {
		if (isCompact && instanceId) {
			updateWidgetSettings(instanceId, {
				...targetWidget?.meta,
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

		callEvent('currencies_updated', {
			currencies: modifiedCurrencySelection,
			colorMode: currencyColorMode,
		})
		setSelectedCurrencies(modifiedCurrencySelection)
		setToStorage('currencies', modifiedCurrencySelection)
	}

	const toggleCurrencyColorMode = (mode: CurrencyColorMode) => {
		Analytics.event('currency_color_mode_changed', {
			mode,
		})

		callEvent('currencies_updated', {
			currencies: selectedCurrencies,
			colorMode: mode,
		})

		setCurrencyColorMode(mode)
		setToStorage('currencyColorMode', mode)
	}

	const currencyGroups = getCurrencyOptions(
		supportCurrencies.filter((currency) =>
			currencyType !== 'all' ? currency.type === currencyType : true
		)
	)
	const filteredGroups = currencyGroups
		.map((group) => ({
			...group,
			options: group.options.filter((option) =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase())
			),
		}))
		.filter((group) => group.options.length > 0)

	const activeCompactCode = targetWidget?.meta?.currencyCode || 'USD'

	return (
		<WidgetSettingWrapper>
			<div className="flex flex-col gap-3 transition-all duration-300 ease-out">
				<SectionPanel title="رنگ تغییر قیمت" size="xs">
					<div className="flex flex-row gap-2">
						<ItemSelector
							label="عادی"
							isActive={currencyColorMode === CurrencyColorMode.NORMAL}
							className="w-full"
							onClick={() =>
								toggleCurrencyColorMode(CurrencyColorMode.NORMAL)
							}
						/>
						<ItemSelector
							label="معکوس"
							isActive={currencyColorMode === CurrencyColorMode.X}
							className="w-full"
							onClick={() => toggleCurrencyColorMode(CurrencyColorMode.X)}
						/>
					</div>
				</SectionPanel>

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
							value={currencyType as any}
							onChange={(value) => setCurrencyType(value)}
						/>
					</div>

					<div className="px-2 pr-1 overflow-x-hidden overflow-y-auto transition-opacity duration-300 ease-out min-h-64 max-h-64 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
						{filteredGroups.map((group, groupIndex) => (
							<div
								key={groupIndex}
								className="mb-6 transition-all duration-200 ease-out"
							>
								<h3 className="mb-3 text-sm font-medium currency-group-heading">
									{group.label}
								</h3>
								<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
									{group.options.map((option) => {
										const isSelected = isCompact
											? activeCompactCode === option.value
											: selectedCurrencies.includes(option.value)

										return (
											<div
												key={option.value}
												className={`flex shadow-xs flex-col items-center justify-center gap-1 p-3 border cursor-pointer rounded-2xl 
														transition-all duration-200 ease-out active:scale-98 hover:scale-95
														${isSelected ? 'currency-box-selected border-primary/30 bg-primary/15 text-content' : 'border-base-300/40 bg-content hover:!bg-primary/15'}
													  `}
												onClick={() =>
													toggleCurrency(option.value)
												}
											>
												<div
													className={`font-normal ${isSelected ? 'font-medium' : ''}`}
												>
													{option.label}
												</div>
												<div
													className={`text-xs font-light opacity-70 ${isSelected ? 'opacity-90' : ''}`}
												>
													{option.value}
												</div>
											</div>
										)
									})}
								</div>
							</div>
						))}
					</div>
				</SectionPanel>
			</div>
		</WidgetSettingWrapper>
	)
}

interface Option {
	label: string
	options: {
		value: string
		label: string
	}[]
}
function getCurrencyOptions(supported: SupportedCurrencies): Option[] {
	const keys = Object.keys(supported)

	const isCrypto = keys
		.map((key) => Number(key))
		.filter((index) => supported[index].type === 'crypto')

	const isCurrency = keys
		.map((key) => Number(key))
		.filter((index) => supported[index].type === 'currency')

	const supportedCoins = keys
		.map((key) => Number(key))
		.filter((index) => supported[index].type === 'coin')

	return [
		{
			label: '🪙 ارزهای دیجیتال',
			options: isCrypto.map((index) => ({
				value: supported[index].key,
				label: supported[index].label.fa,
			})),
		},
		{
			label: '💵 ارزها',
			options: isCurrency.map((index) => ({
				value: supported[index].key,
				label: supported[index].label.fa,
			})),
		},
		{
			label: '🥇 طلا و سکه',
			options: supportedCoins.map((index) => ({
				value: supported[index].key,
				label: supported[index].label.fa,
			})),
		},
	]
}

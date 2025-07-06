import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useCurrencyStore } from '@/context/currency.context'
import { useGetSupportCurrencies } from '@/services/hooks/currency/getSupportCurrencies.hook'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export type SupportedCurrencies = {
	key: string
	type: 'coin' | 'crypto' | 'currency'
	country?: string
	label: {
		fa: string
		en: string
	}
}[]

interface AddCurrencyModalProps {
	show: boolean
	setShow: (show: boolean) => void
}

export function SelectCurrencyModal({ setShow, show }: AddCurrencyModalProps) {
	if (!show) return null
	const { data: supportCurrencies } = useGetSupportCurrencies()

	const { selectedCurrencies, setSelectedCurrencies } = useCurrencyStore()
	const [searchQuery, setSearchQuery] = useState('')
	const [isContentVisible, setIsContentVisible] = useState(false)

	useEffect(() => {
		let timerId: NodeJS.Timeout
		if (show) {
			timerId = setTimeout(() => {
				setIsContentVisible(true)
			}, 50)
		} else {
			setIsContentVisible(false)
		}
		return () => {
			clearTimeout(timerId)
			if (!show) {
				setIsContentVisible(false)
			}
		}
	}, [show])

	const onClose = () => setShow(false)

	const toggleCurrency = (currencyKey: string) => {
		const isRemoving = selectedCurrencies.includes(currencyKey)

		setSelectedCurrencies(
			isRemoving
				? selectedCurrencies.filter((key) => key !== currencyKey)
				: [...selectedCurrencies, currencyKey]
		)

		Analytics.featureUsed(
			'currency_selection',
			{
				currency_key: currencyKey,
				action: isRemoving ? 'remove' : 'add',
			},
			'toggle'
		)
	}

	const currencyGroups = getCurrencyOptions(supportCurrencies)
	const filteredGroups = currencyGroups
		.map((group) => ({
			...group,
			options: group.options.filter((option) =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase())
			),
		}))
		.filter((group) => group.options.length > 0)

	return (
		<Modal
			isOpen={show}
			onClose={onClose}
			size="md"
			title="افزودن ارز"
			direction="rtl"
		>
			<div
				className={`w-full h-full transition-all duration-300 ease-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'}`}
			>
				<div className="relative mb-5">
					<div
						className={`absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 transition-opacity duration-300 ease-out ${isContentVisible ? 'opacity-100 delay-200' : 'opacity-0'}`}
					>
						<FiSearch />
					</div>
					<TextInput
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e)}
						placeholder="جستجو ..."
					/>
				</div>

				<div
					className={`px-2 pr-1 overflow-x-hidden overflow-y-auto min-h-60 max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-opacity duration-300 ease-out ${isContentVisible ? 'opacity-100 delay-[100ms]' : 'opacity-0'}`}
				>
					{filteredGroups.map((group, groupIndex) => (
						<div
							key={groupIndex}
							className={`mb-6 transition-all duration-200 ease-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'}`}
							style={{
								transitionDelay: isContentVisible
									? `${200 + groupIndex * 100}ms`
									: '0ms',
							}}
						>
							<h3
								className={
									'text-sm font-medium mb-3 currency-group-heading'
								}
							>
								{group.label}
							</h3>
							<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
								{group.options.map((option) => {
									const isSelected = selectedCurrencies.includes(
										option.value
									)

									return (
										<div
											key={option.value}
											className={`flex flex-col items-center justify-center gap-1 p-3 border cursor-pointer rounded-xl 
                                                        transition-all duration-200 ease-out active:scale-98 
                                                        ${isSelected ? 'currency-box-selected border-success/30 bg-success/15 text-content' : 'border-base-300/40 bg-content hover:!bg-base-300/80'}
                                                        ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'}`}
											style={{
												transitionDelay: isContentVisible
													? `${10 + groupIndex * 100 + 50}ms`
													: '0ms',
											}}
											onClick={() => toggleCurrency(option.value)}
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

				<div
					className={`mt-4 flex justify-center w-full transition-all duration-300 ease-out ${isContentVisible ? 'opacity-100 translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-[10px]'}`}
				>
					<Button
						onClick={onClose}
						type="button"
						isPrimary={true}
						size="md"
						className="w-full text-white rounded-xl"
					>
						تایید
					</Button>
				</div>
			</div>
		</Modal>
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
				labelEn: supported[index].key,
			})),
		},
		{
			label: '💵 ارزها',
			options: isCurrency.map((index) => ({
				value: supported[index].key,
				label: supported[index].label.fa,
				labelEn: supported[index].key,
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

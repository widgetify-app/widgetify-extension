import Analytics from '@/analytics'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useCurrencyStore } from '@/context/currency.context'
import { useGetSupportCurrencies } from '@/services/getMethodHooks/getSupportCurrencies.hook'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useState } from 'react'
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

	const onClose = () => setShow(false)

	const toggleCurrency = (currencyKey: string) => {
		const isRemoving = selectedCurrencies.includes(currencyKey)

		setSelectedCurrencies(
			isRemoving
				? selectedCurrencies.filter((key) => key !== currencyKey)
				: [...selectedCurrencies, currencyKey],
		)

		Analytics.featureUsed(
			'currency_selection',
			{
				currency_key: currencyKey,
				action: isRemoving ? 'remove' : 'add',
			},
			'toggle',
		)
	}

	const currencyGroups = getCurrencyOptions(supportCurrencies)
	const filteredGroups = currencyGroups
		.map((group) => ({
			...group,
			options: group.options.filter((option) =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter((group) => group.options.length > 0)

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				duration: 0.3,
				when: 'beforeChildren',
				staggerChildren: 0.1,
			},
		},
	}

	const itemVariants = {
		hidden: { y: 10, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
	}

	return (
		<Modal isOpen={show} onClose={onClose} size="md" title="افزودن ارز" direction="rtl">
			<LazyMotion features={domAnimation}>
				<m.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full"
				>
					{/* Search input */}
					<div className="relative mb-5">
						<m.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
						>
							<FiSearch />
						</m.div>
						<TextInput
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e)}
							placeholder="جستجو ..."
						/>
					</div>

					{/* Currency groups */}
					<m.div
						className="px-2 pr-1 overflow-x-hidden overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						{filteredGroups.map((group, groupIndex) => (
							<m.div key={groupIndex} className="mb-6" variants={itemVariants}>
								<h3 className={'text-sm font-medium mb-3 currency-group-heading'}>
									{group.label}
								</h3>
								<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
									{group.options.map((option) => {
										const isSelected = selectedCurrencies.includes(option.value)

										return (
											<m.div
												key={option.value}
												className={`flex flex-col items-center justify-center gap-1 p-3 transition-colors duration-200 border cursor-pointer rounded-xl ${isSelected ? 'currency-box-selected' : 'currency-box-unselected'}`}
												onClick={() => toggleCurrency(option.value)}
												variants={itemVariants}
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.97 }}
												layout
											>
												<div className={`font-normal ${isSelected ? 'font-medium' : ''}`}>
													{option.label}
												</div>
												<div
													className={`text-xs font-light opacity-70 ${isSelected ? 'opacity-90' : ''}`}
												>
													{option.value}
												</div>
											</m.div>
										)
									})}
								</div>
							</m.div>
						))}
					</m.div>

					{/* Confirmation button */}
					<m.div
						className="flex justify-center w-full mt-5"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<m.button
							onClick={onClose}
							type="button"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.97 }}
							className="px-6 w-64 py-2.5 transition-colors duration-200 rounded-xl cursor-pointer font-medium text-sm currency-confirm-button"
						>
							تایید
						</m.button>
					</m.div>
				</m.div>
			</LazyMotion>
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

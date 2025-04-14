import Analytics from '@/analytics'
import Modal from '@/components/modal'
import { TextInput } from '@/components/text-input'
import { useCurrencyStore } from '@/context/currency.context'
import { useTheme } from '@/context/theme.context'
import { useGetSupportCurrencies } from '@/services/getMethodHooks/getSupportCurrencies.hook'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { FiSearch } from 'react-icons/fi'
import { TiPlus } from 'react-icons/ti'

export type SupportedCurrencies = {
	key: string
	type: 'coin' | 'crypto' | 'currency'
	country?: string
	label: {
		fa: string
		en: string
	}
}[]

interface AddCurrencyBoxProps {
	disabled?: boolean
	loading?: boolean
}

export const AddCurrencyBox = ({ disabled, loading }: AddCurrencyBoxProps) => {
	const { theme } = useTheme()
	const [showModal, setShowModal] = useState(false)

	const getBoxStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/70 hover:bg-gray-200/80'
			case 'dark':
				return 'bg-neutral-900/70 hover:bg-neutral-800/80'
			default: // glass
				return 'bg-black/20 hover:bg-black/30'
		}
	}

	const getCircleStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200'
			case 'dark':
				return 'bg-neutral-800'
			default: // glass
				return 'bg-black/20'
		}
	}

	const getTextStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600'
			default:
				return 'text-gray-400'
		}
	}

	return (
		<>
			<LazyMotion features={domAnimation}>
				<m.div
					whileHover={
						disabled
							? {}
							: {
									scale: 1.05,
									backgroundColor:
										theme === 'light'
											? 'rgba(229, 231, 235, 0.8)'
											: 'rgba(63, 63, 70, 0.5)',
								}
					}
					whileTap={disabled ? {} : { scale: 0.95 }}
					className={`flex items-center gap-2 p-2 duration-200 rounded-lg   shadow-lg transition-all cursor-pointer ${getBoxStyle()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
					onClick={() => !disabled && setShowModal(true)}
					initial={false}
					animate={{
						border: disabled ? '' : '1px solid rgba(161, 161, 170, 0.2)',
					}}
				>
					<m.div
						className={`flex items-center justify-center w-6 h-6 rounded-full ${getCircleStyle()}`}
						whileHover={{ rotate: 90 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						{loading ? (
							<AiOutlineLoading className={`w-6 h-6 animate-spin ${getTextStyle()}`} />
						) : (
							<TiPlus className={`w-4 h-4 ${getTextStyle()}`} />
						)}
					</m.div>
					<span className={`text-sm ${getTextStyle()}`}>افزودن ارز</span>
				</m.div>
			</LazyMotion>

			<SelectCurrencyModal show={showModal} setShow={setShowModal} />
		</>
	)
}

interface AddCurrencyModalProps {
	show: boolean
	setShow: (show: boolean) => void
}

export function SelectCurrencyModal({ setShow, show }: AddCurrencyModalProps) {
	if (!show) return null
	const { data: supportCurrencies } = useGetSupportCurrencies()

	const { selectedCurrencies, setSelectedCurrencies } = useCurrencyStore()
	const { theme } = useTheme()
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

	const getButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-white bg-green-600 hover:bg-green-700 active:bg-green-800'
			case 'dark':
				return 'text-gray-100 bg-green-700 hover:bg-green-800 active:bg-green-900'
			default: // glass
				return 'text-white bg-green-700/80 hover:bg-green-700 active:bg-green-800'
		}
	}

	const getBoxStyle = (isSelected: boolean) => {
		const baseStyle =
			'p-3 rounded-xl border transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center gap-1'

		if (isSelected) {
			switch (theme) {
				case 'light':
					return `${baseStyle} bg-green-50 border-green-300 text-green-700 shadow-sm`
				case 'dark':
					return `${baseStyle} bg-green-900/30 border-green-600/60 text-green-400 shadow-md`
				default: // glass
					return `${baseStyle} bg-green-700/20 border-green-500/50 text-white backdrop-blur-sm shadow-md`
			}
		}

		switch (theme) {
			case 'light':
				return `${baseStyle} bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:shadow-sm`
			case 'dark':
				return `${baseStyle} bg-gray-800/50 border-gray-700/60 hover:bg-gray-700/40 text-gray-300 hover:shadow-md`
			default: // glass
				return `${baseStyle} bg-black/10 border-gray-500/20 hover:bg-black/20 text-gray-200 backdrop-blur-sm hover:shadow-md`
		}
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
								<h3
									className={`text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}
								>
									{group.label}
								</h3>
								<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
									{group.options.map((option) => {
										const isSelected = selectedCurrencies.includes(option.value)

										return (
											<m.div
												key={option.value}
												className={getBoxStyle(isSelected)}
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
							className={`px-6 w-64 py-2.5 transition-colors duration-200 rounded-xl cursor-pointer font-medium text-sm ${getButtonStyle()}`}
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

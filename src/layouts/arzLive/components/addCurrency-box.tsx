import { motion } from 'framer-motion'
import { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { TiPlus } from 'react-icons/ti'
import Modal from '@/components/modal'
import { MultiSelectDropdown } from '@/components/selectBox/multiSelectDropdown.component'
import { useCurrencyStore } from '@/context/currency.context'
import { useTheme } from '@/context/theme.context'

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
	supportCurrencies: SupportedCurrencies
	disabled?: boolean
	loading?: boolean
	theme: string
}

export const AddCurrencyBox = ({
	supportCurrencies,
	disabled,
	loading,
	theme,
}: AddCurrencyBoxProps) => {
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
				return 'bg-black/40'
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
			<motion.div
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
				className={`flex items-center gap-2 p-2 duration-200 rounded-lg backdrop-blur-sm shadow-lg transition-all cursor-pointer ${getBoxStyle()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
				onClick={() => !disabled && setShowModal(true)}
				initial={false}
				animate={{
					border: disabled ? '' : '1px solid rgba(161, 161, 170, 0.2)',
				}}
			>
				<motion.div
					className={`flex items-center justify-center w-6 h-6 rounded-full ${getCircleStyle()}`}
					whileHover={{ rotate: 90 }}
					transition={{ type: 'spring', stiffness: 300 }}
				>
					{loading ? (
						<AiOutlineLoading className={`w-6 h-6 animate-spin ${getTextStyle()}`} />
					) : (
						<TiPlus className={`w-4 h-4 ${getTextStyle()}`} />
					)}
				</motion.div>
				<span className={`text-sm ${getTextStyle()}`}>افزودن ارز</span>
			</motion.div>

			<SelectCurrencyModal
				show={showModal}
				setShow={setShowModal}
				supportCurrencies={supportCurrencies}
			/>
		</>
	)
}

interface AddCurrencyModalProps {
	show: boolean
	setShow: (show: boolean) => void
	supportCurrencies: SupportedCurrencies
}

export function SelectCurrencyModal({
	setShow,
	show,
	supportCurrencies,
}: AddCurrencyModalProps) {
	const { selectedCurrencies, setSelectedCurrencies } = useCurrencyStore()
	const { theme } = useTheme()

	const onClose = () => setShow(false)

	function onCurrencyChange(values: string[]) {
		setSelectedCurrencies([])
		setSelectedCurrencies(values)
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

	return (
		<Modal isOpen={show} onClose={onClose} size="sm" title="افزودن ارز" direction="rtl">
			<div className="w-full">
				<div>
					<MultiSelectDropdown
						options={getCurrencyOptions(supportCurrencies) as any}
						values={getSelectedCurrencies(selectedCurrencies, supportCurrencies)}
						onChange={(values) => onCurrencyChange(values.map((item) => item.value))}
						placeholder={'جستجو ...'}
					/>
				</div>

				<div className="flex justify-center w-full mt-3">
					<button
						onClick={onClose}
						type="button"
						className={`p-2 transition-colors duration-300 rounded cursor-pointer w-100 ${getButtonStyle()}`}
					>
						تایید
					</button>
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

function getSelectedCurrencies(
	selected: string[],
	list: SupportedCurrencies,
): { value: string; label: string }[] {
	return selected.map((key) => ({
		value: key,
		label: list.find((item) => item.key === key)?.label?.fa || '',
	}))
}

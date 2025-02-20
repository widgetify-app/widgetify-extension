import { motion } from 'motion/react'
import { useContext, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { TiPlus } from 'react-icons/ti'
import Modal from '../../../components/modal'
import { MultiSelectDropdown } from '../../../components/selectBox/multiSelectDropdown.component'
import { storeContext } from '../../../context/setting.context'

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
}

export const AddCurrencyBox = ({
	supportCurrencies,
	disabled,
	loading,
}: AddCurrencyBoxProps) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<motion.div
				whileHover={disabled ? {} : { scale: 1.02 }}
				whileTap={disabled ? {} : { scale: 0.98 }}
				className={`flex items-center justify-center h-24 p-3 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 shadow-lg transition-all cursor-pointer
          ${
						disabled
							? 'opacity-50 cursor-not-allowed'
							: 'hover:shadow-xl hover:bg-opacity-90'
					}`}
				onClick={() => !disabled && setShowModal(true)}
			>
				<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
					{loading ? (
						<AiOutlineLoading className="w-6 h-6 animate-spin" />
					) : (
						<>
							<TiPlus className="w-6 h-6" />
						</>
					)}
				</div>
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
	const { selectedCurrencies, setSelectedCurrencies } = useContext(storeContext)

	const onClose = () => setShow(false)

	function onCurrencyChange(values: string[]) {
		setSelectedCurrencies([])
		setSelectedCurrencies(values)
	}

	return (
		<Modal isOpen={show} onClose={onClose} size="sm" title="افزودن ارز" direction="rtl">
			<div className="w-full" dir="rtl">
				<div>
					<MultiSelectDropdown
						options={getCurrencyOptions(supportCurrencies) as any}
						values={getSelectedCurrencies(selectedCurrencies, supportCurrencies)}
						onChange={(values) => onCurrencyChange(values)}
						placeholder={'جستجو ...'}
					/>
				</div>

				<div className="flex justify-center w-full mt-3">
					<button
						onClick={onClose}
						type="button"
						className="p-2 text-white transition-colors duration-300 bg-green-600 rounded cursor-pointer hover:bg-green-700 active:bg-green-800 dark:text-gray-100 dark:bg-green-700 dark:hover:bg-green-800 dark:active:bg-green-900 w-100"
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
		// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
		label: list.find((item) => item.key == key)?.label?.fa || '',
	}))
}

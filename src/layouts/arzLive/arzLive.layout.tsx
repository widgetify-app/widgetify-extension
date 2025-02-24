import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useStore } from '../../context/store.context'
import { useGetSupportCurrencies } from '../../services/getMethodHooks/getSupportCurrencies.hook'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'

export function ArzLiveLayout() {
	const { data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useStore()
	const [isExpanded, setIsExpanded] = useState(false)

	const ITEM_HEIGHT = 48
	const DEFAULT_VISIBLE_ITEMS = 6
	const totalItems = selectedCurrencies.length + 1
	const showExpandButton = totalItems > DEFAULT_VISIBLE_ITEMS

	const containerVariants = {
		collapsed: { height: ITEM_HEIGHT * DEFAULT_VISIBLE_ITEMS },
		expanded: { height: ITEM_HEIGHT * totalItems },
	}

	return (
		<div className="relative">
			<motion.div
				variants={containerVariants}
				animate={isExpanded ? 'expanded' : 'collapsed'}
				initial="collapsed"
				className="flex flex-col gap-1 px-2 py-2 rounded-2xl bg-neutral-900/70 backdrop-blur-sm min-h-80"
				style={{ overflow: 'hidden' }}
				transition={{ type: 'spring', damping: 20, stiffness: 100 }}
			>
				{selectedCurrencies.map((currency, index) => (
					<CurrencyBox key={index} code={currency} />
				))}
				<AddCurrencyBox supportCurrencies={data || []} />
			</motion.div>

			{showExpandButton && (
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="absolute p-1 text-gray-400 transition-colors translate-x-1/2 rounded-full bottom-1 right-1/2 bg-neutral-800/50 hover:bg-neutral-700/50"
				>
					{isExpanded ? (
						<FiChevronUp className="w-4 h-4" />
					) : (
						<FiChevronDown className="w-4 h-4" />
					)}
				</button>
			)}
		</div>
	)
}

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useCurrencyStore } from '@/context/currency.context'
import { useTheme } from '@/context/theme.context'
import { useGetSupportCurrencies } from '@/services/getMethodHooks/getSupportCurrencies.hook'
import { AddCurrencyBox } from './components/addCurrency-box'
import { CurrencyBox } from './components/currency-box'

export function ArzLiveLayout() {
	const { data } = useGetSupportCurrencies()
	const { selectedCurrencies } = useCurrencyStore()
	const { theme, themeUtils } = useTheme()
	const [isExpanded, setIsExpanded] = useState(false)

	const ITEM_HEIGHT = 48
	const DEFAULT_VISIBLE_ITEMS = 6
	const totalItems = selectedCurrencies.length + 1
	const showExpandButton = totalItems > DEFAULT_VISIBLE_ITEMS

	const containerVariants = {
		collapsed: { height: ITEM_HEIGHT * DEFAULT_VISIBLE_ITEMS },
		expanded: { height: ITEM_HEIGHT * totalItems },
	}

	const getExpandButtonStyle = () => {
		switch (theme) {
			case 'light':
				return 'text-gray-600 bg-gray-300/50 hover:bg-gray-400/50'
			case 'dark':
				return 'text-gray-400 bg-neutral-800/50 hover:bg-neutral-700/50'
			default: // glass
				return 'text-gray-300 bg-black/30 hover:bg-black/40'
		}
	}

	return (
		<div className="relative">
			<motion.div
				variants={containerVariants}
				animate={isExpanded ? 'expanded' : 'collapsed'}
				initial="collapsed"
				className={`flex flex-col gap-1 px-2 py-2 rounded-2xl min-h-80 ${themeUtils.getCardBackground()}`}
				style={{ overflow: 'hidden' }}
				transition={{
					type: 'spring',
					damping: 25,
					stiffness: 120,
					mass: 0.5,
				}}
			>
				{selectedCurrencies.map((currency, index) => (
					<motion.div
						key={`${currency}-${index}`}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<CurrencyBox code={currency} />
					</motion.div>
				))}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.2 }}
				>
					<AddCurrencyBox supportCurrencies={data || []} theme={theme} />
				</motion.div>
			</motion.div>

			{showExpandButton && (
				<motion.button
					onClick={() => setIsExpanded(!isExpanded)}
					className={`absolute p-1 transition-colors translate-x-1/2 rounded-full bottom-1 right-1/2 ${getExpandButtonStyle()}`}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					>
						{isExpanded ? (
							<FiChevronUp className="w-4 h-4" />
						) : (
							<FiChevronDown className="w-4 h-4" />
						)}
					</motion.div>
				</motion.button>
			)}
		</div>
	)
}

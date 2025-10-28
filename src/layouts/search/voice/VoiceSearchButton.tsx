import { useState } from 'react'
import { MdKeyboardVoice } from 'react-icons/md'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import Tooltip from '@/components/toolTip'
import { VoiceSearchModal } from './VoiceSearchModal'

interface VoiceSearchButtonProps {
	onSearch?: (query: string) => void
	className?: string
}

export function VoiceSearchButton({ onSearch, className = '' }: VoiceSearchButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const handleClick = () => {
		setIsModalOpen(true)
		Analytics.event('voice_search_button_clicked')
	}

	return (
		<>
			<Tooltip content="جستجوی گفتاری">
				<Button
					size="md"
					onClick={handleClick}
					className={`h-9 w-9 !p-0 shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-base-300 ${className}`}
				>
					<MdKeyboardVoice size={16} />
				</Button>
			</Tooltip>

			<VoiceSearchModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSearch={onSearch}
			/>
		</>
	)
}

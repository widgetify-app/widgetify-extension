import { useState } from 'react'
import Analytics from '@/analytics'
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
				<div
					onClick={handleClick}
					className={`h-9 w-9 !p-0  shrink-0 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 opacity-80 hover:opacity-100 hover:bg-base-300 ${className}`}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z"
							fill="#4285F4"
						/>
						<path
							d="M7 11C7 13.76 9.24 16 12 16V14C10.34 14 9 12.66 9 11H7Z"
							fill="#EA4335"
						/>
						<path
							d="M17 11H15C15 12.66 13.66 14 12 14V16C14.76 16 17 13.76 17 11Z"
							fill="#FBBC04"
						/>
						<path
							d="M12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17C17 13.76 14.76 16 12 16Z"
							fill="#34A853"
						/>
					</svg>
				</div>
			</Tooltip>

			<VoiceSearchModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSearch={onSearch}
			/>
		</>
	)
}

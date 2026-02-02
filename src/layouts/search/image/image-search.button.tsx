import Analytics from '@/analytics'
import Tooltip from '@/components/toolTip'

export function ImageSearchButton({ onClick }: { onClick: () => void }) {
	const onClickHandle = () => {
		Analytics.event('searchbox_open_image_search')
		onClick()
	}

	return (
		<Tooltip content="جستجوی با تصویر">
			<button
				type="button"
				onClick={() => onClickHandle()}
				className="relative flex items-center justify-center transition-colors rounded-full cursor-pointer h-9 w-9 hover:bg-base-300 shrink-0"
			>
				<svg
					className="w-6 h-6 transition-colors text-base-content/50"
					viewBox="0 -960 960 960"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="currentColor"
						d="M480-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm240 160q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160Zm-440 40q-66 0-113-47t-47-113v-80h80v80q0 33 23.5 56.5T280-200h200v80H280Zm480-320v-160q0-33-23.5-56.5T680-680H280q-33 0-56.5 23.5T200-600v120h-80v-120q0-66 47-113t113-47h80l40-80h160l40 80h80q66 0 113 47t47 113v160h-80Z"
					/>
				</svg>
			</button>
		</Tooltip>
	)
}

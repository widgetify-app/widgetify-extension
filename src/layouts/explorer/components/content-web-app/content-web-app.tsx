import { NewBadge } from '@/components/badges/new.badge'
import type { CatalogItem } from '../../interfaces/catalog-item.interface'
import { useState } from 'react'
import { WebAppModal } from './content-web-app.modal'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

interface Prop {
	content: CatalogItem
}

export function RenderWebApp({ content }: Prop) {
	const [showModal, setShowModal] = useState(false)
	const handleConnect = () => {
		setShowModal(true)
	}

	const badge = content.badge?.trim()
	const col = content?.span?.col
	const row = content?.span?.row
	const pos = row && row >= 2 ? 'justify-center' : ''

	return (
		<>
			<div
				className={`relative flex flex-col items-center gap-1 transition-all duration-500 group active:scale-95 ${pos} rounded-2xl hover:bg-base-300 group-hover:shadow-sm p-0.5 cursor-pointer ${
					content.hasBorder
						? 'border-r border-l border-b border-base-300 hover:border-none'
						: ''
				}`}
				style={{
					gridColumn: col ? `span ${col} / span ${col}` : undefined,
					gridRow: row ? `span ${row} / span ${row}` : undefined,
				}}
				onClick={handleConnect}
			>
				{content.isNew && <NewBadge className="top-2 right-1" />}

				{badge && (
					<span
						className="absolute top-0 -left-1 rounded-r-lg text-center z-20 truncate px-1 text-[10px] font-light max-w-20 border border-white/10 shadow-lg"
						style={{
							backgroundColor: content.badgeColor,
							color: '#fff',
						}}
					>
						{badge}
					</span>
				)}

				<div className="relative flex items-center justify-center w-10 h-10 rounded-xl group-hover:scale-105">
					<img
						src={content.icon}
						className="object-contain rounded-md min-w-6 min-h-6 max-w-6 max-h-6"
						alt={content.name || content.url}
					/>
					<HiOutlineSquares2X2 className="absolute bottom-0 right-0 w-3 h-3 rounded-full text-primary bg-base-100" />
				</div>

				<span className="text-[10px] text-center truncate opacity-80 group-hover:opacity-100">
					{content.name}
				</span>
			</div>

			{showModal && (
				<WebAppModal
					content={content}
					showModal={showModal}
					onClose={() => setShowModal(false)}
				/>
			)}
		</>
	)
}

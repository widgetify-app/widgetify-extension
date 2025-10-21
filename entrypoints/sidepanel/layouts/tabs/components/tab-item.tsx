import { AiFillHeart } from 'react-icons/ai'
import { FiHeart, FiRefreshCw, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi'
import Tooltip from '@/components/toolTip'
import type { Tab } from '../../../types/tab.types'

interface TabItemProps {
	tab: Tab
	onSwitch: (tabId: number) => void
	onClose: (tabId: number, e: React.MouseEvent) => void
	onReload: (tabId: number, e: React.MouseEvent) => void
	onToggleMute: (tabId: number, muted: boolean, e: React.MouseEvent) => void
	onToggleFavorite?: (tabId: number, e: React.MouseEvent) => void
	isFavorite: boolean
}

export function TabItem({
	tab,
	onSwitch,
	onClose,
	onReload,
	onToggleMute,
	isFavorite,
	onToggleFavorite,
}: TabItemProps) {
	return (
		<div
			onClick={() => onSwitch(tab.id)}
			className={`group flex items-center gap-3 p-2 mb-1 cursor-pointer transition-all rounded-2xl border ${
				tab.active
					? 'bg-primary/50 border-base-300 shadow-sm'
					: 'bg-content hover:bg-base-200 border-content shadow-xs hover:border-base-300'
			}`}
		>
			<div className="flex-shrink-0">
				{tab.favIconUrl ? (
					<img
						src={tab.favIconUrl}
						alt=""
						className="w-4 h-4 max-w-4 max-h-4"
						onError={(e) => {
							;(e.target as HTMLImageElement).style.display = 'none'
						}}
					/>
				) : (
					<div className="flex items-center justify-center w-4 h-4 text-xs rounded-sm bg-base-300">
						{tab.title.charAt(0).toUpperCase()}
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<div
					className={`text-sm font-medium truncate ${
						tab.active ? 'text-content' : 'text-base-content/80'
					}`}
				>
					{tab.title}
				</div>
			</div>

			<div
				className={`flex items-center flex-shrink-0 gap-1 transition-opacity ${
					tab.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
				}`}
			>
				{tab.audible && (
					<Tooltip content={tab.muted ? 'رفع سکوت' : 'سکوت'}>
						<button
							onClick={(e) => onToggleMute(tab.id, tab.muted, e)}
							className="p-1 transition-colors rounded cursor-pointer hover:bg-base-300"
						>
							{tab.muted ? (
								<FiVolumeX className="text-xs" />
							) : (
								<FiVolume2 className="text-xs" />
							)}
						</button>
					</Tooltip>
				)}
				<Tooltip
					content={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
				>
					<button
						className="p-1 transition-colors rounded cursor-pointer hover:bg-error/20 hover:!text-error text-content"
						onClick={
							onToggleFavorite
								? (e) => onToggleFavorite(tab.id, e)
								: undefined
						}
					>
						{isFavorite ? (
							<AiFillHeart className="text-xs text-red-500" />
						) : (
							<FiHeart className="text-xs" />
						)}
					</button>
				</Tooltip>
				<Tooltip content="بارگذاری مجدد">
					<button
						onClick={(e) => onReload(tab.id, e)}
						className="p-1 transition-colors rounded cursor-pointer hover:bg-base-300 text-content"
					>
						<FiRefreshCw className="text-xs" />
					</button>
				</Tooltip>
				<Tooltip content="بستن تب">
					<button
						onClick={(e) => onClose(tab.id, e)}
						className="p-1 transition-colors rounded cursor-pointer hover:bg-error/20 hover:!text-error text-content"
						title="بستن تب"
					>
						<FiX className="text-xs" />
					</button>
				</Tooltip>
			</div>
		</div>
	)
}

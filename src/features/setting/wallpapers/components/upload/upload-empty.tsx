import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { Spinner, Tooltip } from '@/components/ui'
import { Icon } from '@/icons'
import { ProTooltipContent } from './pro-tooltip'

interface UploadEmptyProps {
	isDragging: boolean
	isUploading: boolean
	isVip: boolean
	vipMaxSize: number
	freeMaxSize: number
	onFileSelect: () => void
	onDragOver: (e: React.DragEvent) => void
	onDragLeave: (e: React.DragEvent) => void
	onDrop: (e: React.DragEvent) => void
}

export function UploadEmpty({
	isDragging,
	isUploading,
	isVip,
	vipMaxSize,
	freeMaxSize,
	onFileSelect,
	onDragOver,
	onDragLeave,
	onDrop,
}: UploadEmptyProps) {
	return (
		<div className="relative">
			<button
				type="button"
				disabled={isUploading}
				onClick={onFileSelect}
				onDragOver={onDragOver}
				onDragEnter={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				className={cn(
					'flex flex-col items-center justify-center w-full gap-1.5 p-3 text-center border-2 border-dashed cursor-pointer aspect-video rounded-2xl transition-ui focus-visible:focus-ring disabled:cursor-wait',
					isDragging
						? 'border-brand bg-brand-fill text-brand'
						: 'border-line bg-fill text-fg-muted hover:border-brand-muted hover:bg-brand-fill hover:text-brand'
				)}
			>
				{isUploading ? (
					<Spinner aria-hidden="true" />
				) : (
					<Icon name="uploadImage" size={24} />
				)}
				<span className="text-xs font-semibold text-fg">
					{isDragging
						? 'رهاش کن'
						: isUploading
							? 'داریم آپلودش می‌کنیم...'
							: isVip
								? 'عکس یا ویدیوی خودت'
								: 'عکس خودت'}
				</span>
				<span className="text-3xs text-fg-faint">
					{isVip
						? `عکس، گیف یا ویدیو تا ${vipMaxSize} مگابایت`
						: `تا ${freeMaxSize} مگابایت، روی همین مرورگر`}
				</span>
			</button>

			{!isVip && (
				<Tooltip
					content={<ProTooltipContent vipMaxSize={vipMaxSize} />}
					position="top"
					className="absolute top-2 end-2"
				>
					<button
						type="button"
						onClick={() => callEvent('openSettings', 'vip')}
						className="inline-flex items-center h-6 gap-1 px-2 font-bold border rounded-lg cursor-pointer text-3xs text-vip bg-vip-fill border-vip-fill-2 hover:bg-vip-fill-2 transition-ui focus-visible:focus-ring"
					>
						<Icon name="diamond" size={12} />
						ویدیو با پرو
					</button>
				</Tooltip>
			)}
		</div>
	)
}

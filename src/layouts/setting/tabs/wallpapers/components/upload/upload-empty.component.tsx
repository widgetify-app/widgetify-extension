import { Icon } from '@/src/icons'
import { Button, IconLoading, Tooltip } from '@/components/ui'
import { callEvent } from '@/common/utils/call-event'
import { cn } from '@/common/utils/cn'
import { ProTooltipContent } from './pro-tooltip.component'

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
		<div
			onDragOver={onDragOver}
			onDragEnter={onDragOver}
			onDragLeave={onDragLeave}
			onDrop={onDrop}
			className={cn(
				'relative p-3 overflow-hidden transition-all border shadow-xs rounded-2xl border-content bg-content',
				isDragging && 'border-primary bg-primary/5'
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center min-w-0 gap-3">
					<div
						onClick={onFileSelect}
						className={cn(
							'relative flex items-center justify-center w-24 h-16 overflow-hidden rounded-xl border border-dashed cursor-pointer shrink-0 transition-all group bg-base-200',
							isDragging
								? 'border-primary bg-primary/10 text-primary'
								: 'border-base-content/20 hover:border-primary/50 text-muted hover:text-content'
						)}
					>
						{isUploading ? (
							<IconLoading className="w-5 h-5 text-primary" />
						) : (
							<div className="flex flex-col items-center justify-center gap-0.5">
								<Icon
									name="uploadImage"
									size={18}
									className="transition-transform group-hover:scale-110"
								/>
								<span className="text-[10px] font-medium">
									{isDragging ? 'رهاش کن' : 'آپلود'}
								</span>
							</div>
						)}
					</div>

					<div className="flex flex-col min-w-0 gap-1">
						<p className="text-sm font-bold truncate text-content">
							{isDragging
								? 'فایل رو همین‌جا رها کن'
								: isVip
									? 'انتخاب عکس یا ویدیوی دلخواه'
									: 'انتخاب عکس دلخواه'}
						</p>
						<div className="flex items-center gap-1.5 flex-wrap">
							{isVip ? (
								<>
									<Tooltip
										content={`عکس، گیف و ویدیو تا سقف ${vipMaxSize} مگابایت`}
										position="top"
									>
										<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
											<span>تا {vipMaxSize} مگابایت</span>
										</span>
									</Tooltip>
									<Tooltip
										content="روی سرور ذخیره می‌شه و روی اکانتت ذخیره می‌مونه"
										position="top"
									>
										<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
											<span>همگام سازی با اکانت</span>
										</span>
									</Tooltip>
								</>
							) : (
								<>
									<Tooltip
										content={`عکس تا ${freeMaxSize} مگابایت روی همین مرورگرت ذخیره می‌شه`}
										position="top"
									>
										<span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted bg-base-content/5 px-2 py-0.5 rounded-xl cursor-default">
											فقط عکس (تا {freeMaxSize} مگابایت)
										</span>
									</Tooltip>
									<Tooltip
										content={
											<ProTooltipContent vipMaxSize={vipMaxSize} />
										}
										position="top"
									>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												callEvent('openSettings', 'vip')
											}}
											className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-xl hover:bg-indigo-500/20 active:scale-95 transition-all cursor-pointer"
										>
											<Icon name="crown" size={11} />
											<span>ارتقا به پرو</span>
										</button>
									</Tooltip>
								</>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1.5 shrink-0">
					<Button
						onClick={onFileSelect}
						size="sm"
						rounded="xl"
						variant="outline"
						loading={isUploading}
					>
						<Icon name="uploadImage" size={14} />
						<span>انتخاب فایل</span>
					</Button>
				</div>
			</div>
		</div>
	)
}

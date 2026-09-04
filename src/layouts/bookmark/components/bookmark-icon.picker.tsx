import { showToast } from '@/common/toast'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Icon } from '@/src/icons'
import type React from 'react'
import { useRef, useState } from 'react'
import { PopoverMenu, PopoverMenuItem, PopoverMenuDivider } from '@/components/ui'
import { GalleryPickerModal } from '@/components/gallery/gallery-picker-modal'
import type { GalleryAsset } from '@/services/hooks/gallery/get-gallery-assets.hook'

type Props = {
	value: File | string | null
	url?: string | null
	onChange: (value: File | string | null) => void
	size?: 'md' | 'lg'
}

export function BookmarkIconPicker({ value, url, onChange, size = 'md' }: Props) {
	const triggerRef = useRef<HTMLButtonElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isGalleryOpen, setIsGalleryOpen] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [error, setError] = useState(false)

	const openPicker = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsMenuOpen(true)
	}

	const handleFile = (file?: File) => {
		if (!file || !file.type.startsWith('image/'))
			return showToast('فرمت فایل نامعتبر است', 'error')
		if (file.size > 250 * 1024) {
			return showToast('حجم فایل آیکون نباید بیشتر از ۲۵۰ کیلوبایت باشد', 'error')
		}
		setError(false)
		onChange(file)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		handleFile(e.dataTransfer.files?.[0])
	}

	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleFile(e.target.files?.[0])
	}

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onChange(null)
		setError(false)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleGallerySelect = (asset: GalleryAsset) => {
		setIsGalleryOpen(false)
		setError(false)
		onChange(asset.url)
	}

	const isFile = value instanceof File
	let iconSrc: string | null = null
	if (value && isFile) {
		iconSrc = URL.createObjectURL(value)
	} else if (typeof value === 'string' && value) {
		iconSrc = value
	} else if (url && url !== 'null') {
		iconSrc = getFaviconFromUrl(url || '')
	}

	const isLarge = size === 'lg'
	const containerSizeClasses = isLarge
		? 'w-16 h-16 rounded-2xl'
		: 'w-12 h-12 rounded-xl'

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				accept="image/*"
				onChange={handleUpload}
			/>

			<div className="relative inline-flex group">
				<button
					ref={triggerRef}
					type="button"
					onClick={openPicker}
					onDragOver={(e) => {
						e.preventDefault()
						setIsDragging(true)
					}}
					onDragLeave={() => setIsDragging(false)}
					onDrop={handleDrop}
					className={`relative shrink-0 flex items-center justify-center cursor-pointer border-2 transition-all duration-200 ${containerSizeClasses} ${
						isDragging
							? 'border-primary bg-primary/10 shadow-lg'
							: 'border-base-content/15 hover:border-primary/50 bg-base-200/80 hover:bg-base-200'
					}`}
					title="انتخاب یا تغییر آیکون"
				>
					{iconSrc && !error ? (
						<img
							src={iconSrc}
							alt="icon"
							className={`w-full h-full object-contain p-2 transition-transform duration-200 group-hover:scale-105 ${
								isLarge ? 'rounded-xl' : 'rounded-lg'
							}`}
							onError={() => setError(true)}
						/>
					) : (
						<Icon
							name="image"
							size={isLarge ? 24 : 18}
							className="transition-colors text-muted group-hover:text-primary"
						/>
					)}

					<div
						className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 opacity-0 group-hover:opacity-100 bg-base-300/80 ${
							isLarge ? 'rounded-2xl' : 'rounded-xl'
						}`}
					>
						<Icon
							name="brush"
							size={isLarge ? 20 : 16}
							className="text-content"
						/>
					</div>
				</button>

				{Boolean(value) && (
					<button
						type="button"
						onClick={handleRemove}
						className="absolute -top-1 -right-1 flex items-center justify-center w-4.5 h-4.5 rounded-full bg-error text-white text-[10px] leading-none shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer z-10 border border-base-200"
						title="حذف آیکون"
					>
						<span className="mb-0.5">✕</span>
					</button>
				)}
			</div>

			<PopoverMenu
				isOpen={isMenuOpen}
				onClose={() => setIsMenuOpen(false)}
				triggerRef={triggerRef}
				width={190}
				placement="bottom-start"
			>
				<PopoverMenuItem
					icon={<Icon name="uploadImage" size={14} />}
					label="بارگذاری از دستگاه"
					onClick={() => {
						setIsMenuOpen(false)
						if (fileInputRef.current) {
							fileInputRef.current.value = ''
							fileInputRef.current.click()
						}
					}}
				/>
				<PopoverMenuItem
					icon={<Icon name="brush" size={14} />}
					label="انتخاب از گالری"
					onClick={() => {
						setIsMenuOpen(false)
						setIsGalleryOpen(true)
					}}
				/>
				{Boolean(value) && (
					<>
						<PopoverMenuDivider />
						<PopoverMenuItem
							icon={<Icon name="trash" size={14} />}
							label="حذف آیکون"
							variant="danger"
							onClick={() => {
								setIsMenuOpen(false)
								handleRemove({
									preventDefault: () => {},
									stopPropagation: () => {},
								} as any)
							}}
						/>
					</>
				)}
			</PopoverMenu>

			{isGalleryOpen && (
				<GalleryPickerModal
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
					type="BOOKMARK_ICON"
					title="گالری آیکون بوکمارک"
					onSelect={handleGallerySelect}
				/>
			)}
		</>
	)
}

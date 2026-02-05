import { useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { FiChevronUp } from 'react-icons/fi'
import { LuX } from 'react-icons/lu'
import type { BookmarkType } from '../types/bookmark.types'
import { showToast } from '@/common/toast'
import { HiOutlineBookmark, HiOutlineFolder } from 'react-icons/hi2'
import { TabNavigation } from '@/components/tab-navigation'

export type IconSourceType = 'auto' | 'upload' | 'url'

export function IconSourceSelector({
	iconSource,
	setIconSource,
}: {
	iconSource: IconSourceType
	setIconSource: (source: IconSourceType) => void
	theme?: string
}) {
	return (
		<TabNavigation<IconSourceType>
			size="small"
			tabs={[
				{ id: 'auto', label: 'آیکون خودکار' },
				{ id: 'upload', label: 'آپلود آیکون' },
			]}
			activeTab={iconSource}
			onTabClick={(tab) => setIconSource(tab)}
		/>
	)
}

export function TypeSelector({
	type,
	setType,
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
}) {
	return (
		<TabNavigation<BookmarkType>
			className="w-full!"
			size="small"
			tabs={[
				{
					id: 'BOOKMARK',
					label: 'بوکمارک',
					icon: <HiOutlineBookmark size={14} />,
				},
				{ id: 'FOLDER', label: 'پوشه', icon: <HiOutlineFolder size={14} /> },
			]}
			activeTab={type}
			onTabClick={(tab) => setType(tab)}
		/>
	)
}

export function useBookmarkIcon() {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)

	const renderIconPreview = (
		icon: string | File | null,
		iconSource: IconSourceType,
		setIconSource: (source: IconSourceType) => void,
		cb: (value: File | null) => void
	) => {
		const handlePreviewClick = () => {
			if (iconSource === 'upload') {
				fileInputRef.current?.click()
			}
		}

		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			cb(null)
			setIconSource('auto')
		}

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(true)
		}

		const handleDragLeave = () => {
			setIsDragging(false)
		}

		const handleDrop = (e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)

			const file = e.dataTransfer.files[0]
			if (!file || !file.type.startsWith('image/')) return
			cb(file)
			setIconSource('upload')
		}
		if (icon && typeof icon !== 'string') {
			return (
				<div
					className="relative flex flex-col items-center justify-center w-12 h-12 p-2 cursor-pointer group"
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={URL.createObjectURL(icon)}
						alt="Custom"
						className="object-cover w-full h-full transition-opacity rounded-md group-hover:opacity-75"
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>
					<button
						onClick={handleRemoveCustomImage}
						className="absolute top-0 right-0 z-10 flex items-center justify-center w-5 h-5 rounded-full cursor-pointer bg-base-300 hover:bg-red-400/20"
					>
						<LuX size={12} className="text-red-400" />
					</button>
				</div>
			)
		}

		if (icon) {
			return (
				<div
					className={`relative w-12 h-12 cursor-pointer group ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={icon}
						alt="Favicon"
						className={`object-contain w-full  h-full p-2 transition-opacity border rounded-md border-content group-hover:opacity-75 ${iconLoadError ? 'opacity-30' : ''}`}
						onError={() => {
							cb(null)
							setIconLoadError(true)
						}}
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>

					{iconLoadError && (
						<div className="absolute bottom-[-20px] left-0 right-0 text-center">
							<span className="text-xs text-yellow-500">
								آیکون بارگذاری نشد
							</span>
						</div>
					)}
				</div>
			)
		}

		return (
			<div
				className={`relative flex flex-col items-center justify-center w-12 h-12 p-2 transition-colors border-2 border-dashed rounded-xl cursor-pointer ${
					iconSource === 'auto'
						? '!cursor-not-allowed border-base-300/60'
						: isDragging
							? 'border-blue-400 bg-blue-50/10'
							: 'border-content hover:bg-neutral-800/50'
				}`}
				onClick={handlePreviewClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<FaImage
					className={`w-4 h-4 mb-1  ${iconSource === 'auto' ? 'text-muted' : 'text-content'}`}
				/>
			</div>
		)
	}
	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		cb: (icon: File | null) => void,
		setIconSource: (source: IconSourceType) => void
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			showToast('لطفاً فقط فایل تصویری آپلود کنید', 'error')
			return
		}

		cb(file)
		setIconSource('upload')
	}

	return {
		fileInputRef,
		isDragging,
		iconLoadError,
		setIconLoadError,
		renderIconPreview,
		handleImageUpload,
	}
}

interface ShowAdvancedButtonProps {
	showAdvanced: boolean
	setShowAdvanced: (show: boolean) => void
}
export function ShowAdvancedButton({
	setShowAdvanced,
	showAdvanced,
}: ShowAdvancedButtonProps) {
	return (
		<button
			type="button"
			onClick={() => setShowAdvanced(!showAdvanced)}
			className={
				'bg-base-300 hover:bg-base-300/70 border border-base-300/70 flex items-center gap-1 px-3 py-1 text-sm font-medium transition-all duration-200 cursor-pointer text-content rounded-xl active:scale-95'
			}
		>
			<span>{showAdvanced ? 'گزینه‌های کمتر' : 'گزینه‌های بیشتر'}</span>
			<FiChevronUp
				size={16}
				className={`transition-all duration-300 ${showAdvanced ? 'rotate-0' : 'rotate-180'}`}
			/>
		</button>
	)
}

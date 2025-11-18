import { useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { FiChevronUp } from 'react-icons/fi'
import { LuX } from 'react-icons/lu'
import type { BookmarkType } from '../types/bookmark.types'
import type {
	AddBookmarkUpdateFormData,
	BookmarkFormFields,
} from './modal/add-bookmark.modal'
import toast from 'react-hot-toast'

export type IconSourceType = 'auto' | 'upload' | 'url'

export function IconSourceSelector({
	iconSource,
	setIconSource,
}: {
	iconSource: IconSourceType
	setIconSource: (source: IconSourceType) => void
	theme?: string
}) {
	const getButtonStyle = (isActive: boolean) => {
		if (isActive) {
			return 'bg-primary text-white'
		}

		return 'text-content'
	}

	return (
		<div className="w-fit p-1 flex justify-center gap-1 rounded-2xl text-[10px] bg-base-300">
			<div
				onClick={() => setIconSource('auto')}
				className={`px-3 py-1 cursor-pointer rounded-xl transition-all duration-300 ${getButtonStyle(iconSource === 'auto')}`}
			>
				آیکون خودکار
			</div>
			<div
				onClick={() => setIconSource('upload')}
				className={`px-3 py-1 cursor-pointer rounded-xl transition-all duration-300 ${getButtonStyle(iconSource === 'upload')}`}
			>
				آپلود آیکون
			</div>
		</div>
	)
}

export function TypeSelector({
	type,
	setType,
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
	theme?: string
}) {
	return (
		<>
			<button
				type="button"
				onClick={() => setType('BOOKMARK')}
				className={`flex-1 py-1.5 cursor-pointer rounded-xl transition-colors duration-300 active:scale-95 ${
					type === 'BOOKMARK'
						? 'bg-primary text-white/85'
						: 'bg-base-300 text-content'
				}`}
			>
				بوکمارک
			</button>
			<button
				type="button"
				onClick={() => setType('FOLDER')}
				className={`flex-1 py-1.5 cursor-pointer rounded-xl transition-colors duration-300 active:scale-95 ${
					type === 'FOLDER'
						? 'bg-primary text-white/85'
						: 'bg-base-300 text-content'
				}`}
			>
				پوشه
			</button>
		</>
	)
}

export function useBookmarkIcon() {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)

	const renderIconPreview = (
		formData: BookmarkFormFields,
		iconSource: IconSourceType,
		setIconSource: (source: IconSourceType) => void,
		updateFormData: <K extends keyof BookmarkFormFields>(
			key: K,
			value: BookmarkFormFields[K]
		) => void,
		type: BookmarkType
	) => {
		const handlePreviewClick = () => {
			if (iconSource === 'upload') {
				fileInputRef.current?.click()
			}
		}

		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			updateFormData('icon', null)
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
			updateFormData('icon', file)
			setIconSource('upload')
		}

		if (formData.icon) {
			return (
				<div
					className="relative flex flex-col items-center justify-center w-12 h-12 p-2 cursor-pointer group"
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={URL.createObjectURL(formData.icon)}
						alt="Custom"
						className="object-cover w-full h-full transition-opacity rounded-lg group-hover:opacity-75"
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

		if (type === 'BOOKMARK' && formData.icon && iconSource === 'auto') {
			return (
				<div
					className={`relative w-12 h-12 cursor-pointer group ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={formData.icon}
						alt="Favicon"
						className={`object-contain w-full h-full p-2 transition-opacity border rounded-lg border-content group-hover:opacity-75 ${iconLoadError ? 'opacity-30' : ''}`}
						onError={() => {
							updateFormData('icon', null)
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
		updateFormData: AddBookmarkUpdateFormData,
		setIconSource: (source: IconSourceType) => void
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('لطفاً فقط فایل تصویری آپلود کنید')
			return
		}

		updateFormData('icon', file)
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

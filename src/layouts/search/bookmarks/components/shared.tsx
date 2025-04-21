import { getFaviconFromUrl } from '@/common/utils/icon'
import { useTheme } from '@/context/theme.context'
import { useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import type { BookmarkType } from '../types/bookmark.types'

export type IconSourceType = 'auto' | 'upload' | 'url'

export interface BookmarkFormData {
	title: string
	url: string
	icon: string
	customImage: string
	customBackground: string
	customTextColor: string
	sticker: string
	touched?: boolean
}

export function getIconPreviewStyle(theme: string) {
	switch (theme) {
		case 'light':
			return 'border-gray-300 hover:bg-gray-100'
		case 'dark':
			return 'border-gray-700 hover:bg-gray-700/50'
		default: // glass
			return 'border-white/10 hover:bg-neutral-800/50'
	}
}

export function IconSourceSelector({
	iconSource,
	setIconSource,
	theme = 'glass',
}: {
	iconSource: IconSourceType
	setIconSource: (source: IconSourceType) => void
	theme?: string
}) {
	const getButtonStyle = (isActive: boolean) => {
		if (isActive) {
			switch (theme) {
				case 'light':
					return 'bg-blue-100 text-blue-700 border-blue-300'
				case 'dark':
					return 'bg-blue-900/30 text-blue-300 border-blue-800'
				default:
					return 'bg-blue-800/20 text-blue-400 border-blue-800/50'
			}
		}

		switch (theme) {
			case 'light':
				return 'bg-gray-100 text-gray-700 border-gray-200'
			case 'dark':
				return 'bg-neutral-800 text-gray-400 border-neutral-700'
			default:
				return 'bg-neutral-800/50 text-gray-500 border-neutral-700/50'
		}
	}

	return (
		<div className="flex justify-center gap-1 mt-1 text-[10px]">
			<button
				type="button"
				onClick={() => setIconSource('auto')}
				className={`px-2 py-1 cursor-pointer border rounded ${getButtonStyle(iconSource === 'auto')}`}
			>
				خودکار
			</button>
			<button
				type="button"
				onClick={() => setIconSource('upload')}
				className={`px-2 py-1 cursor-pointer border rounded ${getButtonStyle(iconSource === 'upload')}`}
			>
				آپلود
			</button>
		</div>
	)
}

export function TypeSelector({
	type,
	setType,
	theme = 'glass',
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
	theme?: string
}) {
	const getActiveStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-500 text-white'
			case 'dark':
				return 'bg-blue-600 text-white'
			default:
				return 'bg-blue-500/80 text-white'
		}
	}

	const getInactiveStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-200 text-gray-700'
			case 'dark':
				return 'bg-neutral-700 text-gray-300'
			default:
				return 'bg-neutral-800 text-gray-400'
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setType('BOOKMARK')}
				className={`flex-1 py-1.5 cursor-pointer rounded-lg transition-colors ${
					type === 'BOOKMARK' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				بوکمارک
			</button>
			<button
				type="button"
				onClick={() => setType('FOLDER')}
				className={`flex-1 py-1.5 cursor-pointer rounded-lg transition-colors ${
					type === 'FOLDER' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				پوشه
			</button>
		</>
	)
}

export function useBookmarkIcon(theme: string) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)

	const renderIconPreview = (
		formData: BookmarkFormData,
		iconSource: IconSourceType,
		setIconSource: (source: IconSourceType) => void,
		updateFormData: (key: string, value: string) => void,
		type: BookmarkType,
	) => {
		const handlePreviewClick = () => fileInputRef.current?.click()

		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			updateFormData('customImage', '')
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

			const reader = new FileReader()
			reader.onloadend = () => {
				const base64String = reader.result as string
				updateFormData('customImage', base64String)
				setIconSource('upload')
			}
			reader.readAsDataURL(file)
		}

		if (formData.customImage) {
			return (
				<div
					className="relative w-12 h-12 mx-auto cursor-pointer group"
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={formData.customImage}
						alt="Custom"
						className="object-cover w-full h-full transition-opacity rounded-lg group-hover:opacity-75"
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>
					<button
						onClick={handleRemoveCustomImage}
						className="absolute z-10 p-1 text-red-400 bg-black rounded-full -top-2 -right-2 hover:text-red-300"
					>
						×
					</button>
				</div>
			)
		}

		if (type === 'BOOKMARK' && formData.icon && iconSource === 'auto') {
			return (
				<div
					className={`relative w-12 h-12 mx-auto cursor-pointer group ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={formData.icon}
						alt="Favicon"
						className={`object-contain w-full h-full p-2 transition-opacity border rounded-lg ${
							theme === 'light' ? 'border-gray-300' : 'border-white/10'
						} group-hover:opacity-75 ${iconLoadError ? 'opacity-30' : ''}`}
						onError={() => {
							try {
								updateFormData('icon', getFaviconFromUrl(formData.url))
								setIconLoadError(true)
							} catch {
								updateFormData('icon', '')
								setIconLoadError(true)
							}
						}}
					/>
					<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
						<FaUpload className="w-4 h-4 text-white" />
					</div>

					{iconLoadError && (
						<div className="absolute bottom-[-20px] left-0 right-0 text-center">
							<span className="text-xs text-yellow-500">آیکون بارگذاری نشد</span>
						</div>
					)}
				</div>
			)
		}

		return (
			<div
				className={`flex flex-col items-center justify-center w-16 h-16 mx-auto transition-colors border-2 border-dashed rounded-lg cursor-pointer ${
					isDragging ? 'border-blue-400 bg-blue-50/10' : getIconPreviewStyle(theme)
				}`}
				onClick={handlePreviewClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<FaImage className="w-6 h-6 mb-1 text-gray-500" />
				<span className="text-xs text-center text-gray-500">آپلود تصویر (اختیاری)</span>
			</div>
		)
	}

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		updateFormData: (key: string, value: string) => void,
		setIconSource: (source: IconSourceType) => void,
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			alert('لطفاً فقط فایل تصویری آپلود کنید')
			return
		}

		const reader = new FileReader()
		reader.onloadend = () => {
			const base64String = reader.result as string
			updateFormData('customImage', base64String)
			setIconSource('upload')
		}
		reader.readAsDataURL(file)
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
	const { themeUtils } = useTheme()
	return (
		<button
			type="button"
			onClick={() => setShowAdvanced(!showAdvanced)}
			className={`flex items-center gap-1 px-2 py-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${themeUtils.getTextColor()} opacity-90 border ${themeUtils.getBorderColor()} rounded-md`}
		>
			{showAdvanced ? (
				<>
					<span>گزینه‌های کمتر</span>
					<FiChevronUp className="w-4 h-4" />
				</>
			) : (
				<>
					<span>گزینه‌های بیشتر</span>
					<FiChevronDown className="w-4 h-4" />
				</>
			)}
		</button>
	)
}

export const getBookmarkStyle = (theme: string) => {
	switch (theme) {
		case 'light':
			return 'bg-white hover:bg-gray-100/95 border-gray-300/30 hover:border-gray-400/50 text-gray-800'
		case 'dark':
			return 'bg-neutral-900  hover:bg-neutral-700/95 border-gray-700/50 hover:border-gray-600/70 text-gray-200'
		default: // glass
			return 'bg-neutral-900/70 backdrop-blur-sm hover:bg-neutral-800/80 border-white/10 hover:border-white/20 text-gray-300'
	}
}

import { getFaviconFromUrl } from '@/common/utils/icon'
import Modal from '@/components/modal'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import type { Bookmark } from '../types/bookmark.types'

interface EditBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (bookmark: Bookmark) => void
	bookmark: Bookmark
	theme?: string
}

export function EditBookmarkModal({
	isOpen,
	onClose,
	onSave,
	bookmark,
	theme = 'glass',
}: EditBookmarkModalProps) {
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [icon, setIcon] = useState('')
	const [customImage, setCustomImage] = useState<string>('')
	const [iconSource, setIconSource] = useState<'auto' | 'upload' | 'url'>('auto')
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [iconLoadError, setIconLoadError] = useState(false)
	const type = bookmark?.type

	useEffect(() => {
		if (bookmark) {
			setTitle(bookmark.title)
			if (bookmark.type === 'BOOKMARK') {
				setUrl(bookmark.url)
				setIcon(bookmark.icon || getFaviconFromUrl(bookmark.url))
			}
			setCustomImage(bookmark.customImage || '')
			setIconSource(bookmark.customImage ? 'upload' : 'auto')
		}
	}, [bookmark])

	const getInputStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-white border border-gray-300 text-gray-800'
			case 'dark':
				return 'bg-neutral-800 border border-neutral-700 text-white'
			default: // glass
				return 'bg-[#1E1E1E] border border-[#333] text-white'
		}
	}

	const getButtonStyle = (primary = false) => {
		if (primary) {
			switch (theme) {
				case 'light':
					return 'bg-blue-500 hover:bg-blue-600 text-white'
				case 'dark':
					return 'bg-blue-600 hover:bg-blue-700 text-white'
				default: // glass
					return 'bg-blue-500/80 hover:bg-blue-500 text-white'
			}
		}

		switch (theme) {
			case 'light':
				return 'border border-gray-300 text-gray-600 hover:bg-gray-100'
			case 'dark':
				return 'border border-gray-700 text-gray-300 hover:bg-gray-700/50'
			default: // glass
				return 'border border-white/10 text-gray-400 hover:bg-white/5'
		}
	}

	const getIconPreviewStyle = () => {
		switch (theme) {
			case 'light':
				return 'border-gray-300 hover:bg-gray-100'
			case 'dark':
				return 'border-gray-700 hover:bg-gray-700/50'
			default: // glass
				return 'border-white/10 hover:bg-neutral-800/50'
		}
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUrl = e.target.value
		setUrl(newUrl)

		if (iconSource === 'auto') {
			setIconLoadError(false)
			setIcon(getFaviconFromUrl(newUrl))
		}
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			alert('لطفاً فقط فایل تصویری آپلود کنید')
			return
		}

		const reader = new FileReader()
		reader.onloadend = () => {
			const base64String = reader.result as string
			setCustomImage(base64String)
			setIconSource('upload')
		}
		reader.readAsDataURL(file)
	}

	const handleSave = async () => {
		if (!title.trim() || !bookmark) return

		let iconUrl: string | undefined = undefined
		if (type === 'BOOKMARK' && iconSource === 'auto' && icon && !customImage) {
			iconUrl = getFaviconFromUrl(url)
		}

		const updatedBookmark = { ...bookmark, title: title.trim(), customImage }

		if (type === 'BOOKMARK') {
			let newUrl = url
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				newUrl = `https://${url}`
			}
			;(updatedBookmark as any).url = newUrl.trim()
			;(updatedBookmark as any).icon = iconUrl || bookmark.icon
		}

		onSave(updatedBookmark)
		onClose()
	}

	const renderIconPreview = () => {
		const handlePreviewClick = () => fileInputRef.current?.click()
		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			setCustomImage('')
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
				setCustomImage(base64String)
				setIconSource('upload')
			}
			reader.readAsDataURL(file)
		}

		if (customImage) {
			return (
				<div
					className="relative w-12 h-12 mx-auto cursor-pointer group"
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={customImage}
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

		if (type === 'BOOKMARK' && icon && iconSource === 'auto') {
			return (
				<div
					className={`relative w-12 h-12 mx-auto cursor-pointer group ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
					onClick={handlePreviewClick}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<img
						src={icon}
						alt="Favicon"
						className={`object-contain w-full h-full p-2 transition-opacity border rounded-lg ${
							theme === 'light' ? 'border-gray-300' : 'border-white/10'
						} group-hover:opacity-75 ${iconLoadError ? 'opacity-30' : ''}`}
						onError={() => {
							try {
								const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
								tryAlternativeFavicons(urlObj.hostname)
								setIconLoadError(true)
							} catch {
								setIcon('')
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
					isDragging ? 'border-blue-400 bg-blue-50/10' : getIconPreviewStyle()
				}`}
				onClick={handlePreviewClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<FaImage className="w-6 h-6 mb-1 text-gray-500" />
				<span className="text-xs text-center text-gray-500">آپلود تصویر</span>
			</div>
		)
	}

	const tryAlternativeFavicons = (hostname: string) => {
		const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
		setIcon(googleFaviconUrl)
	}

	if (!bookmark) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="sm"
			title={`✏️ ویرایش ${type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}`}
			direction="rtl"
			closeOnBackdropClick={false}
		>
			<div className="relative h-full">
				<motion.div className="flex flex-col gap-4 p-4">
					<div className="mb-4">
						<div className="mb-2 text-sm text-center text-gray-500">
							<span className="px-2 py-1 text-blue-400 rounded bg-blue-500/20">
								{type === 'FOLDER' ? 'پوشه' : 'بوکمارک'}
							</span>
						</div>
						{renderIconPreview()}
						<p className="mt-2 text-xs text-center text-gray-500">
							برای آپلود تصویر کلیک کنید یا فایل را بکشید و رها کنید
						</p>
						{type === 'BOOKMARK' && (
							<IconSourceSelector
								iconSource={iconSource}
								setIconSource={setIconSource}
								theme={theme}
							/>
						)}
					</div>
					<input
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept="image/*"
						onChange={handleImageUpload}
					/>

					<motion.input
						type="text"
						placeholder={type === 'FOLDER' ? 'نام پوشه' : 'عنوان بوکمارک'}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className={`w-full px-4 py-3 text-right rounded-lg ${getInputStyle()}`}
					/>

					<div className="url-field-container relative h-[54px]">
						<AnimatePresence mode="popLayout">
							{type === 'BOOKMARK' && (
								<motion.input
									initial={{ opacity: 0, y: -10 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											type: 'spring',
											stiffness: 500,
											damping: 30,
										},
									}}
									exit={{
										opacity: 0,
										y: 10,
										transition: {
											duration: 0.15,
										},
									}}
									type="text"
									placeholder="آدرس لینک"
									value={url}
									onChange={handleUrlChange}
									className={`w-full px-4 py-3 text-right absolute rounded-lg ${getInputStyle()}`}
								/>
							)}
						</AnimatePresence>
					</div>

					<div className="flex justify-between mt-4">
						<button
							onClick={onClose}
							className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(false)}`}
						>
							لغو
						</button>
						<button
							onClick={handleSave}
							className={`px-4 py-2 cursor-pointer rounded-lg ${getButtonStyle(true)}`}
							disabled={!title.trim() || (type === 'BOOKMARK' && !url.trim())}
						>
							ذخیره
						</button>
					</div>
				</motion.div>
			</div>
		</Modal>
	)
}

function IconSourceSelector({
	iconSource,
	setIconSource,
	theme = 'glass',
}: {
	iconSource: 'auto' | 'upload' | 'url'
	setIconSource: (source: 'auto' | 'upload' | 'url') => void
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

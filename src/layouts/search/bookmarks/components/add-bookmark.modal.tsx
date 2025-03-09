import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaImage, FaUpload } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import Modal from '../../../../components/modal'
import type { Bookmark, BookmarkType } from '../types/bookmark.types'

interface AddBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (bookmark: Bookmark) => void
	parentId: string | null
	theme?: string
}

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
	parentId = null,
	theme = 'glass',
}: AddBookmarkModalProps) {
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [icon, setIcon] = useState('')
	const [customImage, setCustomImage] = useState<string>('')
	const [iconSource, setIconSource] = useState<'auto' | 'upload' | 'url'>('auto')
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Theme-specific styling functions
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

	// Existing functions
	const getFaviconFromUrl = (url: string): string => {
		try {
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				url = `http://${url}`
			}
			const urlObj = new URL(url)
			return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
		} catch {
			return ''
		}
	}

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newUrl = e.target.value
		setUrl(newUrl)
		if (iconSource === 'auto') {
			setIcon(getFaviconFromUrl(newUrl))
		}
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onloadend = () => {
			const base64String = reader.result as string
			setCustomImage(base64String)
		}
		reader.readAsDataURL(file)
	}

	const handleAdd = () => {
		if (!title.trim()) return

		const baseBookmark = {
			id: uuidv4(),
			title: title.trim(),
			type,
			isLocal: true,
			pinned: false,
			parentId,
			customImage: customImage || undefined,
		}

		if (type === 'FOLDER') {
			onAdd(baseBookmark as Bookmark)
		} else {
			let newUrl = url
			if (!url.startsWith('http://') && !url.startsWith('https://')) {
				newUrl = `https://${url}`
			}

			onAdd({
				...baseBookmark,
				type: 'BOOKMARK',
				url: newUrl.trim(),
				icon: customImage || icon,
			} as Bookmark)
		}

		resetForm()
		onClose()
	}

	const resetForm = () => {
		setTitle('')
		setUrl('')
		setIcon('')
		setCustomImage('')
		setType('BOOKMARK')
		setIconSource('auto')
	}

	const renderIconPreview = () => {
		const handlePreviewClick = () => fileInputRef.current?.click()
		const handleRemoveCustomImage = (e: React.MouseEvent) => {
			e.stopPropagation()
			setCustomImage('')
		}

		if (customImage) {
			return (
				<div
					className="relative w-12 h-12 mx-auto cursor-pointer group"
					onClick={handlePreviewClick}
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
					className="relative w-12 h-12 mx-auto cursor-pointer group"
					onClick={handlePreviewClick}
				>
					<img
						src={icon}
						alt="Favicon"
						className={`object-contain w-full h-full p-2 transition-opacity border rounded-lg ${
							theme === 'light' ? 'border-gray-300' : 'border-white/10'
						} group-hover:opacity-75`}
						onError={(e) => {
							;(e.target as HTMLImageElement).style.display = 'none'
						}}
					/>
				</div>
			)
		}

		return (
			<div
				className={`flex items-center justify-center w-12 h-12 mx-auto transition-colors border rounded-lg cursor-pointer ${getIconPreviewStyle()}`}
				onClick={handlePreviewClick}
			>
				<FaImage className="w-6 h-6 text-gray-500" />
			</div>
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="sm"
			title={`✨ ${type === 'FOLDER' ? 'پوشه جدید' : 'بوکمارک جدید'}`}
			direction="rtl"
		>
			<div className="fixed-height-container relative min-h-[280px]">
				<motion.div className="flex flex-col gap-4 p-4">
					<div className="flex gap-2 mb-4">
						<TypeSelector type={type} setType={setType} theme={theme} />
					</div>

					<div className="mb-4">{renderIconPreview()}</div>
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
							className={`px-4 py-2 rounded-lg ${getButtonStyle(false)}`}
						>
							لغو
						</button>
						<button
							onClick={handleAdd}
							className={`px-4 py-2 rounded-lg ${getButtonStyle(true)}`}
							disabled={!title.trim() || (type === 'BOOKMARK' && !url.trim())}
						>
							افزودن
						</button>
					</div>
				</motion.div>
			</div>
		</Modal>
	)
}

function TypeSelector({
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
				onClick={() => setType('BOOKMARK')}
				className={`flex-1 py-2 rounded-lg transition-colors ${
					type === 'BOOKMARK' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				بوکمارک
			</button>
			<button
				onClick={() => setType('FOLDER')}
				className={`flex-1 py-2 rounded-lg transition-colors ${
					type === 'FOLDER' ? getActiveStyle() : getInactiveStyle()
				}`}
			>
				پوشه
			</button>
		</>
	)
}

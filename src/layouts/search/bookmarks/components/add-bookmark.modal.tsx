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
}

export function AddBookmarkModal({
	isOpen,
	onClose,
	onAdd,
	parentId = null,
}: AddBookmarkModalProps) {
	const [type, setType] = useState<BookmarkType>('BOOKMARK')
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [icon, setIcon] = useState('')
	const [customImage, setCustomImage] = useState<string>('')
	const [iconSource, setIconSource] = useState<'auto' | 'upload' | 'url'>('auto')
	const fileInputRef = useRef<HTMLInputElement>(null)

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
						className="object-contain w-full h-full p-2 transition-opacity border rounded-lg border-white/10 group-hover:opacity-75"
						onError={(e) => {
							;(e.target as HTMLImageElement).style.display = 'none'
						}}
					/>
				</div>
			)
		}

		return (
			<div
				className="flex items-center justify-center w-12 h-12 mx-auto transition-colors border rounded-lg cursor-pointer border-white/10 hover:bg-neutral-800/50"
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
						<TypeSelector type={type} setType={setType} />
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
						className="w-full px-4 py-3 text-right text-white bg-[#1E1E1E] border border-[#333] rounded-lg"
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
									className="w-full px-4 py-3 text-right text-white absolute bg-[#1E1E1E] border border-[#333] rounded-lg"
								/>
							)}
						</AnimatePresence>
					</div>

					<div className="flex justify-between mt-4">
						<button
							onClick={onClose}
							className="px-4 py-2 text-gray-400 border rounded-lg border-white/10 hover:bg-white/5"
						>
							لغو
						</button>
						<button
							onClick={handleAdd}
							className="px-4 py-2 text-white rounded-lg bg-blue-500/80 hover:bg-blue-500"
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
}: {
	type: BookmarkType
	setType: (type: BookmarkType) => void
}) {
	return (
		<>
			<button
				onClick={() => setType('BOOKMARK')}
				className={`flex-1 py-2 rounded-lg transition-colors ${
					type === 'BOOKMARK'
						? 'bg-blue-500/80 text-white'
						: 'bg-neutral-800 text-gray-400'
				}`}
			>
				بوکمارک
			</button>
			<button
				onClick={() => setType('FOLDER')}
				className={`flex-1 py-2 rounded-lg transition-colors ${
					type === 'FOLDER' ? 'bg-blue-500/80 text-white' : 'bg-neutral-800 text-gray-400'
				}`}
			>
				پوشه
			</button>
		</>
	)
}

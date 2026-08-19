import { showToast } from '@/common/toast'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Icon } from '@/src/icons'
import type React from 'react'
import { useRef, useState } from 'react'

type Props = {
	value: File | string | null
	url?: string | null
	onChange: (file: File | null) => void
}

export function BookmarkIconPicker({ value, url, onChange }: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [error, setError] = useState(false)

	const openPicker = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
			fileInputRef.current.click()
		}
	}

	const handleFile = (file?: File) => {
		if (!file || !file.type.startsWith('image/'))
			return showToast('فرمت نامعتبر است', 'error')
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

	const isFile = value instanceof File
	let iconSrc: string | null = null
	if (value && isFile) {
		iconSrc = URL.createObjectURL(value)
	} else {
		if (typeof value === 'string' && value) {
			iconSrc = value
		} else if (url && url !== 'null') {
			iconSrc = getFaviconFromUrl(url || '')
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				className="hidden"
				accept="image/*"
				onChange={handleUpload}
			/>

			<button
				type="button"
				onClick={openPicker}
				onDragOver={(e) => {
					e.preventDefault()
					setIsDragging(true)
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`relative w-12 h-11 shrink-0 flex items-center justify-center cursor-pointer border-2 rounded-xl transition-all ${
					isDragging
						? 'border-primary bg-primary/10'
						: 'border-base-content/15 hover:border-primary/40 bg-base-200/80'
				}`}
				title="انتخاب آیکون"
			>
				{iconSrc && !error ? (
					<img
						src={iconSrc}
						alt="icon"
						className={`w-full h-full object-contain p-1.5 ${
							isFile ? 'rounded-md' : 'rounded-lg'
						}`}
						onError={() => setError(true)}
					/>
				) : (
					<Icon name="image" size={18} className="text-muted" />
				)}

				<div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 hover:opacity-100 bg-base-300/80 rounded-xl">
					<Icon name="uploadImage" size={18} className="text-content" />
				</div>

				{isFile && (
					<button
						type="button"
						onClick={handleRemove}
						className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-error text-white text-[10px] shadow hover:scale-110 active:scale-95 transition-transform"
						title="حذف آیکون"
					>
						✕
					</button>
				)}
			</button>
		</>
	)
}

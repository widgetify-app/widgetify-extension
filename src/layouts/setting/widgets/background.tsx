import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { MdOutlineVideoSettings } from 'react-icons/md'
// Add FaPlayCircle icon for video badge
import { CustomCheckbox } from '../../../components/checkbox'

interface Background {
	id: string
	name: string
	url: string
	type: 'image' | 'video'
}

export function BackgroundSetting() {
	const [selectedBackground, setSelectedBackground] = useState<string>('1')
	const [isRetouchEnabled, setIsRetouchEnabled] = useState<boolean>(false)

	const backgrounds: Background[] = [
		{
			id: '1',
			name: 'تهران',
			url: 'https://i.postimg.cc/YSRJ4Lf3/back.jpg',
			type: 'image',
		},
		{
			id: '2',
			name: 'طبیعت',
			url: 'https://plus.unsplash.com/premium_photo-1697730206215-d1dcaa5917d7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			type: 'image',
		},
		{
			id: '3',
			name: 'شهر',
			url: 'https://plus.unsplash.com/premium_photo-1661963282607-4c4a07f4266b?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			type: 'image',
		},
		{
			id: '4',
			name: 'Space',
			url: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			type: 'image',
		},
		{
			id: '5',
			name: 'earth',
			url: 'https://images.unsplash.com/photo-1643330683233-ff2ac89b002c?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			type: 'image',
		},
		{
			id: '6',
			name: 'تهران 2',
			url: 'https://images.unsplash.com/photo-1593371514631-b8967f504a54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			type: 'image',
		},
		{
			id: '7',
			name: 'انتزاعی 1',
			url: 'https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4',
			type: 'video',
		},
		{
			id: '8',
			name: 'جنگلی',
			url: 'https://videos.pexels.com/video-files/5764717/5764717-uhd_2560_1440_30fps.mp4',
			type: 'video',
		},
		{
			id: '9',
			name: 'کویر',
			url: 'https://videos.pexels.com/video-files/19348572/19348572-uhd_2560_1440_25fps.mp4',
			type: 'video',
		},
	]

	useEffect(() => {
		const selectedBg = backgrounds.find((bg) => bg.id === selectedBackground)
		if (!selectedBg) return

		// Remove any existing video background
		const existingVideo = document.getElementById('background-video')
		if (existingVideo) {
			existingVideo.remove()
		}

		if (selectedBg.type === 'image') {
			// Set background image for image type
			const gradient = isRetouchEnabled
				? 'linear-gradient(rgb(53 53 53 / 42%), rgb(0 0 0 / 16%)), '
				: ''
			document.body.style.backgroundImage = `${gradient}url(${selectedBg.url})`
			// Reset any video-specific styles
			document.body.style.backgroundColor = ''
		} else if (selectedBg.type === 'video') {
			// Clear background image
			document.body.style.backgroundImage = ''
			// Set a background color instead
			document.body.style.backgroundColor = '#000'

			// Create video element
			const video = document.createElement('video')
			video.id = 'background-video'
			video.src = selectedBg.url
			video.autoplay = true
			video.loop = true
			video.muted = true
			video.playsInline = true

			// Style video element to fill the background
			Object.assign(video.style, {
				position: 'fixed',
				right: '0',
				bottom: '0',
				minWidth: '100%',
				minHeight: '100%',
				width: 'auto',
				height: 'auto',
				zIndex: '-1',
				objectFit: 'cover',
			})

			// Apply retouch filter if enabled
			if (isRetouchEnabled) {
				video.style.filter = 'brightness(0.7)'
			}

			// Add video element to the body
			document.body.prepend(video)
		}
	}, [selectedBackground, isRetouchEnabled, backgrounds])

	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div>
				<h2 className="mb-4 text-xl font-semibold text-gray-200 font-[Vazir]">
					تصویر زمینه
				</h2>
				<div className="grid grid-cols-3 gap-4 p-2">
					{backgrounds.map((background) => (
						<motion.div
							key={background.id}
							className={`relative aspect-video cursor-pointer rounded-xl overflow-hidden 
                ${selectedBackground === background.id ? 'ring-2 ring-blue-500' : ''}
                backdrop-blur-sm bg-black/20`}
							onClick={() => setSelectedBackground(background.id)}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							{background.type === 'image' ? (
								<img
									src={background.url}
									alt={background.name}
									className="object-cover w-full h-full"
								/>
							) : (
								<>
									<video
										src={background.url}
										className="object-cover w-full h-full"
										muted
										autoPlay
										loop
										playsInline
									/>
									{/* Add Video Badge */}
									<motion.div
										className="absolute px-2 py-1 rounded-md top-2 right-2 bg-black/50 backdrop-blur-sm"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
									>
										<div className="flex items-center gap-1">
											<MdOutlineVideoSettings size={14} className="text-white" />
											<span className="text-xs text-white font-[Vazir]">ویدیو</span>
										</div>
									</motion.div>
								</>
							)}
							<motion.div
								className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<p className="absolute bottom-2 w-full text-sm text-center font-[Vazir] text-white">
									{background.name}
								</p>
							</motion.div>
						</motion.div>
					))}
				</div>
			</div>

			<div className="flex items-start gap-3 p-4 mt-6 rounded-xl bg-white/5">
				<CustomCheckbox checked={isRetouchEnabled} onChange={setIsRetouchEnabled} />
				<div
					onClick={() => setIsRetouchEnabled(!isRetouchEnabled)}
					className="cursor-pointer"
				>
					<p className="font-medium font-[Vazir] text-gray-200">فیلتر تصویر</p>
					<p className="text-sm font-[Vazir] text-gray-400">
						با فعال کردن این گزینه تصویر زمینه شما تاریک تر خواهد شد
					</p>
				</div>
			</div>
		</motion.div>
	)
}

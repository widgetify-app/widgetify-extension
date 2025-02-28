import { motion } from 'framer-motion'
import keepItImage from '../assets/keep-it.png'
import Modal from './modal'

interface UpdateAvailableModalProps {
	show: boolean
	onClose: () => void
	onGetStarted: () => void
}

export function ExtensionInstalledModal({
	show,
	onClose,
	onGetStarted,
}: UpdateAvailableModalProps) {
	return (
		<Modal isOpen={show} onClose={onClose} size="sm" direction="rtl">
			<motion.div
				className="flex flex-col items-center p-6 text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				<motion.div
					className="mb-6"
					initial={{ y: -20 }}
					animate={{ y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<h3 className="mb-3 text-2xl font-bold text-white">
						به ویجتی‌فای خوش آمدید! 🎉
					</h3>
					<p className="leading-relaxed text-gray-300">
						برای استفاده از تمام امکانات ویجتی‌فای، لازم است که افزونه در مرورگر شما فعال
						بماند.
					</p>
				</motion.div>

				<motion.div
					className="relative p-3 mt-2 mb-6 bg-gray-800 bg-opacity-50 rounded-xl"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<div className="flex items-center justify-center">
						<img
							src={keepItImage}
							alt="نحوه فعالسازی افزونه"
							className="h-auto max-w-full rounded-lg shadow-xl"
							style={{ maxHeight: '220px' }}
						/>
					</div>
				</motion.div>

				<motion.div
					className="p-3 mb-6 text-gray-200 rounded-lg bg-neutral-900 bg-opacity-30"
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<p className="font-bold">
						⚠️ برای فعالسازی افزونه، روی دکمه "Keep It" کلیک کنید.
					</p>
				</motion.div>

				<motion.button
					onClick={onGetStarted}
					className={
						'px-8 py-3 text-white font-light bg-blue-600 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
					}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					فعال کردم، بیا شروع کنیم
				</motion.button>
			</motion.div>
		</Modal>
	)
}

import { motion } from 'motion/react'
import { FaGithub, FaGlobe, FaHeart } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'

export function AboutUsTab() {
	return (
		<motion.div
			className="w-full max-w-xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="flex flex-col items-center p-6 rounded-xl">
				{/* App Logo */}
				<div className="flex items-center justify-center w-20 h-20 mb-4 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
					<span className="text-3xl font-bold text-white">W</span>
				</div>

				{/* App Name & Version */}
				<h1 className="mb-1 text-2xl font-bold text-white">ویجتیفای</h1>
				<div className="mb-4 text-sm text-gray-400">نسخه تست و بررسی</div>

				{/* Description */}
				<p className="mb-6 text-center text-gray-300">
					ویجتیفای یک افزونه متن‌باز برای مرورگر شماست که صفحه جدید را با ابزارهای کاربردی
					و سبک زیبا به محیطی کارآمد و شخصی‌سازی شده تبدیل می‌کند.
				</p>

				{/* Contact & Links */}
				<div className="grid w-full grid-cols-1 gap-4 mb-8 md:grid-cols-3">
					<a
						href="https://github.com/widgetify-app"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 border rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border-gray-700/50 hover:border-gray-500/80 hover:from-gray-700/80 hover:to-gray-800/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.03]"
					>
						<FaGithub
							size={20}
							className="text-gray-400 transition-colors duration-300 group-hover:text-white"
						/>
						<span className="text-gray-200 transition-colors duration-300 group-hover:text-white">
							گیت‌هاب
						</span>
					</a>

					<a
						href="https://feedback.onl/fa/b/widgetify"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 border rounded-xl bg-gradient-to-br from-blue-900/80 to-blue-950/90 border-blue-800/50 hover:border-blue-600/80 hover:from-blue-800/80 hover:to-blue-900/90 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:scale-[1.03]"
					>
						<MdFeedback
							size={20}
							className="text-blue-400 transition-colors duration-300 group-hover:text-blue-200"
						/>
						<span className="text-gray-200 transition-colors duration-300 group-hover:text-white">
							بازخورد
						</span>
					</a>

					<a
						href="https://widgetify.ir"
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center justify-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-300 border rounded-xl bg-gradient-to-br from-purple-900/80 to-purple-950/90 border-purple-800/50 hover:border-purple-600/80 hover:from-purple-800/80 hover:to-purple-900/90 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-[1.03]"
					>
						<FaGlobe
							size={20}
							className="text-purple-400 transition-colors duration-300 group-hover:text-purple-200"
						/>
						<span className="text-gray-200 transition-colors duration-300 group-hover:text-white">
							وب‌سایت
						</span>
					</a>
				</div>

				{/* Attribution */}
				<div className="flex items-center justify-center mt-8 text-sm text-gray-500">
					<span>ساخته شده با</span>
					<FaHeart className="mx-1 text-red-500" size={14} />
					<span>در ایران</span>
				</div>
			</div>
		</motion.div>
	)
}

import { motion } from 'motion/react'
import { FaGithub, FaGlobe, FaHeart } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'
import browser from 'webextension-polyfill'
import { SectionPanel } from '../../../../components/section-panel'

export function AboutUsTab() {
	const manifest = browser.runtime.getManifest()
	return (
		<motion.div
			className="w-full max-w-2xl mx-auto"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			dir="rtl"
		>
			<div className="flex flex-col items-center p-6 text-center">
				{/* App Logo */}
				<motion.div
					className="relative flex items-center justify-center w-24 h-24 mb-5 overflow-hidden shadow-lg rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800"
					whileHover={{ scale: 1.05, rotate: 5 }}
					transition={{ type: 'spring', stiffness: 300 }}
				>
					<div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent)]"></div>
					<span className="text-4xl font-extrabold text-white font-[balooTamma]">W</span>
				</motion.div>

				{/* App Name & Version */}
				<h1 className="mb-1 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
					ویجتیفای
				</h1>
				<div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-medium text-blue-200 border rounded-full bg-blue-900/30 backdrop-blur-sm border-blue-700/30">
					<span>نسخه {manifest.version}</span>
				</div>

				{/* Description */}
				<p className="max-w-lg mb-6 text-lg leading-relaxed text-gray-300">
					ویجتیفای یک افزونه متن‌باز برای مرورگر شماست که صفحه جدید را با ابزارهای کاربردی
					و سبک زیبا به محیطی کارآمد و شخصی‌سازی شده تبدیل می‌کند.
				</p>
			</div>

			{/* Links Section */}
			<SectionPanel title="لینک‌های ارتباطی" delay={0.1}>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<motion.a
						href="https://github.com/widgetify-app"
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col items-center justify-center p-4 transition-all border rounded-xl bg-gray-800/30 backdrop-blur-sm border-white/5 hover:border-white/20 hover:bg-gray-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
						whileHover={{ y: -5 }}
						transition={{ type: 'spring', stiffness: 400, damping: 10 }}
					>
						<div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gray-700/50">
							<FaGithub size={24} className="text-gray-200" />
						</div>
						<h3 className="text-sm font-medium text-white">گیت‌هاب</h3>
						<p className="mt-1 text-xs text-center text-gray-400">مشاهده کد منبع</p>
					</motion.a>

					<motion.a
						href="https://feedback.onl/fa/b/widgetify"
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col items-center justify-center p-4 transition-all border rounded-xl bg-blue-900/30 backdrop-blur-sm border-white/5 hover:border-blue-400/20 hover:bg-blue-900/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
						whileHover={{ y: -5 }}
						transition={{ type: 'spring', stiffness: 400, damping: 10 }}
					>
						<div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-blue-800/50">
							<MdFeedback size={24} className="text-blue-200" />
						</div>
						<h3 className="text-sm font-medium text-white">بازخورد</h3>
						<p className="mt-1 text-xs text-center text-gray-400">
							ارسال پیشنهاد و انتقاد
						</p>
					</motion.a>

					<motion.a
						href="https://widgetify.ir"
						target="_blank"
						rel="noopener noreferrer"
						className="flex flex-col items-center justify-center p-4 transition-all border rounded-xl bg-indigo-900/30 backdrop-blur-sm border-white/5 hover:border-indigo-400/20 hover:bg-indigo-900/40 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)]"
						whileHover={{ y: -5 }}
						transition={{ type: 'spring', stiffness: 400, damping: 10 }}
					>
						<div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-indigo-800/50">
							<FaGlobe size={24} className="text-indigo-200" />
						</div>
						<h3 className="text-sm font-medium text-white">وب‌سایت</h3>
						<p className="mt-1 text-xs text-center text-gray-400">مشاهده سایت رسمی</p>
					</motion.a>
				</div>
			</SectionPanel>

			{/* Footer */}
			<div className="flex items-center justify-center mt-8 space-x-1 space-x-reverse text-sm text-gray-400">
				<span>ساخته شده با</span>
				<FaHeart className="mx-1 text-red-500 animate-pulse" size={14} />
				<span>در ایران</span>
			</div>

			<div className="mt-2 mb-4 text-xs text-center text-gray-500">
				© ویجتیفای - تمامی حقوق محفوظ است
			</div>
		</motion.div>
	)
}

import { SectionPanel } from '@/components/section-panel'
import { useTheme } from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { FaDonate, FaGithub, FaGlobe, FaHeart } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'
import browser from 'webextension-polyfill'

export function AboutUsTab() {
	const manifest = browser.runtime.getManifest()
	const { theme } = useTheme()

	const getDonateCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-green-100/50 border-green-200/30 hover:border-green-400/40 hover:bg-green-100/80 hover:shadow-[0_0_15px_rgba(74,222,128,0.15)]'
			case 'dark':
				return 'bg-green-900/30 border-white/5 hover:border-green-400/20 hover:bg-green-900/40 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]'
			default: // glass
				return 'bg-green-900/20 border-white/5 hover:border-green-400/20 hover:bg-green-900/30 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]'
		}
	}

	const getGithubCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-gray-100/50 border-gray-200/30 hover:border-gray-400/40 hover:bg-gray-100/80 hover:shadow-[0_0_15px_rgba(156,163,175,0.2)]'
			case 'dark':
				return 'bg-gray-800/30 border-white/5 hover:border-white/20 hover:bg-gray-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
			default: // glass
				return 'bg-gray-800/20 border-white/5 hover:border-white/20 hover:bg-gray-800/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
		}
	}

	const getFeedbackCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-blue-100/50 border-blue-200/30 hover:border-blue-400/40 hover:bg-blue-100/80 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]'
			case 'dark':
				return 'bg-blue-900/30 border-white/5 hover:border-blue-400/20 hover:bg-blue-900/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
			default: // glass
				return 'bg-blue-900/20 border-white/5 hover:border-blue-400/20 hover:bg-blue-900/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
		}
	}

	const getWebsiteCardStyle = () => {
		switch (theme) {
			case 'light':
				return 'bg-indigo-100/50 border-indigo-200/30 hover:border-indigo-400/40 hover:bg-indigo-100/80 hover:shadow-[0_0_15px_rgba(129,140,248,0.15)]'
			case 'dark':
				return 'bg-indigo-900/30 border-white/5 hover:border-indigo-400/20 hover:bg-indigo-900/40 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)]'
			default: // glass
				return 'bg-indigo-900/20 border-white/5 hover:border-indigo-400/20 hover:bg-indigo-900/30 hover:shadow-[0_0_15px_rgba(129,140,248,0.2)]'
		}
	}

	const getIconContainerStyle = (color: string) => {
		switch (theme) {
			case 'light':
				switch (color) {
					case 'green':
						return 'bg-green-100/80 text-green-700'
					case 'gray':
						return 'bg-gray-100/80 text-gray-700'
					case 'blue':
						return 'bg-blue-100/80 text-blue-700'
					case 'indigo':
						return 'bg-indigo-100/80 text-indigo-700'
					default:
						return 'bg-gray-100/80 text-gray-700'
				}

			default:
				switch (color) {
					case 'green':
						return 'bg-green-800/50 text-green-200'
					case 'gray':
						return 'bg-gray-700/50 text-gray-200'
					case 'blue':
						return 'bg-blue-800/50 text-blue-200'
					case 'indigo':
						return 'bg-indigo-800/50 text-indigo-200'
					default:
						return 'bg-gray-700/50 text-gray-200'
				}
		}
	}

	return (
		<LazyMotion features={domAnimation}>
			<m.div
				className="w-full max-w-2xl mx-auto"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				dir="rtl"
			>
				<div className="flex flex-col items-center p-3 text-center">
					{/* App Name & Version */}
					<h1
						className={
							'mb-1 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600'
						}
					>
						ویجتی‌فای
					</h1>
					<div
						className={
							'inline-flex items-center px-3 py-1 mb-2 text-xs font-medium border rounded-full backdrop-blur-sm text-primary/80'
						}
					>
						<span>نسخه {manifest.version}</span>
					</div>

					{/* Description */}
					<p className={'max-w-lg mb-2 text-sm leading-relaxed text-content'}>
						ویجتی‌فای یک افزونه متن‌باز برای مرورگر شماست که صفحه جدید را با ابزارهای
						کاربردی و سبک زیبا به محیطی کارآمد و شخصی‌سازی شده تبدیل می‌کند.
					</p>
				</div>

				{/* Links Section */}
				<SectionPanel title="لینک‌های ارتباطی" size="sm">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<m.a
							href="https://widgetify.ir/donate"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex flex-col items-center justify-center p-4 transition-all border rounded-xl backdrop-blur-sm ${getDonateCardStyle()}`}
							whileHover={{ y: -5 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						>
							<div
								className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${getIconContainerStyle('green')}`}
							>
								<FaDonate size={24} />
							</div>
							<h3 className={'text-sm font-medium text-content'}>حمایت مالی</h3>
							<p className={'mt-1 text-xs text-center text-content'}>
								کمک به توسعه ویجتی‌فای
							</p>
						</m.a>

						<m.a
							href="https://github.com/widgetify-app"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex flex-col items-center justify-center p-4 transition-all border rounded-xl backdrop-blur-sm ${getGithubCardStyle()}`}
							whileHover={{ y: -5 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						>
							<div
								className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${getIconContainerStyle('gray')}`}
							>
								<FaGithub size={24} />
							</div>
							<h3 className={'text-sm font-medium text-content'}>گیت‌هاب</h3>
							<p className={'mt-1 text-xs text-center text-content'}>مشاهده کد منبع</p>
						</m.a>

						<m.a
							href="https://feedback.widgetify.ir"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex flex-col items-center justify-center p-4 transition-all border rounded-xl backdrop-blur-sm ${getFeedbackCardStyle()}`}
							whileHover={{ y: -5 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						>
							<div
								className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${getIconContainerStyle('blue')}`}
							>
								<MdFeedback size={24} />
							</div>
							<h3 className={'text-sm font-medium text-content'}>بازخورد</h3>
							<p className={'mt-1 text-xs text-center text-content'}>
								ارسال پیشنهاد و انتقاد
							</p>
						</m.a>

						<m.a
							href="https://widgetify.ir"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex flex-col items-center justify-center p-4 transition-all border rounded-xl backdrop-blur-sm ${getWebsiteCardStyle()}`}
							whileHover={{ y: -5 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						>
							<div
								className={`flex items-center justify-center w-12 h-12 mb-3 rounded-full ${getIconContainerStyle('indigo')}`}
							>
								<FaGlobe size={24} />
							</div>
							<h3 className={'text-sm font-medium text-content'}>وب‌سایت</h3>
							<p className={'mt-1 text-xs text-center text-content'}>مشاهده سایت رسمی</p>
						</m.a>
					</div>
				</SectionPanel>

				{/* Footer */}
				<div
					className={
						'flex items-center justify-center mt-8 space-x-1 space-x-reverse text-sm text-content opacity-75'
					}
				>
					<span>ساخته شده با</span>
					<FaHeart className="mx-1 text-red-500 animate-pulse" size={14} />
					<span>در ایران</span>
				</div>

				<div className={'mt-2 mb-4 text-xs text-center text-content opacity-55'}>
					© ویجتی‌فای - تمامی حقوق محفوظ است
				</div>
			</m.div>
		</LazyMotion>
	)
}

import { motion } from 'framer-motion'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'
import { MdOutlineBlurOn } from 'react-icons/md'
import { SectionPanel } from '../../../../../components/section-panel'
import { useTheme } from '../../../../../context/theme.context'

export function ThemeSelector() {
	const { setTheme, theme, themeUtils } = useTheme()

	const themes = [
		{
			id: 'glass',
			name: 'شیشه‌ای',
			icon: <MdOutlineBlurOn size={24} />,
			previewClass:
				'bg-gradient-to-br from-black/40 to-black/30 backdrop-blur-md text-white',
		},
		{
			id: 'light',
			name: 'روشن',
			icon: <IoMdSunny size={24} />,
			previewClass:
				'bg-gradient-to-br from-gray-100 to-white text-gray-800 border border-gray-200',
		},
		{
			id: 'dark',
			name: 'تیره',
			icon: <IoMdMoon size={24} />,
			previewClass: 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-gray-100',
		},
	]

	return (
		<SectionPanel title="انتخاب تم" delay={0.2}>
			<div className="flex flex-col gap-4">
				<p className={themeUtils.getDescriptionTextStyle()}>
					تم ظاهری ویجتی‌فای را انتخاب کنید.
				</p>

				<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{themes.map((item, index) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.1 }}
							className="relative"
						>
							<motion.button
								onClick={() => setTheme(item.id)}
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.98 }}
								className={`
                  relative w-full overflow-hidden rounded-lg text-right cursor-pointer transition-all duration-300
                  ${theme === item.id ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg hover:shadow-xl'}
                `}
							>
								{/* Theme preview box */}
								<div className={`w-full p-5 ${item.previewClass}`}>
									<div className="flex items-center justify-between">
										<div
											className={`p-2 rounded-full ${theme === item.id ? 'bg-blue-500/30 text-blue-300' : 'bg-white/10'}`}
										>
											{item.icon}
										</div>

										{theme === item.id && (
											<motion.div
												initial={{ scale: 0, rotate: -90 }}
												animate={{ scale: 1, rotate: 0 }}
												transition={{ type: 'spring', stiffness: 500, damping: 15 }}
												className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full shadow-lg shadow-blue-500/30"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20"
													fill="currentColor"
													className="w-5 h-5"
												>
													<path
														fillRule="evenodd"
														d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
														clipRule="evenodd"
													/>
												</svg>
											</motion.div>
										)}
									</div>

									{/* Theme demo elements */}
									<div className="flex flex-col mt-4 space-y-2">
										<div
											className={`h-2 rounded-full ${
												theme === item.id
													? item.id === 'light'
														? 'bg-blue-200 animate-pulse'
														: 'bg-blue-500/30 animate-pulse'
													: item.id === 'light'
														? 'bg-gray-300'
														: 'bg-white/20'
											}`}
										></div>
										<div
											className={`h-2 w-2/3 rounded-full ${
												theme === item.id
													? item.id === 'light'
														? 'bg-blue-300 animate-pulse'
														: 'bg-blue-500/20 animate-pulse'
													: item.id === 'light'
														? 'bg-gray-300'
														: 'bg-white/20'
											}`}
										></div>
									</div>
								</div>

								{/* Theme info */}
								<div
									className={`p-4 ${
										item.id === 'light'
											? theme === item.id
												? 'bg-gradient-to-r from-blue-50 to-white'
												: 'bg-white'
											: item.id === 'dark'
												? theme === item.id
													? 'bg-gradient-to-r from-blue-900/30 to-neutral-800'
													: 'bg-neutral-800'
												: theme === item.id
													? 'bg-gradient-to-r from-blue-900/30 to-black/30 backdrop-blur-md'
													: 'bg-black/30 backdrop-blur-md'
									}`}
								>
									<h3
										className={`text-lg font-bold mb-1 ${
											theme === item.id
												? 'text-blue-500'
												: item.id === 'light'
													? 'text-gray-800'
													: 'text-gray-100'
										}`}
									>
										{item.name}
									</h3>
								</div>

								{/* Selected indicator overlay */}
								{theme === item.id && (
									<>
										<motion.div
											className="absolute inset-0 border-blue-500 rounded-lg pointer-events-none border-3"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
										></motion.div>
										<motion.div
											className="absolute inset-0 rounded-lg pointer-events-none"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
											style={{
												background:
													'linear-gradient(45deg, rgba(59, 130, 246, 0.2) 0%, transparent 40%, rgba(59, 130, 246, 0.2) 100%)',
												backgroundSize: '200% 200%',
											}}
										></motion.div>
										<motion.div
											className="absolute z-10 w-12 h-12 rounded-full -top-2 -right-2"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											style={{
												background:
													'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
											}}
										/>
										<motion.div
											className="absolute z-10 w-12 h-12 rounded-full -bottom-2 -left-2"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											style={{
												background:
													'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
											}}
										/>
									</>
								)}
							</motion.button>
						</motion.div>
					))}
				</div>
			</div>
		</SectionPanel>
	)
}

import { useAppearanceSetting } from '@/context/appearance.context'
import { motion } from 'framer-motion'
import { ContentAlignmentSettings } from './components/content-alignment-settings'
import { FontSelector } from './components/font-selector'
import { ThemeSelector } from './components/theme-selector'
export function AppearanceSettingTab() {
  const { contentAlignment, setContentAlignment, fontFamily, setFontFamily } =
    useAppearanceSetting()

  return (
    <motion.div
      className="w-full max-w-xl mx-auto"
      dir="rtl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ThemeSelector />
      <ContentAlignmentSettings
        contentAlignment={contentAlignment}
        setContentAlignment={setContentAlignment}
      />
      <FontSelector fontFamily={fontFamily} setFontFamily={setFontFamily} />
    </motion.div>
  )
}

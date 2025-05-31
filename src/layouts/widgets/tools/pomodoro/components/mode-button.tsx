import { getBorderColor } from '@/context/theme.context'
import { motion } from 'framer-motion'
import type React from 'react'
import { FiCheck } from 'react-icons/fi'
import { modeLabels } from '../constants'
import type { TimerMode } from '../types'

interface ModeButtonProps {
  mode: TimerMode
  theme: string
  currentMode: TimerMode
  onClick: () => void
}

export const ModeButton: React.FC<ModeButtonProps> = ({
  mode,
  theme,
  currentMode,
  onClick,
}) => {
  const isActive = mode === currentMode

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1 cursor-pointer text-xs font-medium rounded-md transition-colors border ${getBorderColor(theme)}`}
    >
      {modeLabels[mode]} {isActive && <FiCheck className="inline" />}
    </motion.button>
  )
}

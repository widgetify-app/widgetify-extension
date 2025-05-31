import { callEvent } from '@/common/utils/call-event'
import Modal from '@/components/modal'
import { getBorderColor, getTextColor, useTheme } from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { IoIosLogIn } from 'react-icons/io'

interface AuthRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  loginButtonText?: string
  cancelButtonText?: string
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  title = 'ورود به حساب کاربری',
  message = 'برای دسترسی به این بخش یا انجام این عملیات، ابتدا وارد حساب کاربری خود شوید.',
  loginButtonText = 'ورود به حساب',
  cancelButtonText = 'بعداً',
}: AuthRequiredModalProps) {
  const { theme } = useTheme()
  function triggerAccountTabDisplay() {
    onClose()
    callEvent('openSettings', 'account')
  }

  return (
    <Modal
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      direction="rtl"
      title={title}
    >
      <div className="flex flex-col items-center justify-center w-full gap-6 p-5 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-2 rounded-full bg-blue-500/10">
          <IoIosLogIn size={32} className="text-blue-500" />
        </div>

        <p className={`${getTextColor(theme)} text-base`}>{message}</p>

        <div className="flex flex-row items-center justify-center gap-3 mt-2">
          <LazyMotion features={domAnimation}>
            <m.button
              className={`px-5 py-2.5 rounded-lg cursor-pointer font-medium transition-colors ${getTextColor(theme)} border ${getBorderColor(theme)}`}
              onClick={onClose}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {cancelButtonText}
            </m.button>

            <m.button
              className="px-5 py-2.5 text-white cursor-pointer transition-colors bg-blue-500 rounded-lg font-medium hover:bg-blue-600"
              onClick={triggerAccountTabDisplay}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loginButtonText}
            </m.button>
          </LazyMotion>
        </div>
      </div>
    </Modal>
  )
}

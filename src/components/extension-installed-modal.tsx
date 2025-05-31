import keepItImage from '@/assets/keep-it.png'
import {
  getBorderColor,
  getCardBackground,
  getDescriptionTextStyle,
  getHeadingTextStyle,
  getTextColor,
  useTheme,
} from '@/context/theme.context'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import { useState } from 'react'
import Modal from './modal'

interface ExtensionInstalledModalProps {
  show: boolean
  onClose: () => void
  onGetStarted: () => void
}

type Step = 1 | 2 | 3

export function ExtensionInstalledModal({
  show,
  onGetStarted,
}: ExtensionInstalledModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const totalSteps = 3

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne setCurrentStep={setCurrentStep} />
      case 2:
        return <StepTwo setCurrentStep={setCurrentStep} />
      case 3:
        return <StepThree onGetStarted={onGetStarted} />
      default:
        return null
    }
  }

  const StepIndicator = () => (
    // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
    <div
      className="flex items-center justify-center gap-3"
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentStep((index + 1) as Step)}
          aria-label={`رفتن به گام ${index + 1}`}
          aria-current={index + 1 === currentStep ? 'step' : undefined}
          className={`w-10 h-2 cursor-pointer rounded-full transition-all duration-300 ${
            index + 1 === currentStep
              ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
              : index + 1 < currentStep
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
          }`}
        />
      ))}
    </div>
  )

  return (
    <Modal
      isOpen={show}
      onClose={() => {}}
      size="sm"
      direction="rtl"
      showCloseButton={false}
      closeOnBackdropClick={false}
    >
      <LazyMotion features={domAnimation}>
        <m.div
          className={'flex flex-col items-center p-6 text-center'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {renderStepContent()}
        </m.div>
      </LazyMotion>

      <StepIndicator />
    </Modal>
  )
}

interface StepOneProps {
  setCurrentStep: (step: Step) => void
}
const StepOne = ({ setCurrentStep }: StepOneProps) => {
  const { theme } = useTheme()

  return (
    <>
      <m.div
        className="mb-3"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={`mb-0 text-2xl font-bold ${getHeadingTextStyle(theme)}`}>
          به ویجتی‌فای خوش آمدید! 🎉
        </h3>
      </m.div>

      <m.div
        className={`relative p-1 mt-1 mb-3 border rounded-xl ${getBorderColor(theme)}  ${getCardBackground(theme)}`}
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
      </m.div>

      <m.div
        className={`p-3 mb-3 text-gray-200 rounded-lg border ${getBorderColor(theme)}  ${getCardBackground(theme)}`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="font-bold">
          ⚠️ برای فعالسازی افزونه، روی دکمه "Keep It" کلیک کنید.
        </p>
      </m.div>

      <button
        onClick={() => setCurrentStep(2)}
        className="px-8 py-3 font-light text-white transition-all cursor-pointer duration-300 transform bg-blue-600 bg-opacity-80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:bg-opacity-90 hover:shadow-xl backdrop-blur-sm"
      >
        Keep It رو زدم!
      </button>
    </>
  )
}

interface StepTwoProps {
  setCurrentStep: (step: Step) => void
}
const StepTwo = ({ setCurrentStep }: StepTwoProps) => {
  const { theme } = useTheme()

  return (
    <>
      <m.div
        className="mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={`mb-3 text-2xl font-bold ${getHeadingTextStyle(theme)}`}>
          درباره ما{' '}
        </h3>
        <p className={`leading-relaxed ${getDescriptionTextStyle(theme)}`}>
          ما متن باز هستیم! ویجتی‌فای یک پروژه متن‌باز است که با عشق توسعه داده
          می‌شود.
        </p>
      </m.div>

      <m.div
        className={`p-3 mb-6 text-gray-200 rounded-lg border ${getBorderColor(theme)}  ${getCardBackground(theme)}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="font-medium">
          🔒 امنیت و حریم خصوصی کاربران برای ما در اولویت است و ما متعهد به
          حفاظت از اطلاعات شما هستیم.
        </p>
      </m.div>

      <button
        onClick={() => setCurrentStep(3)}
        className="px-8 py-3 font-light text-white cursor-pointer transition-all duration-300 transform bg-blue-600 bg-opacity-80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:bg-opacity-90 hover:shadow-xl backdrop-blur-sm"
      >
        ادامه
      </button>
    </>
  )
}

interface StepThreeProps {
  onGetStarted: () => void
}
const StepThree = ({ onGetStarted }: StepThreeProps) => {
  const { theme } = useTheme()

  return (
    <>
      <m.div
        className="mb-6"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={`mb-3 text-2xl font-bold ${getHeadingTextStyle(theme)}`}>
          آماده شروع هستید؟
        </h3>
      </m.div>

      <m.div
        className={`p-3 mb-6 border rounded-lg ${getCardBackground(theme)} backdrop-blur-sm ${getBorderColor(theme)}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className={getTextColor(theme)}>
          بریم که یک تجربه جدید و جذاب را شروع کنیم! 😎
        </p>
      </m.div>

      <div className="flex flex-col w-full gap-4 mt-4 sm:flex-row">
        <button
          onClick={onGetStarted}
          className="px-6 py-3 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-blue-400/30 rounded-lg shadow-[0_8px_16px_rgba(0,0,0,0.2)] cursor-pointer hover:bg-opacity-90 hover:shadow-[0_12px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm w-full sm:flex-1"
        >
          شروع کنید
        </button>
      </div>
    </>
  )
}

import { useState, useEffect, useMemo } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getFromStorage, setToStorage } from '@/common/storage';
import Modal from '@/components/modal';
import type { UserProfile } from '@/services/hooks/user/userService.hook';
import { useWidgetVisibility } from '@/context/widget-visibility.context';

interface CustomStep extends Step {
  gif?: string;
}

const Tooltip = ({ 
  step,
  index,
  size,
  backProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  skipProps,
}: any) => (
  <div 
    {...tooltipProps} 
    className="bg-gray-800/90 backdrop-blur-md rounded-lg p-4 border border-gray-700 shadow-xl max-w-md"
  >
    <div className="text-right">
      <div className="text-sm text-gray-400 mb-2">
        مرحله {index + 1} از {size}
      </div>
      <div className="text-white font-medium mb-4">
        {step.content}
      </div>
      {(step as CustomStep).gif && (
        <div className="mb-4 rounded-lg overflow-hidden flex justify-center">
          <img 
            src={(step as CustomStep).gif} 
            alt="راهنما" 
            className="w-1/2 h-auto rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-between items-center gap-2">
        <button
          {...skipProps}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          رد کردن
        </button>
        <div className="flex gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              قبلی
            </button>
          )}
          <button
            {...primaryProps}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isLastStep ? 'پایان' : 'بعدی'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const allSteps: CustomStep[] = [
  {
    target: '.navbar-layout button[aria-label="Settings"]',
    content: 'تنظیمات کلی برنامه را از اینجا می‌توانید تغییر دهید. \n مثل تنظیمات ظاهری ، تصویر زمینه ، اتصال حساب کاربری و ...',
    disableBeacon: true,
    gif: 'https://media.giphy.com/media/q3n6xsFnbY0BGoWtNR/giphy.gif'
  },
  {
    target: '.navbar-layout button[aria-label="Widgets"]',
    content: 'از این دکمه می‌توانید ویجت‌های نمایش داده شده را مدیریت کنید.',
    gif: 'https://media.giphy.com/media/hRR50qub2ffrvAZNkW/giphy.gif'
  },
  {
    target: '.sync-button-tour',
    content: 'از این دکمه برای همگام‌سازی اطلاعات خود با حساب کاربری استفاده کنید.',
    gif: 'https://media.giphy.com/media/zYGg7eC3OLazYYsymg/giphy.gif'
  },
  {
    target: '.friends-list-container',
    content: 'در این بخش می‌توانید دوستان خود را مدیریت کرده و وضعیت آنلاین بودن آن‌ها را مشاهده کنید.',
    gif: 'https://media.giphy.com/media/cjwzupAe493aGd0QIZ/giphy.gif'
  },
  {
    target: '.search-layout',
    content: 'از این قسمت می‌توانید به سرچ و ترندینگ خود دسترسی پیدا کنید..',
    gif: 'https://media.giphy.com/media/qEu4IiFJMEeDL8HZkf/giphy.gif'
  },
  {
    target: '.bookmarks-component',
    content: 'بوکمارک‌های خود را اینجا مدیریت کنید. می‌توانید لینک‌های مورد علاقه خود را ذخیره و دسته‌بندی کنید.',
    gif: 'https://media.giphy.com/media/Kdndd7lfEgzEAXA8yC/giphy.gif'
  },
  {
    target: '.widgetify-layout',
    content: 'این ویجت اطلاعات کلی و خلاصه‌ای از وضعیت روزانه شما را نمایش می‌دهد.',
    gif: 'https://media.giphy.com/media/5ZYSeb2HnqGfigJghz/giphy.gif'
  },
  {
    target: '.combo-widget',
    content: 'این ویجت ترکیبی، اخبار و نرخ ارز را در یک جا نمایش می‌دهد.',
  },
  {
    target: '.calendar-layout',
    content: 'تقویم شمسی با قابلیت نمایش مناسبت‌ها و رویدادهای مهم.',
    gif: 'https://media.giphy.com/media/NCCJiHN4OOkDPJbEiR/giphy.gif'
  },
  {
    target: '.tools-layout',
    content: 'ابزارهای مفید مانند تایمر پومودورو، اوقات شرعی و مدیریت رویدادها.',
    gif: 'https://media.giphy.com/media/NaA57tk3dCmoBXFs6z/giphy.gif'
  },
  {
    target: '.todos-layout',
    content: 'مدیریت کارهای روزانه و یادداشت‌های مهم.',
    gif: 'https://media.giphy.com/media/3n3cPYCMr5hF0kuVwV/giphy.gif'
  },
  {
    target: '.notes-layout',
    content: 'یادداشت‌های خود را اینجا بنویسید و مدیریت کنید.',
  },
  {
    target: '.youtube-layout',
    content: 'دسترسی سریع به اطلاعات چنل یوتیوب.',
  },
  {
    target: '.weather-layout',
    content: 'اطلاعات آب و هوا و پیش‌بینی وضعیت هوا.',
  },
  {
    target: '.arz-layout',
    content: 'نمایش لحظه ای نرخ ارز با امکان افزودن ارزهای مورد علاقه',
    gif: 'https://media.giphy.com/media/SXnhsnegafGkILt2ns/giphy.gif'
  },
];

export const GuideButton = () => {
  const [run, setRun] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const { visibility } = useWidgetVisibility();

  const filteredSteps = useMemo(() => {
    return allSteps.filter(step => {
      switch (step.target) {
        case '.friends-list-container':
          return visibility.enable_sync ?? true; 
        case '.search-layout':
          return true;
        case '.bookmarks-component':
          return true;
        case '.widgetify-layout':
          return visibility.widgetify;
        case '.combo-widget':
          return visibility.comboWidget;
        case '.calendar-layout':
          return visibility.calendar;
        case '.tools-layout':
          return visibility.tools;
        case '.todos-layout':
          return visibility.todos;
        case '.notes-layout':
          return visibility.notes;
        case '.youtube-layout':
          return visibility.youtube;
        case '.weather-layout':
          return visibility.weather;
        case '.arz-layout':
          return visibility.arzLive;
        case '.navbar-layout button[aria-label=\"Settings\"]':
        case '.navbar-layout button[aria-label=\"Widgets\"]':
        case '.sync-button-tour':
          return true;
        default:
          return true;
      }
    });
  }, [visibility]); 

  useEffect(() => {
    const checkGuideStatus = async () => {
      const hasCompletedGuide = await getFromStorage('hasCompletedGuide');
      const profile = await getFromStorage('profile');
      setUserProfile(profile);

      if (hasCompletedGuide) {
        setShowButton(false);
        return;
      }

      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      return () => clearTimeout(timer);
    };

    checkGuideStatus();
  }, []);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
      await setToStorage('hasCompletedGuide', true);
      setShowButton(false);
    }
  };

  const handleButtonClick = async () => {
    const hasSeenGuideTooltip = await getFromStorage('hasCompletedGuide');
    if (!hasSeenGuideTooltip) {
      setShowWelcomeModal(true);
      setShowTooltip(false); 
    } else {
      setRun(true);
    }
  };

  const handleStartGuide = async () => {
    setShowWelcomeModal(false);
    setRun(true);
    await setToStorage('hasCompletedGuide', true);
  };

  const handleCloseWelcomeModal = async () => {
    setShowWelcomeModal(false);
  };

  if (!showButton) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -5, 0],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3,
                y: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
              className="absolute -top-2 -right-2 w-64 p-3 bg-blue-500/95 backdrop-blur-md rounded-lg border border-blue-400 shadow-xl text-right transform -translate-y-full"
              style={{
                transformOrigin: 'bottom right',
                zIndex: 1000
              }}
            >
              <div className="relative">
                <p className="text-white text-sm font-medium mb-2">
                  برای آشنایی با قابلیت‌های ویجتی‌فای، روی این دکمه کلیک کنید
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleButtonClick}
          className="relative p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="شروع تور راهنما"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <QuestionMarkCircledIcon className="w-6 h-6" />
          {showTooltip && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                  '0 0 0 10px rgba(59, 130, 246, 0.3)',
                  '0 0 0 0 rgba(59, 130, 246, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>
      </div>

      <Modal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} size="sm" title="خوش آمدید!" direction="rtl">
        <div className="flex flex-col items-center justify-center text-center p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {userProfile?.name ? 
              `${userProfile.name} ، خیلی خوش آمدید به راهنمای ویجتی‌فای! با دنبال کردن مراحل کوتاه، با امکانات اصلی برنامه آشنا خواهید شد.`
              : 
              `رفیق عزیز، خیلی خوش آمدید به راهنمای ویجتی‌فای! با دنبال کردن مراحل کوتاه، با امکانات اصلی برنامه آشنا خواهید شد.`
            }
          </p>
          <button
            onClick={handleStartGuide}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            بزن بریم
          </button>
        </div>
      </Modal>

      <Joyride
        steps={filteredSteps}
        run={run}
        continuous
        showProgress={false}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 1000,
            primaryColor: '#3B82F6',
            arrowColor: '#1F2937',
            backgroundColor: '#1F2937',
            textColor: '#F3F4F6',
            overlayColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
        tooltipComponent={Tooltip}
      />
    </>
  );
}; 
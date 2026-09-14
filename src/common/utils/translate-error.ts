const errorTranslations: Record<string, string> = {
	ACTIVITY_ALREADY_EXISTS: 'فقط یک نوشته می‌تونی داشته باشی',
	MAX_SHARED_USERS_EXCEEDED: 'تعداد کاربران قابل اشتراک این تسک بیشتر از حد مجازه',
	ACTIVITY_NOT_FOUND: 'نوشته پیدا نشد',
	// Authentication errors
	INVALID_PASS_MAIL: 'ایمیل یا رمز عبور اشتباه است',
	INVALID_CREDENTIALS: 'اطلاعات ورود نامعتبر است',
	EMAIL_ALREADY_EXISTS: 'این ایمیل از قبل ثبت شده',
	USER_NOT_FOUND: 'کاربر پیدا نشد',
	TOKEN_EXPIRED: 'نشست شما منقضی شده، لطفا دوباره وارد شو',
	INVALID_TOKEN: 'توکن احراز هویت نامعتبر است',
	UNAUTHORIZED: 'مجوز دسترسی به این بخش رو نداری',
	FORBIDDEN: 'دسترسی به این بخش محدود شده',

	// Rate-limit & OTP errors
	OTP_RATE_LIMIT: 'کد تایید به تازگی ارسال شده، کمی صبر کن',
	FORGOT_PASSWORD_REQUEST_LIMIT:
		'تعداد درخواست‌های بازیابی رمز عبور بیش از حد مجازه، لطفا بعدا امتحان کن',
	RESET_TOKEN_EXPIRED: 'لینک بازیابی رمز عبور منقضی شده، درخواست جدید ارسال کن',
	INVALID_RESET_TOKEN: 'لینک بازیابی رمز عبور نامعتبر است',

	// Validation errors
	WEAK_PASSWORD: 'رمز عبور ضعیفه، از حروف، اعداد و نمادها استفاده کن',
	PASSWORD_TOO_SHORT: 'رمز عبور باید حداقل ۸ کاراکتر باشه',
	INVALID_EMAIL_FORMAT: 'فرمت ایمیل نامعتبر است',
	NAME_REQUIRED: 'نام کاربری الزامی است',
	INVALID_INPUTS: 'اطلاعات وارد شده نامعتبر است',

	// HTTP status errors
	INTERNAL_SERVER_ERROR: 'خطای داخلی سرور رخ داده',
	SERVICE_UNAVAILABLE: 'سرویس در دسترس نیست',
	TOO_MANY_REQUESTS: 'تعداد درخواست‌ها بیش از حد مجازه، کمی صبر کن',
	BAD_REQUEST: 'درخواست نامعتبر است',
	NOT_FOUND: 'موردی پیدا نشد',
	ACTIVITY_UPDATE_RATE_LIMIT_EXCEEDED:
		'تعداد درخواست‌ها برای بروزرسانی وضعیت بیش از حد مجازه، کمی صبر کن',
	// Friend-related errors
	CANT_REQUEST_YOURSELF: 'نمی‌تونی به خودت درخواست دوستی بفرستی',
	FRIEND_REQUEST_ALREADY_SENT: 'درخواست دوستی قبلا ارسال شده',
	FRIEND_REQUEST_ALREADY_EXISTS: 'درخواست دوستی از قبل وجود داره',
	FAILED_TO_FETCH_FRIENDS: 'خطا در دریافت لیست دوستان',
	FAILED_TO_SEND_REQUEST: 'خطا در ارسال درخواست دوستی',
	FAILED_TO_ACCEPT_REQUEST: 'خطا در پذیرش درخواست دوستی',
	FAILED_TO_REMOVE_FRIEND: 'خطا در حذف دوست',
	FRIEND_REQUEST_SENT: 'درخواست دوستی ارسال شد',
	FRIEND_REQUEST_NOT_FOUND: 'درخواست دوستی پیدا نشد',
	SET_USERNAME_FIRST: 'اول نام کاربریت رو تنظیم کن',

	// Translate-related errors
	SOURCE_AND_TARGET_LANG_MUST_BE_DIFFERENT: 'زبان مبدأ و مقصد نمی‌تونن یکسان باشن',
	TARGET_LANG_CANNOT_BE_AUTO: 'زبان مقصد نمی‌تونه تشخیص خودکار باشه',
	TRANSLATION_FAILED: 'خطا در ترجمه متن',
	FAILED_TO_FETCH_LANGUAGES: 'خطا در دریافت لیست زبان‌ها',
	INVALID_LANGUAGE_CODE: 'کد زبان نامعتبر است',
	TEXT_TOO_LONG: 'متن برای ترجمه خیلی طولانیه',
	EMPTY_TEXT: 'متن برای ترجمه نمی‌تونه خالی باشه',
	TRANSLATION_QUOTA_EXCEEDED: 'سهمیه ترجمه به پایان رسیده',
	// Success messages
	SUCCESS: 'عملیات با موفقیت انجام شد',

	// Widget-related messages
	WIDGET_NOT_FOUND: 'ویجت پیدا نشد',
	WIDGET_DELETED: 'ویجت حذف شد',
	WIDGET_DUPLICATED: 'ویجت تکرار شد',
	WIDGET_ALREADY_EXISTS: 'این ویجت از قبل به صفحه اضافه شده',
	INVALID_WIDGET_POSITION: 'موقعیت قرارگیری ویجت درست نیست',
	STORAGE_QUOTA_EXCEEDED: 'فضای ذخیره‌سازی عکس‌های ویجت پر شده',
	WIDGET_LIMIT_EXCEEDED: 'تعداد ویجت‌های مجاز پر شده',
	MAX_WIDGETS_REACHED:
		'به سقف تعداد ویجت‌ها رسیدی، یکی از قبلی‌ها رو حذف کن تا جا باز بشه',
	NO_SPACE_FOR_WIDGET:
		'روی صفحه جا نیست، چند تا ویجت رو جابه‌جا یا حذف کن تا جا باز بشه',
	NO_SPACE_FOR_DUPLICATE: 'روی صفحه جا نیست، برای تکرار ویجت کمی فضا باز کن',

	// Bookmark-related messages
	BOOKMARK_DELETED: 'نشانک حذف شد',
	BOOKMARK_ADDED: 'نشانک اضافه شد',
	BOOKMARK_UPDATED: 'نشانک ویرایش شد',
	BOOKMARK_PARENT_NOT_FOUND: 'پوشه پیدا نشد',
	FILE_SIZE_EXCEEDED: 'حجم فایل بیشتر از حد مجازه',

	// Network errors
	NETWORK_ERROR: 'خطای شبکه، اتصال اینترنتت رو بررسی کن',
	CONNECTION_TIMEOUT: 'زمان اتصال به پایان رسید، دوباره امتحان کن',
	CONNECTION_REFUSED: 'اتصال برقرار نشد، بعدا امتحان کن',

	FIRST_VERIFY_YOUR_ACCOUNT: 'اول باید حساب کاربریت رو تایید کنی',
	USERNAME_ALREADY_EXISTS: 'این نام کاربری از قبل وجود داره',
	INVALID_FILE_TYPE: 'نوع فایل نامعتبر است',
	NOT_ENOUGH_COINS: 'ویج‌کوین‌هات کافی نیست',
	INVALID_REFERRAL_CODE: 'کد دعوت نامعتبر است',
	ITEM_ALREADY_EXISTS: 'این رو از قبل با ویج‌کوین گرفتی — نیازی به خرید دوباره نیست',

	INVALID_ID: 'شناسه نامعتبر است',

	DATE_OUT_OF_RANGE: 'تاریخ انتخاب شده خارج از محدوده مجازه',

	ITEM_NOT_FOUND: 'مورد پیدا نشد',
	TODO_NOT_FOUND: 'تسک پیدا نشد',
	INVALID_OTP_CODE: 'کد تایید اشتباهه، دوباره امتحان کن',
	USE_EMAIL_FOR_OTP: 'لطفا فعلا از ایمیل برای دریافت کد تایید استفاده کن',
	USE_PHONE_FOR_OTP: 'لطفا فعلا از شماره موبایل برای دریافت کد تایید استفاده کن',

	INVALID_OCCUPATION_ID: 'شغل نامعتبری انتخاب کردی',
	ONE_OR_MORE_INVALID_INTEREST_IDS:
		'یک یا چند تا از علاقه‌مندی‌هایی که انتخاب کردی نامعتبر هستن',

	TOO_MANY_ATTEMPTS: 'تعداد تلاش‌ها بیش از حد مجازه',
	OTP_EXPIRED: 'کد منقضی شده',
	INVALID_PHONE_NUMBER_FORMAT: 'فرمت شماره وارد شده نامعتبره',
	CANNOT_CHANGE_PHONE_NUMBER: 'نمی‌تونی شماره موبایل رو تغییر بدی',

	SAME_PHONE_NUMBER_ERROR: 'شماره موبایل تکراریه',
	PHONE_NUMBER_ALREADY_EXISTS: 'این شماره موبایل از قبل ثبت شده',
	INVALID_VERIFICATION_CODE: 'کد تایید نامعتبره',
	CANNOT_CHANGE_EMAIL: 'نمی‌تونی ایمیل رو تغییر بدی',
	SAME_EMAIL_ERROR: 'ایمیل تکراریه',
	FIRST_SET_EMAIL: 'هنوز ایمیل ثبت نکردی',

	PACKAGE_NOT_FOUND: 'بسته پیدا نشد',
	PAYMENT_FAILED: 'پرداخت ناموفق بود، دوباره امتحان کن',
	PAYMENT_ALREADY_PROCESSED: 'این پرداخت از قبل پردازش شده',
	PAYMENT_NOT_FOUND: 'پرداخت پیدا نشد',

	TRY_NEXT_TIME: 'مشکلی پیش اومد، لطفا بعدا دوباره امتحان کن',

	TOO_MANY_ATTEMPTS_HABIT: 'بیش از حد مجاز نمی‌تونی بسازی',

	FOLDER_STRUCTURE_TOO_DEEP: 'عمق ساختار پوشه‌ها بیش از حد مجازه',
	BULK_IMPORT_LIMIT_EXCEEDED: `تعداد آیتم‌های درون‌ریزی بیش از حد مجازه`,
	NO_VALID_ITEMS_TO_IMPORT: 'هیچ آیتم معتبری برای درون‌ریزی وجود نداره',
	BIRTHDATE_CANNOT_BE_CHANGED: 'به تازگی تاریخ تولدت رو عوض کردی',
	VIP_REQUIRED: 'این قابلیت فقط برای کاربران پرو در دسترسه',
	UPLOAD_IN_PROGRESS: 'فایل در حال آپلوده، کمی صبر کن',
	CUSTOM_WALLPAPER_REMOVED: 'تصویر پس‌زمینه حذف شد',
	UPLOAD_FAILED: 'خطا در آپلود فایل، دوباره امتحان کن',
}

const validationTranslations: Record<string, string> = {
	'password must be longer than or equal to 8 characters':
		'رمز عبور باید حداقل ۸ کاراکتر باشه',
	'password must contain at least 1 uppercase letter':
		'رمز عبور باید حداقل یک حرف بزرگ داشته باشه',
	'password must contain at least 1 lowercase letter':
		'رمز عبور باید حداقل یک حرف کوچک داشته باشه',
	'password must contain at least 1 number': 'رمز عبور باید حداقل یک عدد داشته باشه',
	'password must contain at least 1 symbol':
		'رمز عبور باید حداقل یک نماد (مانند @#$%) داشته باشه',
	'password must be a string': 'رمز عبور باید متن باشه',
	'password should not be empty': 'رمز عبور نمی‌تونه خالی باشه',

	'email must be an email': 'فرمت ایمیل نامعتبر است',
	'email should not be empty': 'ایمیل نمی‌تونه خالی باشه',
	'email must be a string': 'ایمیل باید متن باشه',

	'name should not be empty': 'نام کاربری نمی‌تونه خالی باشه',
	'name must be a string': 'نام کاربری باید متن باشه',
	'name must be longer than or equal to 3 characters':
		'نام کاربری باید حداقل ۳ کاراکتر باشه',
	'name must be shorter than or equal to 50 characters':
		'نام کاربری باید حداکثر ۵۰ کاراکتر باشه',

	// Widget-specific validation messages
	'widget title should not be empty': 'عنوان ویجت نمی‌تونه خالی باشه',
	'widget position must be valid': 'موقعیت ویجت نامعتبر است',
	'widget size must be valid': 'اندازه ویجت نامعتبر است',

	// Friend-related validation messages
	'username should not be empty': 'نام کاربری نمی‌تونه خالی باشه',
	'username does not exist': 'این نام کاربری وجود نداره',
	'cannot send friend request to yourself': 'نمی‌تونی به خودت درخواست دوستی بفرستی',
	'friend request already sent': 'درخواست دوستی قبلا ارسال شده',
	'name must be longer than or equal to 2 characters':
		'وارد کردن نام کاربری الزامی است',
	CONTENT_CONTAINS_PROFANITY: 'محتوا شامل کلمات یا عبارات نامناسب است',
}

export function translateValidationMessage(message: string): string {
	return validationTranslations[message] || message
}

export function translateError(error: any): string | Record<string, string> {
	const defaultMessage = 'خطایی رخ داده، لطفا دوباره امتحان کن'

	if (!error) return defaultMessage

	if (
		error.response?.data?.formValidation &&
		Array.isArray(error.response.data.formValidation)
	) {
		const fieldErrors: Record<string, string> = {}

		for (const validationError of error.response.data.formValidation) {
			const fieldName = validationError.property
			const errorMessage = translateValidationMessage(validationError.message)
			fieldErrors[fieldName] = errorMessage
		}

		if (Object.keys(fieldErrors).length > 0) {
			return fieldErrors
		}
	}

	let errorMessage: string | undefined

	if (typeof error === 'string') {
		errorMessage = error
	} else if (error.response?.data?.message) {
		errorMessage = error.response.data.message
	} else if (error.message) {
		errorMessage = error.message
	}

	if (!errorMessage) return defaultMessage

	return errorTranslations[errorMessage] || errorMessage || defaultMessage
}

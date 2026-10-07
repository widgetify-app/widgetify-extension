const errorTranslations: Record<string, string> = {
	ACTIVITY_ALREADY_EXISTS: 'فعلاً فقط یه نوشته می‌تونی داشته باشی',
	MAX_SHARED_USERS_EXCEEDED: 'این تسک رو با بیشتر از این تعداد نمی‌شه به اشتراک گذاشت',
	ACTIVITY_NOT_FOUND: 'این نوشته رو پیدا نکردیم',
	// Authentication errors
	INVALID_PASS_MAIL: 'ایمیل یا رمز عبور درست نیست',
	INVALID_CREDENTIALS: 'اطلاعات ورود درست نیست، یه بار دیگه چک کن',
	EMAIL_ALREADY_EXISTS: 'این ایمیل از قبل ثبت شده',
	USER_NOT_FOUND: 'این کاربر رو پیدا نکردیم',
	TOKEN_EXPIRED: 'ورودت منقضی شده، دوباره وارد حسابت شو',
	INVALID_TOKEN: 'ورودت دیگه معتبر نیست، دوباره وارد حسابت شو',
	UNAUTHORIZED: 'به این بخش دسترسی نداری',
	FORBIDDEN: 'دسترسی به این بخش محدود شده',

	// Rate-limit & OTP errors
	OTP_RATE_LIMIT: 'همین الان یه کد برات فرستادیم، یه کم صبر کن',
	FORGOT_PASSWORD_REQUEST_LIMIT:
		'زیادی درخواست بازیابی رمز دادی، یه کم بعد دوباره امتحان کن',
	RESET_TOKEN_EXPIRED: 'لینک بازیابی رمز عبور منقضی شده، یه لینک جدید بگیر',
	INVALID_RESET_TOKEN: 'این لینک بازیابی رمز عبور درست نیست',

	// Validation errors
	WEAK_PASSWORD: 'رمز عبور ضعیفه، از حروف، اعداد و نمادها استفاده کن',
	PASSWORD_TOO_SHORT: 'رمز عبور باید حداقل ۸ کاراکتر باشه',
	INVALID_EMAIL_FORMAT: 'این ایمیل درست به نظر نمی‌رسه',
	NAME_REQUIRED: 'نام کاربری رو بنویس',
	INVALID_INPUTS: 'یه چیزی توی اطلاعاتی که وارد کردی درست نیست',

	// HTTP status errors
	INTERNAL_SERVER_ERROR: 'سرور به مشکل خورده، یه کم بعد دوباره امتحان کن',
	SERVICE_UNAVAILABLE: 'سرویس الان در دسترس نیست، یه کم بعد دوباره امتحان کن',
	TOO_MANY_REQUESTS: 'یه کم تند رفتی، چند لحظه صبر کن و دوباره امتحان کن',
	BAD_REQUEST: 'این درخواست درست نبود، دوباره امتحان کن',
	NOT_FOUND: 'چیزی پیدا نکردیم',
	ACTIVITY_UPDATE_RATE_LIMIT_EXCEEDED: 'وضعیتت رو زیادی عوض کردی، یه کم صبر کن',
	// Friend-related errors
	CANT_REQUEST_YOURSELF: 'نمی‌تونی به خودت درخواست دوستی بفرستی',
	FRIEND_REQUEST_ALREADY_SENT: 'قبلاً براش درخواست دوستی فرستادی',
	FRIEND_REQUEST_ALREADY_EXISTS: 'از قبل یه درخواست دوستی بینتون هست',
	FAILED_TO_FETCH_FRIENDS: 'نتونستیم فهرست دوستات رو بیاریم',
	FAILED_TO_SEND_REQUEST: 'نتونستیم درخواست دوستی رو بفرستیم',
	FAILED_TO_ACCEPT_REQUEST: 'نتونستیم درخواست دوستی رو قبول کنیم',
	FAILED_TO_REMOVE_FRIEND: 'نتونستیم این دوست رو حذف کنیم',
	FRIEND_REQUEST_SENT: 'درخواست دوستی فرستاده شد',
	FRIEND_REQUEST_NOT_FOUND: 'این درخواست دوستی رو پیدا نکردیم',
	SET_USERNAME_FIRST: 'اول نام کاربریت رو تنظیم کن',

	// Translate-related errors
	SOURCE_AND_TARGET_LANG_MUST_BE_DIFFERENT: 'زبان مبدأ و مقصد نمی‌تونن یکسان باشن',
	TARGET_LANG_CANNOT_BE_AUTO: 'زبان مقصد نمی‌تونه تشخیص خودکار باشه',
	TRANSLATION_FAILED: 'نتونستیم متن رو ترجمه کنیم',
	FAILED_TO_FETCH_LANGUAGES: 'نتونستیم فهرست زبان‌ها رو بیاریم',
	INVALID_LANGUAGE_CODE: 'این زبان رو نمی‌شناسیم',
	TEXT_TOO_LONG: 'متن برای ترجمه خیلی طولانیه',
	EMPTY_TEXT: 'متن برای ترجمه نمی‌تونه خالی باشه',
	TRANSLATION_QUOTA_EXCEEDED: 'سهمیه‌ی ترجمه‌ت تموم شده',
	// Success messages
	SUCCESS: 'انجام شد',

	// Widget-related messages
	WIDGET_NOT_FOUND: 'این ویجت رو پیدا نکردیم',
	WIDGET_DELETED: 'ویجت حذف شد',
	WIDGET_DUPLICATED: 'ویجت تکرار شد',
	WIDGET_ALREADY_EXISTS: 'این ویجت از قبل به صفحه اضافه شده',
	INVALID_WIDGET_POSITION: 'موقعیت قرارگیری ویجت درست نیست',
	STORAGE_QUOTA_EXCEEDED: 'فضای ذخیره‌سازی عکس‌های ویجت پر شده',
	WIDGET_LIMIT_EXCEEDED: 'به سقف تعداد ویجت‌ها رسیدی',
	MAX_WIDGETS_REACHED:
		'به سقف تعداد ویجت‌ها رسیدی، یکی از قبلی‌ها رو حذف کن تا جا باز بشه',
	NO_SPACE_FOR_WIDGET:
		'روی صفحه جا نیست، چند تا ویجت رو جابه‌جا یا حذف کن تا جا باز بشه',
	NO_SPACE_FOR_DUPLICATE: 'روی صفحه جا نیست، برای تکرار ویجت کمی فضا باز کن',

	// Bookmark-related messages
	BOOKMARK_DELETED: 'بوکمارک حذف شد',
	BOOKMARK_ADDED: 'بوکمارک اضافه شد',
	BOOKMARK_UPDATED: 'بوکمارک ویرایش شد',
	BOOKMARK_PARENT_NOT_FOUND: 'این پوشه رو پیدا نکردیم',
	FILE_SIZE_EXCEEDED: 'این فایل زیادی بزرگه',

	// Network errors
	NETWORK_ERROR: 'اینترنتت رو چک کن و دوباره امتحان کن',
	CONNECTION_TIMEOUT: 'جواب دیر رسید، دوباره امتحان کن',
	CONNECTION_REFUSED: 'نتونستیم وصل بشیم، یه کم بعد دوباره امتحان کن',

	FIRST_VERIFY_YOUR_ACCOUNT: 'اول حسابت رو تایید کن',
	USERNAME_ALREADY_EXISTS: 'این نام کاربری رو قبلاً یکی برداشته',
	INVALID_FILE_TYPE: 'این نوع فایل پشتیبانی نمی‌شه',
	NOT_ENOUGH_COINS: 'ویج‌کوین‌هات کافی نیست',
	INVALID_REFERRAL_CODE: 'این کد دعوت درست نیست',
	ITEM_ALREADY_EXISTS: 'این رو قبلاً گرفتی و مال توئه، لازم نیست دوباره بخریش',

	INVALID_ID: 'یه چیزی درست نیست، دوباره امتحان کن',

	DATE_OUT_OF_RANGE: 'این تاریخ رو نمی‌شه انتخاب کرد',

	ITEM_NOT_FOUND: 'پیداش نکردیم',
	TODO_NOT_FOUND: 'این تسک رو پیدا نکردیم',
	INVALID_OTP_CODE: 'کد تایید اشتباهه، دوباره امتحان کن',
	USE_EMAIL_FOR_OTP: 'فعلاً کد تایید رو با ایمیل بگیر',
	USE_PHONE_FOR_OTP: 'فعلاً کد تایید رو با شماره موبایل بگیر',

	INVALID_OCCUPATION_ID: 'این شغل توی فهرست نیست، یکی دیگه انتخاب کن',
	ONE_OR_MORE_INVALID_INTEREST_IDS:
		'چند تا از علاقه‌مندی‌هایی که انتخاب کردی توی فهرست نیستن',

	TOO_MANY_ATTEMPTS: 'زیادی امتحان کردی، یه کم صبر کن',
	OTP_EXPIRED: 'این کد منقضی شده، یه کد جدید بگیر',
	INVALID_PHONE_NUMBER_FORMAT: 'این شماره درست به نظر نمی‌رسه',
	CANNOT_CHANGE_PHONE_NUMBER: 'نمی‌تونی شماره موبایل رو تغییر بدی',

	SAME_PHONE_NUMBER_ERROR: 'این همون شماره‌ی فعلیته',
	PHONE_NUMBER_ALREADY_EXISTS: 'این شماره موبایل از قبل ثبت شده',
	INVALID_VERIFICATION_CODE: 'کد تایید درست نیست',
	CANNOT_CHANGE_EMAIL: 'نمی‌تونی ایمیل رو تغییر بدی',
	SAME_EMAIL_ERROR: 'این همون ایمیل فعلیته',
	FIRST_SET_EMAIL: 'هنوز ایمیل ثبت نکردی',

	PACKAGE_NOT_FOUND: 'این بسته رو پیدا نکردیم',
	PAYMENT_FAILED: 'پرداخت انجام نشد، دوباره امتحان کن',
	PAYMENT_ALREADY_PROCESSED: 'این پرداخت قبلاً انجام شده',
	PAYMENT_NOT_FOUND: 'این پرداخت رو پیدا نکردیم',

	TRY_NEXT_TIME: 'یه مشکلی پیش اومد، یه کم بعد دوباره امتحان کن',

	TOO_MANY_ATTEMPTS_HABIT: 'بیشتر از این نمی‌تونی بسازی',

	FOLDER_STRUCTURE_TOO_DEEP: 'پوشه‌ها زیادی تو در تو شدن',
	BULK_IMPORT_LIMIT_EXCEEDED: 'این تعداد رو یه‌جا نمی‌شه درون‌ریزی کرد',
	NO_VALID_ITEMS_TO_IMPORT: 'چیزی برای درون‌ریزی پیدا نکردیم',
	BIRTHDATE_CANNOT_BE_CHANGED:
		'تازه تاریخ تولدت رو عوض کردی، فعلاً نمی‌شه دوباره عوضش کرد',
	VIP_REQUIRED: 'این قابلیت مال نسخه‌ی پروئه',
	UPLOAD_IN_PROGRESS: 'داریم فایل رو آپلود می‌کنیم، یه کم صبر کن',
	CUSTOM_WALLPAPER_REMOVED: 'تصویر پس‌زمینه حذف شد',
	UPLOAD_FAILED: 'نتونستیم فایل رو آپلود کنیم، دوباره امتحان کن',
}

const validationTranslations: Record<string, string> = {
	'password must be longer than or equal to 8 characters':
		'رمز عبور باید حداقل ۸ کاراکتر باشه',
	'password must contain at least 1 uppercase letter':
		'رمز عبور باید حداقل یه حرف بزرگ داشته باشه',
	'password must contain at least 1 lowercase letter':
		'رمز عبور باید حداقل یه حرف کوچک داشته باشه',
	'password must contain at least 1 number': 'رمز عبور باید حداقل یه عدد داشته باشه',
	'password must contain at least 1 symbol':
		'رمز عبور باید حداقل یه نماد مثل @#$% داشته باشه',
	'password must be a string': 'رمز عبور باید متن باشه',
	'password should not be empty': 'رمز عبور نمی‌تونه خالی باشه',

	'email must be an email': 'این ایمیل درست به نظر نمی‌رسه',
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
	'widget position must be valid': 'جای ویجت درست نیست',
	'widget size must be valid': 'اندازه‌ی ویجت درست نیست',

	// Friend-related validation messages
	'username should not be empty': 'نام کاربری نمی‌تونه خالی باشه',
	'username does not exist': 'این نام کاربری وجود نداره',
	'cannot send friend request to yourself': 'نمی‌تونی به خودت درخواست دوستی بفرستی',
	'friend request already sent': 'قبلاً براش درخواست دوستی فرستادی',
	'name must be longer than or equal to 2 characters': 'نام کاربری رو بنویس',
	CONTENT_CONTAINS_PROFANITY: 'توی متنت کلمه‌ی نامناسب هست، یه کم عوضش کن',
}

function translateValidationMessage(message: string): string {
	return validationTranslations[message] || message
}

export function translateError(error: any): string | Record<string, string> {
	const defaultMessage = 'یه مشکلی پیش اومد، دوباره امتحان کن'

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

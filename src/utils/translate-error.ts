export function translateValidationMessage(message: string): string {
	const validationTranslations: Record<string, string> = {
		'password must be longer than or equal to 8 characters':
			'رمز عبور باید حداقل 8 کاراکتر باشد',
		'password must contain at least 1 uppercase letter':
			'رمز عبور باید حداقل شامل یک حرف بزرگ باشد',
		'password must contain at least 1 lowercase letter':
			'رمز عبور باید حداقل شامل یک حرف کوچک باشد',
		'password must contain at least 1 number': 'رمز عبور باید حداقل شامل یک عدد باشد',
		'password must contain at least 1 symbol':
			'رمز عبور باید حداقل شامل یک نماد (مانند @#$%) باشد',
		'password must be a string': 'رمز عبور باید متن باشد',
		'password should not be empty': 'رمز عبور نمی‌تواند خالی باشد',

		'email must be an email': 'فرمت ایمیل نامعتبر است',
		'email should not be empty': 'ایمیل نمی‌تواند خالی باشد',
		'email must be a string': 'ایمیل باید متن باشد',

		'name should not be empty': 'نام کاربری نمی‌تواند خالی باشد',
		'name must be a string': 'نام کاربری باید متن باشد',
		'name must be longer than or equal to 3 characters':
			'نام کاربری باید حداقل 3 کاراکتر باشد',
		'name must be shorter than or equal to 50 characters':
			'نام کاربری باید حداکثر 50 کاراکتر باشد',

		// Widget-specific validation messages
		'widget title should not be empty': 'عنوان ویجت نمی‌تواند خالی باشد',
		'widget position must be valid': 'موقعیت ویجت نامعتبر است',
		'widget size must be valid': 'اندازه ویجت نامعتبر است',

		// Friend-related validation messages
		'username should not be empty': 'نام کاربری نمی‌تواند خالی باشد',
		'username does not exist': 'این نام کاربری وجود ندارد',
		'cannot send friend request to yourself':
			'نمی‌توانید به خودتان درخواست دوستی ارسال کنید',
		'friend request already sent': 'درخواست دوستی قبلا ارسال شده است',
	}

	return validationTranslations[message] || message
}

export function translateError(error: any): string | Record<string, string> {
	const defaultMessage = 'خطایی رخ داده است. لطفا دوباره تلاش کنید'

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

	const errorTranslations: Record<string, string> = {
		// Authentication errors
		INVALID_PASS_MAIL: 'ایمیل یا رمز عبور اشتباه است',
		INVALID_CREDENTIALS: 'اطلاعات ورود نامعتبر است',
		EMAIL_ALREADY_EXISTS: 'این ایمیل قبلا ثبت شده است',
		USER_NOT_FOUND: 'کاربر یافت نشد',
		TOKEN_EXPIRED: 'نشست شما منقضی شده است. لطفا دوباره وارد شوید',
		INVALID_TOKEN: 'توکن احراز هویت نامعتبر است',
		UNAUTHORIZED: 'شما مجوز دسترسی به این بخش را ندارید',
		FORBIDDEN: 'دسترسی به این بخش محدود شده است',

		// Password reset errors
		FORGOT_PASSWORD_REQUEST_LIMIT:
			'تعداد درخواست‌های بازیابی رمز عبور به حد مجاز رسیده است. لطفاً بعداً تلاش کنید',
		RESET_TOKEN_EXPIRED:
			'لینک بازیابی رمز عبور منقضی شده است. لطفا درخواست جدید ارسال کنید',
		INVALID_RESET_TOKEN: 'لینک بازیابی رمز عبور نامعتبر است',

		// Validation errors
		WEAK_PASSWORD: 'رمز عبور ضعیف است. از حروف، اعداد و نمادها استفاده کنید',
		PASSWORD_TOO_SHORT: 'رمز عبور باید حداقل 8 کاراکتر باشد',
		INVALID_EMAIL_FORMAT: 'فرمت ایمیل نامعتبر است',
		NAME_REQUIRED: 'نام کاربری الزامی است',
		INVALID_INPUTS: 'اطلاعات وارد شده نامعتبر است',

		// HTTP status errors
		INTERNAL_SERVER_ERROR: 'خطای داخلی سرور رخ داده است',
		SERVICE_UNAVAILABLE: 'سرویس در حال حاضر در دسترس نیست',
		TOO_MANY_REQUESTS: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید',
		BAD_REQUEST: 'درخواست نامعتبر است',
		NOT_FOUND: 'منبع درخواستی یافت نشد',
		ACTIVITY_UPDATE_RATE_LIMIT_EXCEEDED:
			'تعداد درخواست‌ها برای بروزرسانی "وضعیت" بیش از حد مجاز است. لطفاً کمی صبر کنید',
		// Friend-related errors
		CANT_REQUEST_YOURSELF: 'نمی‌توانید به خودتان درخواست دوستی ارسال کنید',
		FRIEND_REQUEST_ALREADY_SENT: 'درخواست دوستی قبلاً ارسال شده است',
		FRIEND_REQUEST_ALREADY_EXISTS: 'درخواست دوستی قبلاً وجود دارد',
		FAILED_TO_FETCH_FRIENDS: 'خطا در دریافت لیست دوستان',
		FAILED_TO_SEND_REQUEST: 'خطا در ارسال درخواست دوستی',
		FAILED_TO_ACCEPT_REQUEST: 'خطا در پذیرش درخواست دوستی',
		FAILED_TO_REMOVE_FRIEND: 'خطا در حذف دوست',
		FRIEND_REQUEST_SENT: 'درخواست دوستی ارسال شد',
		FRIEND_REQUEST_NOT_FOUND: 'درخواست دوستی یافت نشد',
		SET_USERNAME_FIRST: 'لطفاً ابتدا نام کاربری خود را تنظیم کنید',

		// Translate-related errors
		SOURCE_AND_TARGET_LANG_MUST_BE_DIFFERENT:
			'زبان مبدأ و مقصد نمی‌توانند یکسان باشند',
		TARGET_LANG_CANNOT_BE_AUTO: 'زبان مقصد نمی‌تواند تشخیص خودکار باشد',
		TRANSLATION_FAILED: 'خطا در ترجمه متن',
		FAILED_TO_FETCH_LANGUAGES: 'خطا در دریافت لیست زبان‌ها',
		INVALID_LANGUAGE_CODE: 'کد زبان نامعتبر است',
		TEXT_TOO_LONG: 'متن برای ترجمه خیلی طولانی است',
		EMPTY_TEXT: 'متن برای ترجمه نمی‌تواند خالی باشد',
		TRANSLATION_QUOTA_EXCEEDED: 'سهمیه ترجمه شما به پایان رسیده است',
		// Success messages
		SUCCESS: 'عملیات با موفقیت انجام شد',

		// Widget-related errors
		WIDGET_NOT_FOUND: 'ویجت مورد نظر یافت نشد',
		WIDGET_ALREADY_EXISTS: 'این ویجت قبلاً اضافه شده است',
		INVALID_WIDGET_POSITION: 'موقعیت ویجت نامعتبر است',
		MAX_WIDGETS_REACHED: 'به حداکثر تعداد مجاز ویجت رسیده‌اید',

		// Network errors
		NETWORK_ERROR: 'خطای شبکه. لطفا اتصال اینترنت خود را بررسی کنید',
		CONNECTION_TIMEOUT: 'زمان اتصال به پایان رسید. لطفا مجدداً تلاش کنید',
		CONNECTION_REFUSED: 'اتصال رد شد. لطفا بعداً تلاش کنید',

		FIRST_VERIFY_YOUR_ACCOUNT: 'ابتدا حساب کاربری خود را تایید کنید',
	}
	return errorTranslations[errorMessage] || errorMessage || defaultMessage
}

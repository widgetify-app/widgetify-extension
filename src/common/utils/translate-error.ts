import { t, type MessageKey } from '@/common/i18n'

type ErrorKey = Extract<MessageKey, `error.${string}`>

const ERROR_KEYS: Record<string, ErrorKey> = {
	ACTIVITY_ALREADY_EXISTS: 'error.activityAlreadyExists',
	MAX_SHARED_USERS_EXCEEDED: 'error.maxSharedUsersExceeded',
	ACTIVITY_NOT_FOUND: 'error.activityNotFound',
	// Authentication errors
	INVALID_PASS_MAIL: 'error.invalidPassMail',
	INVALID_CREDENTIALS: 'error.invalidCredentials',
	EMAIL_ALREADY_EXISTS: 'error.emailAlreadyExists',
	USER_NOT_FOUND: 'error.userNotFound',
	TOKEN_EXPIRED: 'error.tokenExpired',
	INVALID_TOKEN: 'error.invalidToken',
	UNAUTHORIZED: 'error.unauthorized',
	FORBIDDEN: 'error.forbidden',

	// Rate-limit & OTP errors
	OTP_RATE_LIMIT: 'error.otpRateLimit',
	FORGOT_PASSWORD_REQUEST_LIMIT: 'error.forgotPasswordRequestLimit',
	RESET_TOKEN_EXPIRED: 'error.resetTokenExpired',
	INVALID_RESET_TOKEN: 'error.invalidResetToken',

	// Validation errors
	WEAK_PASSWORD: 'error.weakPassword',
	PASSWORD_TOO_SHORT: 'error.passwordTooShort',
	INVALID_EMAIL_FORMAT: 'error.invalidEmailFormat',
	NAME_REQUIRED: 'error.nameRequired',
	INVALID_INPUTS: 'error.invalidInputs',

	// HTTP status errors
	INTERNAL_SERVER_ERROR: 'error.internalServerError',
	SERVICE_UNAVAILABLE: 'error.serviceUnavailable',
	TOO_MANY_REQUESTS: 'error.tooManyRequests',
	BAD_REQUEST: 'error.badRequest',
	NOT_FOUND: 'error.notFound',
	ACTIVITY_UPDATE_RATE_LIMIT_EXCEEDED: 'error.activityUpdateRateLimitExceeded',
	// Friend-related errors
	CANT_REQUEST_YOURSELF: 'error.cantRequestYourself',
	FRIEND_REQUEST_ALREADY_SENT: 'error.friendRequestAlreadySent',
	FRIEND_REQUEST_ALREADY_EXISTS: 'error.friendRequestAlreadyExists',
	FAILED_TO_FETCH_FRIENDS: 'error.failedToFetchFriends',
	FAILED_TO_SEND_REQUEST: 'error.failedToSendRequest',
	FAILED_TO_ACCEPT_REQUEST: 'error.failedToAcceptRequest',
	FAILED_TO_REMOVE_FRIEND: 'error.failedToRemoveFriend',
	FRIEND_REQUEST_SENT: 'error.friendRequestSent',
	FRIEND_REQUEST_NOT_FOUND: 'error.friendRequestNotFound',
	SET_USERNAME_FIRST: 'error.setUsernameFirst',

	// Translate-related errors
	SOURCE_AND_TARGET_LANG_MUST_BE_DIFFERENT: 'error.sourceAndTargetLangMustBeDifferent',
	TARGET_LANG_CANNOT_BE_AUTO: 'error.targetLangCannotBeAuto',
	TRANSLATION_FAILED: 'error.translationFailed',
	FAILED_TO_FETCH_LANGUAGES: 'error.failedToFetchLanguages',
	INVALID_LANGUAGE_CODE: 'error.invalidLanguageCode',
	TEXT_TOO_LONG: 'error.textTooLong',
	EMPTY_TEXT: 'error.emptyText',
	TRANSLATION_QUOTA_EXCEEDED: 'error.translationQuotaExceeded',
	// Success messages
	SUCCESS: 'error.success',

	// Widget-related messages
	WIDGET_NOT_FOUND: 'error.widgetNotFound',
	WIDGET_DELETED: 'error.widgetDeleted',
	WIDGET_DUPLICATED: 'error.widgetDuplicated',
	WIDGET_ALREADY_EXISTS: 'error.widgetAlreadyExists',
	INVALID_WIDGET_POSITION: 'error.invalidWidgetPosition',
	STORAGE_QUOTA_EXCEEDED: 'error.storageQuotaExceeded',
	WIDGET_LIMIT_EXCEEDED: 'error.widgetLimitExceeded',
	MAX_WIDGETS_REACHED: 'error.maxWidgetsReached',
	NO_SPACE_FOR_WIDGET: 'error.noSpaceForWidget',
	NO_SPACE_FOR_DUPLICATE: 'error.noSpaceForDuplicate',

	// Bookmark-related messages
	BOOKMARK_DELETED: 'error.bookmarkDeleted',
	BOOKMARK_ADDED: 'error.bookmarkAdded',
	BOOKMARK_UPDATED: 'error.bookmarkUpdated',
	BOOKMARK_PARENT_NOT_FOUND: 'error.bookmarkParentNotFound',
	FILE_SIZE_EXCEEDED: 'error.fileSizeExceeded',

	// Network errors
	NETWORK_ERROR: 'error.networkError',
	CONNECTION_TIMEOUT: 'error.connectionTimeout',
	CONNECTION_REFUSED: 'error.connectionRefused',
	FIRST_VERIFY_YOUR_ACCOUNT: 'error.firstVerifyYourAccount',
	USERNAME_ALREADY_EXISTS: 'error.usernameAlreadyExists',
	INVALID_FILE_TYPE: 'error.invalidFileType',
	NOT_ENOUGH_COINS: 'error.notEnoughCoins',
	INVALID_REFERRAL_CODE: 'error.invalidReferralCode',
	ITEM_ALREADY_EXISTS: 'error.itemAlreadyExists',
	INVALID_ID: 'error.invalidId',
	DATE_OUT_OF_RANGE: 'error.dateOutOfRange',
	ITEM_NOT_FOUND: 'error.itemNotFound',
	TODO_NOT_FOUND: 'error.todoNotFound',
	INVALID_OTP_CODE: 'error.invalidOtpCode',
	USE_EMAIL_FOR_OTP: 'error.useEmailForOtp',
	USE_PHONE_FOR_OTP: 'error.usePhoneForOtp',
	INVALID_OCCUPATION_ID: 'error.invalidOccupationId',
	ONE_OR_MORE_INVALID_INTEREST_IDS: 'error.oneOrMoreInvalidInterestIds',
	TOO_MANY_ATTEMPTS: 'error.tooManyAttempts',
	OTP_EXPIRED: 'error.otpExpired',
	INVALID_PHONE_NUMBER_FORMAT: 'error.invalidPhoneNumberFormat',
	CANNOT_CHANGE_PHONE_NUMBER: 'error.cannotChangePhoneNumber',
	SAME_PHONE_NUMBER_ERROR: 'error.samePhoneNumberError',
	PHONE_NUMBER_ALREADY_EXISTS: 'error.phoneNumberAlreadyExists',
	INVALID_VERIFICATION_CODE: 'error.invalidVerificationCode',
	CANNOT_CHANGE_EMAIL: 'error.cannotChangeEmail',
	SAME_EMAIL_ERROR: 'error.sameEmailError',
	FIRST_SET_EMAIL: 'error.firstSetEmail',
	PACKAGE_NOT_FOUND: 'error.packageNotFound',
	PAYMENT_FAILED: 'error.paymentFailed',
	PAYMENT_ALREADY_PROCESSED: 'error.paymentAlreadyProcessed',
	PAYMENT_NOT_FOUND: 'error.paymentNotFound',
	TRY_NEXT_TIME: 'error.tryNextTime',
	TOO_MANY_ATTEMPTS_HABIT: 'error.tooManyAttemptsHabit',
	FOLDER_STRUCTURE_TOO_DEEP: 'error.folderStructureTooDeep',
	BULK_IMPORT_LIMIT_EXCEEDED: 'error.bulkImportLimitExceeded',
	NO_VALID_ITEMS_TO_IMPORT: 'error.noValidItemsToImport',
	BIRTHDATE_CANNOT_BE_CHANGED: 'error.birthdateCannotBeChanged',
	VIP_REQUIRED: 'error.vipRequired',
	UPLOAD_IN_PROGRESS: 'error.uploadInProgress',
	CUSTOM_WALLPAPER_REMOVED: 'error.customWallpaperRemoved',
	UPLOAD_FAILED: 'error.uploadFailed',
}

const VALIDATION_KEYS: Record<string, ErrorKey> = {
	'password must be longer than or equal to 8 characters':
		'error.validation.passwordMinLength',
	'password must contain at least 1 uppercase letter':
		'error.validation.passwordUppercase',
	'password must contain at least 1 lowercase letter':
		'error.validation.passwordLowercase',
	'password must contain at least 1 number': 'error.validation.passwordNumber',
	'password must contain at least 1 symbol': 'error.validation.passwordSymbol',
	'password must be a string': 'error.validation.passwordString',
	'password should not be empty': 'error.validation.passwordEmpty',
	'email must be an email': 'error.validation.emailFormat',
	'email should not be empty': 'error.validation.emailEmpty',
	'email must be a string': 'error.validation.emailString',
	'name should not be empty': 'error.validation.nameEmpty',
	'name must be a string': 'error.validation.nameString',
	'name must be longer than or equal to 3 characters': 'error.validation.nameMinLength',
	'name must be shorter than or equal to 50 characters':
		'error.validation.nameMaxLength',

	// Widget-specific validation messages
	'widget title should not be empty': 'error.validation.widgetTitleEmpty',
	'widget position must be valid': 'error.validation.widgetPosition',
	'widget size must be valid': 'error.validation.widgetSize',

	// Friend-related validation messages
	'username should not be empty': 'error.validation.usernameEmpty',
	'username does not exist': 'error.validation.usernameMissing',
	'cannot send friend request to yourself': 'error.validation.friendSelf',
	'friend request already sent': 'error.validation.friendAlreadySent',
	'name must be longer than or equal to 2 characters': 'error.validation.nameMin2',
	CONTENT_CONTAINS_PROFANITY: 'error.contentContainsProfanity',
}

function translateValidationMessage(message: string): string {
	const key = VALIDATION_KEYS[message]
	return key ? t(key) : message
}

export function translateError(error: any): string | Record<string, string> {
	const defaultMessage = t('error.default')

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

	const key = ERROR_KEYS[errorMessage]
	return key ? t(key) : errorMessage || defaultMessage
}

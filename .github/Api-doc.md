داکیومنت های مربوط به API ها در این فایل قرار دارد.

> [!NOTE]
> در صورت نبود API مورد نیاز، از دیتاهای فیک استفاده کنید و موفعه PULL REQUEST این موضوع را ذکر کنید. تا API مورد نیاز ایجاد شود.

### رهنمای استفاده از API ها
فیلد های * در مستندات به معنای اجباری بودن آن فیلد است.

## Wallpaper API
مستندات مربوط به دریافت تصاویر پس زمینه از این API قابل مشاهده است.

## Cache / Rate Limit
- هرکدوم از API ها دارای Cache و Rate Limit هستند.
- تعداد Rate Limit درحال حاضر private هست. 
- Cache هر API به صورت رندوم بین 1 تا 10 دقیقه و 1 ساعت هست.

### GET /wallpaper
Query Params:
- `page` (int): شماره صفحه
- `limit` (int): تعداد تصاویر در هر صفحه
- `type` (str): IMAGE & VIDEO
- `category` (str): Tehran, Dubai, Desert, Sea, Forest, Mountain, Sky, Space, Abstract, City, Other

Response:
```json
{
  "wallpapers": [
    {
      "id": "67c20fb09985263793140b49",
      "name": "حاله های رنگی",
      "source": "https://www.google.com",
      "category": "Abstract",
      "type": "IMAGE",
      "src": "https://storage.c2.liara.space/widgetify-ir/wallpapers/243ee1f4-3ce9-4120-9250-1d765572f926.jpeg"
    }
  ],
  "totalPages": 9
}
```


## Weather API
مستندات مربوط به دریافت اطلاعات هواشناسی از این API قابل مشاهده است.

### GET /weather/current
Query Params:
- `lat` (float*): عرض جغرافیایی
- `lon` (float*): طول جغرافیایی
- `useAI` (bool*): استفاده از هوش مصنوعی برای پیش‌بینی

response:
```json
{
    "city": {
        "fa": "Tehran",
        "en": "Tehran/تهران"
    },
    "weather": {
        "description": {
            "text": "پوشیده از ابر",
            "emoji": "☁️"
        },
        "icon": {
            "url": "https://storage.c2.liara.space/widgetify-ir/weather/04n.png",
        },
        "label": "ابرهای متراکم، خورشید رو می‌پوشونن!",
        "temperature": {
            "clouds": 93,
            "humidity": 59,
            "pressure": 1014,
            "temp": 18.79,
            "temp_description": "شب رویایی 🌠",
            "temp_max": 18.79,
            "temp_min": 18.79,
            "wind_speed": 0.94
        },
        "ai": {
            "description": "تهران آسمانی پوشیده از ابر دارد و هوا نسبتا خنک است. سرعت باد ملایم و دمای هوا حدود 19 درجه سانتی‌گراد است؛ انگار ابرها دارند قایم باشک بازی می‌کنند!",
            "playlist": null
        }
    }
}
```

### GET /weather/forecast
Query Params:
- `lat*` (float*): عرض جغرافیایی
- `lon*` (float*): طول جغرافیایی
- `count` (int): تعداد آیتم‌های پیش‌بینی

response:
```json
[
    {
        "temp": 18.57,
        "icon": "https://storage.c2.liara.space/widgetify-ir/weather/04n.svg",
        "date": "2025-03-09 18:00:00"
    },
    {
        "temp": 18.03,
        "icon": "https://storage.c2.liara.space/widgetify-ir/weather/04n.svg",
        "date": "2025-03-09 21:00:00"
    },
    {
        "temp": 16.8,
        "icon": "https://storage.c2.liara.space/widgetify-ir/weather/04n.svg",
        "date": "2025-03-10 00:00:00"
    },
    {
        "temp": 14.75,
        "icon": "https://storage.c2.liara.space/widgetify-ir/weather/04n.svg",
        "date": "2025-03-10 03:00:00"
    }
]
```


### GET /weather/cities
Query Params:
- `city` (str*): نام شهر

response:
```json
[
 {
    "name": "Tehran",
    "country": "IR",
    "state" null,
    "lat": 35.6892523,
    "lon": 51.3896004
  },
]
```


## Date
مستندات مربوط به دریافت تاریخ و زمان از این API قابل مشاهده است.

### GET /date/events
Query Params:

response:
```json
{
    "shamsiEvents": [
        {
            "id": "67ca1528f0eeeba246d0e6f2",
            "isHoliday": true,
            "title": "آغاز نوروز",
            "day": 1,
            "month": 1,
            "icon": "https://storage.c2.liara.space/widgetify-ir/events/5e30a5de-2ad8-4fe5-88b6-4c402c07e297.png"
        },
     
    ],
    "gregorianEvents": [
        {
            "isHoliday": false,
            "title": "📱 معرفی اولین آیفون",
            "day": 9,
            "month": 1,
            "icon": null
        }
  ],
   "hijriEvents": [
        {
            "id": "67ca1528f0eeeba246d0e7c7",
            "isHoliday": true,
            "title": "تعطیل به مناسبت عید سعید فطر",
            "day": 2,
            "month": 10,
            "icon": null
        },
  ]
}
```

### GET /date/timezones
Query Params:

response:
```json
[
  {
    "label": "آسیا / تهران",
    "value": "Asia/Tehran",
    "offset": "+03:30"
  }
]
```
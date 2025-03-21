### API documentation is provided in this file.

> [!NOTE]
> If the required API is not available, use fake data and mention this in your PULL REQUEST. The required API will be created.

### API Usage Guide
Fields marked with * in the documentation means required fields.

## Cache / Rate Limit
- Each API has Cache and Rate Limit.
- The Rate Limit count is currently private.
- Cache for each API is randomly set between 1 to 10 minutes and 1 hour.

## Wallpaper API

### GET /wallpaper
Query Params:
- `page` (int): Page number
- `limit` (int): Number of images per page
- `type` (str): IMAGE & VIDEO
- `category` (str): Tehran, Dubai, Desert, Sea, Forest, Mountain, Sky, Space, Abstract, City, Other

Response:
```json
{
  "wallpapers": [
    {
      "id": "67c20fb09985263793140b49",
      "name": "Colors",
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

### GET /weather/current
Query Params:
- `lat` (float*): Latitude
- `lon` (float*): Longitude
- `useAI` (bool*): Use AI for prediction

Response:
```json
{
    "city": {
        "fa": "Tehran",
        "en": "Tehran/تهران"
    },
    "weather": {
        "description": {
            "text": "Cloudy",
            "emoji": "☁️"
        },
        "icon": {
            "url": "https://storage.c2.liara.space/widgetify-ir/weather/04n.png",
        },
        "label": "Dense clouds covering the sun!",
        "temperature": {
            "clouds": 93,
            "humidity": 59,
            "pressure": 1014,
            "temp": 18.79,
            "temp_description": "Dreamy night 🌠",
            "temp_max": 18.79,
            "temp_min": 18.79,
            "wind_speed": 0.94
        },
        "ai": {
            "description": "Tehran has a cloudy sky and the weather is relatively cool. Wind speed is mild and the temperature is around 19 degrees Celsius; it seems like the clouds are playing hide and seek!",
            "playlist": null
        }
    }
}
```

### GET /weather/forecast
Query Params:
- `lat*` (float*): Latitude
- `lon*` (float*): Longitude
- `count` (int): Number of forecast items

Response:
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
- `city` (str*): City name

Response:
```json
[
 {
    "name": "Tehran",
    "country": "IR",
    "state": null,
    "lat": 35.6892523,
    "lon": 51.3896004
  },
]
```

## Date

### GET /date/events

Response:
```json
{
    "shamsiEvents": [
        {
            "id": "67ca1528f0eeeba246d0e6f2",
            "isHoliday": true,
            "title": "Nowruz Beginning",
            "day": 1,
            "month": 1,
            "icon": "https://storage.c2.liara.space/widgetify-ir/events/5e30a5de-2ad8-4fe5-88b6-4c402c07e297.png"
        }
    ],
    "gregorianEvents": [
        {
            "isHoliday": false,
            "title": "📱 First iPhone Introduction",
            "day": 9,
            "month": 1,
            "icon": null
        }
    ],
    "hijriEvents": [
        {
            "id": "67ca1528f0eeeba246d0e7c7",
            "isHoliday": true,
            "title": "Holiday for Eid al-Fitr",
            "day": 2,
            "month": 10,
            "icon": null
        }
    ]
}
```

### GET /date/timezones
Response:
```json
[
  {
    "label": "Asia / Tehran",
    "value": "Asia/Tehran",
    "offset": "+03:30"
  }
]
``` 

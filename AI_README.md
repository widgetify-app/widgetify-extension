# AI Features in Widgetify

This document describes the AI-related features added to the Widgetify extension.

## Overview

Widgetify now includes an AI chat feature called "باباهوشو" (Baba Hoshu), which allows users to interact with an AI assistant directly from the new tab page.

## Features Added

### 1. General Settings Context (`src/context/general-setting.context.tsx`)

- **Purpose**: Manages general application settings, including the widget mode.
- **Key Settings**:
  - `widgetMode`: Can be 'chatBot' or 'imageCorner'
  - Other settings: analytics, timezone, bookmarks, etc.
- **Provider**: `GeneralSettingProvider` wraps the app to provide settings context.

### 2. AI Chat Component (`src/components/ai-chat/ai-chat.tsx`)

- **Functionality**:
  - Fixed chat window in the bottom-right corner
  - Real-time conversation with AI
  - Persian (Farsi) interface
  - Auto-scrolling message history

- **API Integration**:
  - Uses `https://text.pollinations.ai/openai/chat/completions`
  - Sends user messages and receives AI responses
  - Handles errors gracefully

- **UI Features**:
  - Clean, dark/light theme compatible design
  - Message bubbles for user and AI
  - Loading indicator during AI response
  - Input field with Enter key support

### 3. Widget Mode Settings (`src/layouts/setting/tabs/general/components/widget-mode-settings.tsx`)

- **Location**: General Settings → Widget Mode
- **Options**:
  - **چت بات (باباهوشو)**: Enables AI chat window
  - **گوشه تصویر (پت‌ها)**: Shows floating pets (existing feature)

- **Behavior**: Switching modes immediately changes the widget display

### 4. App Integration (`src/App.tsx`)

- Added `GeneralSettingProvider` to the component tree
- Positioned inside `AuthProvider` to access user context
- Ensures settings are available throughout the app

## Technical Details

### API Usage

The AI chat uses the Pollinations.ai service, which provides OpenAI-compatible chat completions:

```typescript
const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai',
    messages: conversationHistory
  })
})
```

### Context Architecture

The `GeneralSettingContext` follows React's Context API pattern:

- **Provider**: Manages state and provides update functions
- **Hook**: `useGeneralSetting()` for consuming the context
- **Error Handling**: Throws error if used outside provider

### Widget Mode Logic

In `src/pages/home.tsx`:

```tsx
{widgetMode === 'chatBot' ? <AIChat /> : <FloatingPet />}
```

This conditionally renders either the AI chat or floating pets based on user preference.

## Usage Instructions

1. **Access Settings**: Click the settings button in the navbar
2. **Open General Settings**: Navigate to the General tab
3. **Select Widget Mode**: Choose between "چت بات (باباهوشو)" or "گوشه تصویر (پت‌ها)"
4. **Start Chatting**: Type messages in the chat window and press Enter or click Send

## Error Handling

- **Network Errors**: Displays "Error: Network issue."
- **API Failures**: Shows "Error: Could not get response from AI."
- **Graceful Degradation**: App continues to work even if AI is unavailable

## Future Enhancements

Potential improvements could include:

- Chat history persistence
- Multiple conversation threads
- Voice input integration
- Custom AI personas
- Integration with other Widgetify features

## Dependencies

- React Context API
- Pollinations.ai API
- Tailwind CSS for styling
- React Icons for UI elements
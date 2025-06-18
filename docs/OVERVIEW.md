# Technical Overview - Gemini Nano Playground

## Introduction

The **Gemini Nano Playground** is a React/TypeScript application that provides an interactive interface for experimenting with Google's on-device Gemini Nano AI model. The application allows users to interact with the model directly in the browser, without sending data to external servers, ensuring privacy and fast responses.

## Table of Contents

- [Quick Start](#quick-start)
- [General Architecture](#general-architecture)
  - [Technology Stack](#technology-stack)
  - [Directory Structure](#directory-structure)
- [Main Components](#main-components)
  - [App.tsx](#1-apptsx)
  - [useGeminiNano Hook](#2-usegemiminano-hook)
  - [Type System](#3-type-system)
- [Interface Components](#interface-components)
- [Internationalization (i18n)](#internationalization-i18n)
- [Operation Flow](#operation-flow)
- [Development Configuration](#development-configuration)
- [Advanced Technical Features](#advanced-technical-features)
- [System Requirements](#system-requirements)
- [Code Examples](#code-examples)
- [Troubleshooting](#troubleshooting)
- [Extensibility](#extensibility)
- [Security Considerations](#security-considerations)
- [Performance Considerations](#performance-considerations)

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Chrome Canary/Dev/Beta 138+ with experimental flags enabled

### Setup in 5 Minutes

1. **Clone and install dependencies:**

   ```bash
   git clone https://github.com/byomess/gemini-nano-playground.git
   cd gemini-nano-playground
   pnpm install
   ```

2. **Configure Chrome for Gemini Nano:**
   - Open Chrome Canary/Dev/Beta
   - Go to `chrome://flags`
   - Enable: `#prompt-api-for-gemini-nano`
   - Optional (for CPU): `#optimization-guide-on-device-model-execution-bypass`
   - Restart Chrome

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Open browser:**
   - Navigate to `http://localhost:5173`
   - Click "Initialize Model" and wait for download
   - Start experimenting with prompts!

### First Steps

1. **Initialize the Model**: Click the initialize button and wait for the ~22GB model download
2. **Adjust Parameters**: Set temperature (creativity) and top-K (diversity) values
3. **Send Prompts**: Type your prompt and click send to see streaming responses
4. **Explore Features**: Try different languages, copy responses, interrupt generation

## General Architecture

### Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (development and production)
- **Styling**: Tailwind CSS v4 + Framer Motion (animations)
- **Internationalization**: i18next + react-i18next
- **Markdown**: React Markdown + React Syntax Highlighter
- **Linting**: ESLint v9
- **Package Manager**: pnpm

### Directory Structure

```text
src/
├── components/          # Reusable React components
│   ├── index.ts        # Barrel export for all components
│   ├── ActionButton.tsx
│   ├── ControlPanelHeader.tsx
│   ├── DownloadProgress.tsx
│   ├── GeminiNanoGuide.tsx
│   ├── Icons.tsx
│   ├── LanguageSelector.tsx
│   ├── MarkdownRenderer.tsx
│   ├── ModelControls.tsx
│   ├── ModelParameters.tsx
│   ├── OutputDisplay.tsx
│   ├── PromptInterface.tsx
│   ├── SetupModal.tsx
│   ├── Slider.tsx
│   ├── StatusDisplay.tsx
│   └── StatusIndicator.tsx
├── hooks/              # Custom React hooks
│   └── useGeminiNano.ts
├── i18n/               # Internationalization
│   ├── index.ts        # i18next configuration
│   └── locales/        # Translation files
│       ├── en.json
│       ├── pt.json
│       ├── es.json
│       ├── fr.json
│       └── de.json
├── types/              # TypeScript type definitions
│   └── gemini.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite types
```

## Main Components

### 1. App.tsx

The root component of the application that:

- Manages global UI state (sidebar, modals, guides)
- Integrates the `useGeminiNano` hook for model logic
- Controls setup modal display based on API availability
- Implements responsive layout with collapsible sidebar

### 2. useGeminiNano Hook

Centralized custom hook that encapsulates all Gemini Nano logic:

**Features:**

- API availability verification
- Session initialization and management
- Model parameter control (temperature, top-K)
- Prompt sending with real-time streaming
- Abort control for generation interruption
- Download progress monitoring
- State and status message management

**Managed States:**

```typescript
interface UseGeminiNanoReturn {
    status: ModelStatus;           // 'unverified' | 'initializing' | 'downloading' | 'ready' | 'error'
    statusMessage: string;         // Descriptive message of current status
    session: Session | null;       // Active model session
    modelParams: ModelParams | null; // Available model parameters
    temperature: number;           // Creativity control (0-1)
    topK: number;                 // Token diversity control
    downloadProgress: number;      // Download progress (0-100)
    isLoading: boolean;           // Loading state
    output: string;               // Current model output
    isApiAvailable: boolean;      // API availability
    // ... control functions
}
```

### 3. Type System

Robust TypeScript definitions in `src/types/gemini.ts`:

```typescript
// Main LanguageModel API interface
interface LanguageModel {
    availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;
    create(options?: CreateSessionOptions): Promise<Session>;
    params(): Promise<ModelParams>;
}

// Session configuration
interface CreateSessionOptions {
    topK?: number;
    temperature?: number;
    signal?: AbortSignal;
    monitor?: (monitor: EventTarget) => void;
}

// Active session interface
interface Session {
    prompt(prompt: string, options?: { signal?: AbortSignal }): Promise<string>;
    promptStreaming(prompt: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
    destroy(): void;
}
```

## Interface Components

### Control Components

- **ModelControls**: Initialize, send, and stop buttons
- **ModelParameters**: Sliders for temperature and top-K
- **StatusDisplay**: Visual model status indicators
- **DownloadProgress**: Download progress bar

### Input and Output Components

- **PromptInterface**: Text input area with character counter
- **OutputDisplay**: Markdown rendering with syntax highlighting
- **MarkdownRenderer**: Custom renderer with code support
- **LanguageSelector**: Language selector with flags

### Modal and Guide Components

- **SetupModal**: Configuration modal for users without available API
- **GeminiNanoGuide**: Interactive guide on how to configure Gemini Nano

## Internationalization (i18n)

### Configuration

- **Library**: i18next + react-i18next
- **Detection**: Browser language detection with Portuguese fallback
- **Storage**: localStorage for user preferences

### Supported Languages

- Portuguese (pt) - default language
- English (en)
- Spanish (es)
- French (fr)
- German (de)

### Translation Structure

```json
{
  "status": {
    "initialMessage": "...",
    "downloading": "...",
    "ready": "..."
  },
  "buttons": {
    "initialize": "...",
    "send": "...",
    "stop": "..."
  },
  "errors": {
    "apiNotFound": "...",
    "sessionError": "..."
  }
}
```

## Operation Flow

### 1. Application Initialization

1. `window.LanguageModel` API availability verification
2. Model parameter loading if available
3. Setup modal display if necessary
4. Initial configuration of `useGeminiNano` hook

### 2. Model Lifecycle

1. **Verification**: `LanguageModel.availability()`
2. **Initialization**: `LanguageModel.create()` with parameters
3. **Monitoring**: Event listeners for download progress
4. **Active Session**: Ready to receive prompts
5. **Cleanup**: `session.destroy()` when necessary

### 3. Response Streaming

```typescript
const stream = session.promptStreaming(prompt, { signal: abortController.signal });
const reader = stream.getReader();

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    setOutput(prev => prev + value); // Incremental update
}
```

## Development Configuration

### Build Structure

- **Development**: `vite dev` - development server with HMR
- **Production**: `tsc -b && vite build` - type checking + optimized build
- **Preview**: `vite preview` - production build preview

### TypeScript

- **Modular Configuration**: `tsconfig.json` with references for app and node
- **Target**: ES2020 with DOM support
- **Strict Mode**: Enabled with rigorous linting
- **Module Resolution**: Bundler mode for Vite compatibility

### ESLint

- **Version**: ESLint v9 with modern configuration
- **Plugins**: TypeScript and React integration
- **Rules**: Configuration for clean and consistent code

## Advanced Technical Features

### 1. Abort Controllers

Robust implementation for operation cancellation:

```typescript
const abortControllerRef = useRef<AbortController | null>(null);

// Controller creation for each operation
abortControllerRef.current = new AbortController();

// Usage in streams and prompts
const stream = session.promptStreaming(prompt, { 
    signal: abortControllerRef.current.signal 
});
```

### 2. Error Boundary & Recovery

- Intelligent error type detection
- Automatic recovery for lost sessions
- Fallbacks for unavailable functionalities

### 3. Performance Optimization

- **useCallback**: Memoization of heavy functions
- **Lazy Loading**: On-demand component loading
- **React 19**: Leveraging latest features
- **Bundle Splitting**: Automatic optimization by Vite

### 4. Real-time Features

- **Streaming**: Real-time responses with ReadableStream
- **Progress Monitoring**: Real-time download events
- **Status Updates**: Reactive state updates

## System Requirements

### Browser Compatibility

- **Chrome Canary 138+** (recommended)
- **Chrome Dev 138+**
- **Chrome Beta 138+**
- Experimental flags required

### Required Resources

- **Storage**: 22GB for model
- **GPU**: 4GB+ VRAM (or CPU bypass)
- **Network**: Unlimited connection for initial download

## Code Examples

### Using the useGeminiNano Hook

```typescript
import { useGeminiNano } from './hooks/useGeminiNano';

function MyComponent() {
    const {
        status,
        isApiAvailable,
        handleInitialize,
        handleSendPrompt,
        output,
        temperature,
        setTemperature
    } = useGeminiNano();

    const sendCustomPrompt = async () => {
        await handleSendPrompt("Explain quantum computing in simple terms", true);
    };

    return (
        <div>
            <p>Status: {status}</p>
            <button onClick={handleInitialize} disabled={!isApiAvailable}>
                Initialize Model
            </button>
            <button onClick={sendCustomPrompt}>
                Send Example Prompt
            </button>
            <div>{output}</div>
        </div>
    );
}
```

### Creating a Custom Component

```typescript
// src/components/CustomPromptButton.tsx
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface CustomPromptButtonProps {
    prompt: string;
    onSend: (prompt: string) => void;
    disabled?: boolean;
}

export const CustomPromptButton: FC<CustomPromptButtonProps> = ({
    prompt,
    onSend,
    disabled = false
}) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={() => onSend(prompt)}
            disabled={disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {t('buttons.sendPrompt', { defaultValue: 'Send Prompt' })}
        </button>
    );
};

// Don't forget to add to src/components/index.ts:
// export { CustomPromptButton } from './CustomPromptButton';
```

### Adding Custom Translations

```typescript
// src/i18n/locales/custom.json
{
  "myFeature": {
    "title": "My New Feature",
    "description": "This is my custom feature",
    "buttons": {
      "action": "Take Action"
    }
  }
}

// Using in component:
import { useTranslation } from 'react-i18next';

function MyFeature() {
    const { t } = useTranslation();
    
    return (
        <div>
            <h2>{t('myFeature.title')}</h2>
            <p>{t('myFeature.description')}</p>
            <button>{t('myFeature.buttons.action')}</button>
        </div>
    );
}
```

### Error Handling Pattern

```typescript
import { useCallback } from 'react';
import { useGeminiNano } from './hooks/useGeminiNano';

function SafeGeminiComponent() {
    const { handleSendPrompt, status } = useGeminiNano();

    const sendPromptSafely = useCallback(async (prompt: string) => {
        try {
            if (status !== 'ready') {
                throw new Error('Model is not ready');
            }
            
            await handleSendPrompt(prompt, true);
        } catch (error) {
            console.error('Failed to send prompt:', error);
            // Handle error appropriately - show toast, update UI state, etc.
        }
    }, [handleSendPrompt, status]);

    return (
        <div>
            {/* Your component JSX */}
        </div>
    );
}
```

## Troubleshooting

### Common Issues and Solutions

#### Model Not Loading

**Problem**: The initialize button doesn't work or model fails to load.

**Solutions**:

1. **Check Chrome Version**: Ensure you're using Chrome Canary/Dev/Beta 138+
2. **Verify Flags**: Go to `chrome://flags` and confirm `#prompt-api-for-gemini-nano` is enabled
3. **Check Storage**: Ensure you have at least 22GB free space
4. **Restart Browser**: Close and reopen Chrome after enabling flags
5. **Check Console**: Open DevTools and look for error messages

#### API Not Available

**Problem**: `isApiAvailable` returns false or setup modal keeps showing.

**Solutions**:

1. **Update Chrome**: Download latest Canary/Dev/Beta version
2. **Enable CPU Bypass**: If no GPU, enable `#optimization-guide-on-device-model-execution-bypass`
3. **Check API**: In DevTools console, run `await LanguageModel.availability()`
4. **Clear Cache**: Clear browser cache and restart

#### Slow Performance

**Problem**: Model responses are very slow or browser becomes unresponsive.

**Solutions**:

1. **Enable GPU Acceleration**: Ensure hardware acceleration is enabled in Chrome settings
2. **Use CPU Flag**: If GPU issues persist, enable CPU bypass flag
3. **Check Memory**: Close other tabs and applications
4. **Lower Parameters**: Reduce temperature and top-K values

#### Streaming Issues

**Problem**: Responses don't stream or appear all at once.

**Solutions**:

1. **Check Abort Controllers**: Ensure previous operations are properly cancelled
2. **Verify Session**: Re-initialize the model if streaming stops working
3. **Network Issues**: Check if any network interception is affecting streams

### Debugging Tips

1. **Console Logging**: Check browser DevTools console for error messages
2. **Component State**: Use React DevTools to inspect hook state
3. **Network Tab**: Monitor for any unexpected network requests
4. **Performance Tab**: Profile if experiencing slow performance

### Getting Help

1. **Check Issues**: Look at GitHub issues for similar problems
2. **Official Docs**: Reference [Chrome AI documentation](https://developer.chrome.com/docs/ai/get-started)
3. **Component Check**: Verify at `chrome://components` for model download status

## Extensibility

### Adding New Components

1. Create component in `src/components/`
2. Add export in `src/components/index.ts`
3. Implement tests if necessary
4. Add translations in `src/i18n/locales/`

### Adding New Languages

1. Create JSON file in `src/i18n/locales/`
2. Add import in `src/i18n/index.ts`
3. Include in `resources` object
4. Add flag in `LanguageSelector`

### Extending Types

1. Update `src/types/gemini.ts`
2. Consider backward compatibility
3. Update `useGeminiNano` hook if necessary
4. Document changes

## Security Considerations

- **On-Device Processing**: No data sent to external servers
- **Abort Control**: Prevents memory leaks in long operations
- **Type Safety**: TypeScript prevents many runtime errors
- **Error Boundaries**: Failure isolation for better user experience

## Performance Considerations

- **Bundle Size**: Optimized with automatic tree-shaking
- **Memory Management**: Proper cleanup of sessions and streams
- **Rendering**: Optimizations for unnecessary re-renders
- **Network**: Efficient streaming API usage

This documentation provides a solid foundation for developers who want to contribute or understand the project in depth. For specific information about individual components or functionalities, refer to the corresponding source code files.

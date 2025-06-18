import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeminiNano } from './useGeminiNano';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { message?: string; progress?: number; temperature?: number; topK?: number }) => {
      // Specific keys for messages that don't just use params.message
      if (key === 'status.apiNotFound') return 'API not found for testing';
      // For case-insensitivity in test:
      if (key === 'status.modelUnavailable') return 'model is unavailable for testing';
      if (key === 'status.initialMessage') return 'Initial message for testing';
      if (key === 'status.checkingAvailability') return 'Checking availability for testing';
      if (key === 'status.downloading') return 'Downloading model for testing'; // Used by hook
      if (key === 'status.creatingSession') return 'Creating session for testing';
      // Adjusted to match expectation more closely for status.error
      if (key === 'status.error') return `status.error: ${params?.message || 'Unknown error'}`;
      if (key === 'output.error') return `Output error for testing: ${params?.message || 'Unknown error'}`;
      if (key === 'output.interrupted') return `Interrupted for testing`;


      if (params?.message) return `${key}: ${params.message}`;
      if (params?.progress !== undefined) return `Download progress ${params.progress}% for testing`;
      if (params?.temperature !== undefined && params?.topK !== undefined) return `Session ready temp ${params.temperature} topK ${params.topK} for testing`;
      return key; // Fallback returns the key
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en',
    },
  }),
}));

// Define a type for the mocked window.LanguageModel for better type safety
interface MockLanguageModel {
  availability: Mock;
  create: Mock;
  params: Mock;
  // Add any other methods used by the hook if necessary
}

// Store original window.LanguageModel
const originalWindowLanguageModel = window.LanguageModel;

beforeEach(() => {
  // Reset window.LanguageModel mock for each test
  window.LanguageModel = {
    availability: vi.fn(),
    create: vi.fn(),
    params: vi.fn().mockResolvedValue({ // Mock default params
      defaultTemperature: 0.7,
      defaultTopK: 3,
    }),
  } as unknown as MockLanguageModel; // Use 'unknown as' for simplicity in mocking parts of the global
});

afterEach(() => {
  // Restore original window.LanguageModel
  window.LanguageModel = originalWindowLanguageModel;
  vi.restoreAllMocks();
});

describe('useGeminiNano', () => {
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useGeminiNano());
    expect(result.current.session).toBeNull(); // Changed from model to session
    expect(result.current.status).toBe('unverified'); // Changed from uninitialized
    expect(result.current.output).toBe('');
    // currentSession is not a returned property, session is.
    expect(result.current.downloadProgress).toBe(0);
    expect(result.current.isLoading).toBe(false); // This is for prompt generation
    // isModelLoading, isModelReady are not direct states. Status reflects this.
    expect(result.current.isApiAvailable).toBe(true); // Hook initializes this to true
    expect(result.current.temperature).toBe(0.4); // Default in hook
    expect(result.current.topK).toBe(3); // Default in hook (after params load)
  });

  // --- Availability Tests (via isApiAvailable and handleInitialize behavior) ---
  describe('API Availability and Initialization', () => {
    it('should set isApiAvailable to false if window.LanguageModel is not present initially', async () => {
      // @ts-expect-error - deliberately setting window.LanguageModel to undefined
      window.LanguageModel = undefined;
      const { result } = renderHook(() => useGeminiNano());
      // isApiAvailable is set by an effect, so we might need to wait for re-render
      await act(async () => {
        // Allow useEffect to run
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      expect(result.current.isApiAvailable).toBe(false);
      // Also check status if handleInitialize is called
      await act(async () => {
        await result.current.handleInitialize();
      });
      expect(result.current.status).toBe('error');
      expect(result.current.statusMessage).toContain('API not found'); // Or similar message from hook
    });

    it('handleInitialize: should set status to error if availability is "unavailable"', async () => {
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('unavailable');
      const { result } = renderHook(() => useGeminiNano());
      await act(async () => {
        await result.current.handleInitialize();
      });
      expect(result.current.status).toBe('error');
      // Using regex for case-insensitive matching for the specific part of the message
      expect(result.current.statusMessage).toMatch(/model is unavailable/i);
      // The API itself is available, but the model isn't. So isApiAvailable should remain true.
      expect(result.current.isApiAvailable).toBe(true);
    });

    it('handleInitialize: should attempt download if availability is "downloadable"', async () => {
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('downloadable');
      const mockSession = { /* mock session object */ };
      (window.LanguageModel as MockLanguageModel).create.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useGeminiNano());
      await act(async () => {
        await result.current.handleInitialize();
      });
      expect(result.current.status).toBe('ready'); // Goes through downloading then ready
      expect(window.LanguageModel.create).toHaveBeenCalled();
      expect(result.current.session).toBe(mockSession);
    });

    it('handleInitialize: should set status to ready if availability is "available" (like readily)', async () => {
      // Note: The hook doesn't directly use 'readily'. 'available' implies it will try to create.
      // The mock for `create` is what determines success here if availability isn't 'unavailable' or 'downloadable'.
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('available'); // Or any other non-'unavailable'/'downloadable'
      const mockSession = { promptStreaming: vi.fn(), prompt: vi.fn(), destroy: vi.fn() };
      (window.LanguageModel as MockLanguageModel).create.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useGeminiNano());
      await act(async () => {
        await result.current.handleInitialize();
      });

      expect(result.current.status).toBe('ready');
      expect(result.current.session).toBe(mockSession);
      expect(result.current.isLoading).toBe(false);
    });

    it('handleInitialize: should set status to "error" if create session fails', async () => {
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('available');
      (window.LanguageModel as MockLanguageModel).create.mockRejectedValue(new Error('Session creation failed'));

      const { result } = renderHook(() => useGeminiNano());
      await act(async () => {
        await result.current.handleInitialize();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.session).toBeNull();
      expect(result.current.statusMessage).toContain('Session creation failed');
    });
  });

  describe('handleSendPrompt', () => {
    const mockSession = {
      promptStreaming: vi.fn(),
      prompt: vi.fn(),
      destroy: vi.fn(),
    };

    beforeEach(async () => {
      vi.clearAllMocks();
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('available');
      (window.LanguageModel as MockLanguageModel).create.mockResolvedValue(mockSession);
    });

    it('should update output and status correctly on successful stream', async () => {
      const { result } = renderHook(() => useGeminiNano());

      await act(async () => {
        await result.current.handleInitialize(); // Initialize model first
      });
      expect(result.current.status).toBe('ready');

      const streamReaderMock = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: "Hello" })
          .mockResolvedValueOnce({ done: false, value: " World" })
          .mockResolvedValueOnce({ done: true, value: undefined }),
        releaseLock: vi.fn(),
      };
      const streamMock = {
        getReader: vi.fn().mockReturnValue(streamReaderMock),
      };
      mockSession.promptStreaming.mockReturnValue(streamMock);

      await act(async () => {
        await result.current.handleSendPrompt("Test prompt");
      });

      expect(result.current.output).toBe("Hello World");
      expect(result.current.isLoading).toBe(false);
      expect(mockSession.promptStreaming).toHaveBeenCalledWith("Test prompt", expect.anything());
    });

    it('should set isLoading to false and update output with error if promptStreaming throws', async () => {
      const { result } = renderHook(() => useGeminiNano());
      await act(async () => {
        await result.current.handleInitialize();
      });

      const errorMessage = "Stream failed";
      mockSession.promptStreaming.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await act(async () => {
        await result.current.handleSendPrompt("Test prompt");
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.output).toContain(errorMessage); // Hook appends error to output
    });

     it('should not run if session is not initialized', async () => {
      const { result } = renderHook(() => useGeminiNano());
      // Do NOT initialize session
      await act(async () => {
        await result.current.handleSendPrompt("Test prompt");
      });
      expect(result.current.status).toBe('unverified'); // Remains in initial state
      expect(result.current.output).toBe('');
      expect(mockSession.promptStreaming).not.toHaveBeenCalled();
    });
  });

  describe('Download Flow (via handleInitialize)', () => {
    let mockMonitorCb: any = null;
    const mockSessionAfterDownload = {
        promptStreaming: vi.fn(), prompt: vi.fn(), destroy: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();
      mockMonitorCb = null; // Reset mockMonitorCb
      (window.LanguageModel as MockLanguageModel).availability.mockResolvedValue('downloadable');

      (window.LanguageModel as MockLanguageModel).create.mockImplementation(async (options) => {
        // Simulate async creation with a slight delay
        await new Promise(r => setTimeout(r, 50));
        if (options && typeof options.monitor === 'function') {
          // Create a mock monitor object that the hook's monitor callback will receive
          const mockInternalMonitor = {
            addEventListener: vi.fn((event: string, callback: (eventData: any) => void) => {
              if (event === 'downloadprogress') {
                mockMonitorCb = callback; // Capture the callback registered by the hook
              }
            })
          };
          // Call the monitor function provided by the hook, with our mockInternalMonitor
          options.monitor(mockInternalMonitor);
        }
        return mockSessionAfterDownload;
      });
    });

    it('should update status and progress during download, then initialize', async () => {
      const { result } = renderHook(() => useGeminiNano());

      // This will trigger the download flow. Don't await here if internal updates are tested.
      act(() => {
        result.current.handleInitialize(); // Not awaited, to observe status changes
      });

      // Initially, status becomes 'initializing'
      expect(result.current.status).toBe('initializing');

      // Wait for availability check to complete and status to become 'downloading'
      await waitFor(() => expect(result.current.status).toBe('downloading'));

      await waitFor(() => expect(window.LanguageModel.create).toHaveBeenCalled());

      // Ensure mockMonitorCb has been captured
      await waitFor(() => expect(mockMonitorCb).not.toBeNull());

      // Simulate download progress
      act(() => {
        if (mockMonitorCb) mockMonitorCb({ loaded: 0.5 }); // 50%
      });
      await waitFor(() => expect(result.current.downloadProgress).toBe(50));
      // Status message will also update
      await waitFor(() => expect(result.current.statusMessage).toBe('Download progress 50% for testing'));


      act(() => {
        if (mockMonitorCb) mockMonitorCb({ loaded: 1 }); // 100%
      });
      await waitFor(() => expect(result.current.downloadProgress).toBe(100));
      await waitFor(() => expect(result.current.statusMessage).toBe('Download progress 100% for testing'));
      act(() => { // Ensure no more progress events can accidentally fire or be processed late
          mockMonitorCb = null;
      });

      // Wait for the entire handleInitialize promise to resolve and check final states together
      await waitFor(() => {
        expect(result.current.status).toBe('ready');
        expect(result.current.statusMessage).toBe(`Session ready temp ${result.current.temperature} topK ${result.current.topK} for testing`);
        expect(result.current.session).toBe(mockSessionAfterDownload);
      }, { timeout: 2000 });
    });

    it('should handle download related failure during create', async () => {
      const errorMessage = "Download init failed";
      (window.LanguageModel as MockLanguageModel).create.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useGeminiNano());

      await act(async () => {
        await result.current.handleInitialize();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.statusMessage).toBe(`status.error: ${errorMessage}`);
      expect(result.current.downloadProgress).toBe(0);
    });
  });
});

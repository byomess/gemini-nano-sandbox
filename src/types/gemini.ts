// Tipos para a API LanguageModel (para segurança de tipo no TypeScript)
// Estes tipos podem não ser exportados oficialmente, então os definimos para nosso uso.

export interface LanguageModel {
    availability(): Promise<'available' | 'downloadable' | 'downloading' | 'unavailable'>;
    create(options?: CreateSessionOptions): Promise<Session>;
    params(): Promise<ModelParams>;
}

export interface CreateSessionOptions {
    topK?: number;
    temperature?: number;
    signal?: AbortSignal;
    monitor?: (monitor: { addEventListener: (event: string, listener: (e: any) => void) => void }) => void;
}

export interface Session {
    prompt(prompt: string, options?: { signal?: AbortSignal }): Promise<string>;
    promptStreaming(prompt: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
    destroy(): void;
}

export interface ModelParams {
    defaultTopK: number;
    maxTopK: number;
    defaultTemperature: number;
    maxTemperature: number;
}

export type ModelStatus = 'unverified' | 'initializing' | 'downloading' | 'ready' | 'error';

// Declarando a API no escopo global para o TypeScript
declare global {
    interface Window {
        LanguageModel?: LanguageModel;
    }
}

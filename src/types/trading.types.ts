export interface TradingSettings {
    assetInformation: boolean;
    countdown: boolean;
    isHighestLowestMarkerEnabled: boolean;
    language: string;
    position: string;
    theme: string;
}

export interface ChartBarrier {
    high?: number;
    low?: number;
    color?: string;
}

export interface SubscriptionCallback<T> {
    (data: T): void;
}

export interface APISubscription {
    unsubscribe: () => void;
}

export interface ChartSubscription {
    requestId: string;
    subscription?: APISubscription;
}

export interface DerivAPIError {
    code: string;
    message: string;
}

export interface Tick {
    ask: number;
    bid: number;
    epoch: number;
    id: string;
    pip_size: number;
    quote: number;
    symbol: string;
}

export interface TickResponse {
    tick?: Tick;
    error?: DerivAPIError;
}

export interface APIRequest {
    [key: string]: any;
    ticks?: string;
    subscribe?: number;
}

declare module "@deriv/deriv-api/dist/DerivAPIBasic" {
  export interface DerivAPIBasicConfig {
    connection: WebSocket;
  }

  export interface BaseRequest {
    [key: string]: unknown;
    subscribe?: 1;
  }

  interface Subscription<T> {
    subscribe(callback: (response: T) => void): {
      unsubscribe(): void;
    };
  }

  class DerivAPIBasic {
    constructor(config: DerivAPIBasicConfig);

    send<T, R extends BaseRequest = BaseRequest>(request: R): Promise<T>;

    subscribe<T>(request: BaseRequest): Promise<Subscription<T>>;

    disconnect(): void;
  }

  export default DerivAPIBasic;
}

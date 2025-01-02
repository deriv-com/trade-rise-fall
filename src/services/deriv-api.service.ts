import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import {
  DerivAPIConfig,
  ActiveSymbolsResponse,
  ContractForSymbolResponse,
  PriceProposalRequest,
  PriceProposalResponse,
  BuyContractRequest,
  BuyContractResponse,
} from "../types/deriv-api.types";

export class DerivAPIService {
  private api!: DerivAPIBasic;
  private connection!: WebSocket;
  private readonly activeSubscriptions: Map<
    string,
    { unsubscribe: () => void }
  >;
  private config: DerivAPIConfig;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionChangeHandlers: ((isConnected: boolean) => void)[] = [];

  constructor(config: DerivAPIConfig) {
    this.config = config;
    this.activeSubscriptions = new Map();
    this.connect();
  }

  private connect() {
    const endpoint =
      this.config.endpoint ?? "wss://ws.derivws.com/websockets/v3";
    this.connection = new WebSocket(
      endpoint + `?app_id=${this.config.app_id}&l=EN&brand=deriv`
    );

    this.api = new DerivAPIBasic({
      connection: this.connection,
    });

    this.connection.addEventListener("close", () => {
      console.log("Connection lost. Attempting to reconnect...");
      this.notifyConnectionChange(false);
      this.reconnect();
    });

    this.connection.addEventListener("error", () => {
      console.log("Connection error. Will attempt to reconnect...");
      this.notifyConnectionChange(false);
      this.reconnect();
    });

    this.connection.addEventListener("open", () => {
      console.log("Connection established");
      this.notifyConnectionChange(true);
    });
  }

  private reconnect() {
    // Clear any existing reconnection timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    // Attempt to reconnect after 1 second
    this.reconnectTimer = setTimeout(() => {
      console.log("Reconnecting...");
      this.connect();
      // Resubscribe to active subscriptions
      this.resubscribeAll();
    }, 1000);
  }

  private async resubscribeAll() {
    console.log("this is happening");
    // Store current subscriptions
    const currentSubscriptions = Array.from(this.activeSubscriptions.entries());

    // Clear current subscriptions as we'll resubscribe
    this.activeSubscriptions.clear();

    // Resubscribe to each subscription
    for (const [key, subscription] of currentSubscriptions) {
      const [prefix, symbol] = key.split("_");
      if (symbol) {
        try {
          await this.subscribeStream(
            { ticks_history: symbol },
            () => {}, // You might want to store and reuse the original callbacks
            prefix
          );
        } catch (error) {
          console.error(`Failed to resubscribe to ${symbol}:`, error);
        }
      }
    }
  }

  public async subscribeStream(
    request: any,
    callback: (data: any) => void,
    activeSubscribePrefix: string
  ): Promise<void> {
    try {
      // Unsubscribe from any existing tick subscriptions first
      this.unsubscribeByPrefix(activeSubscribePrefix + "_");

      const requestStream = await this.api.subscribe(request);

      const subscription = requestStream.subscribe(
        (response) => {
          try {
            const subscriptionResponse = response as Record<string, any>;
            callback(subscriptionResponse);
          } catch (error) {
            callback({ error });
          }
        },
        (error: any) => {
          callback(error);
        }
      );

      this.activeSubscriptions.set(
        `${activeSubscribePrefix}_${request.ticks_history}`,
        {
          unsubscribe: () => subscription.unsubscribe(),
        }
      );
    } catch (error) {
      throw error;
    }
  }

  public async getActiveSymbols(): Promise<ActiveSymbolsResponse> {
    try {
      return await this.api.send({
        active_symbols: "brief",
        product_type: "basic",
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendRequest(request: any): Promise<any> {
    try {
      return await this.api.send(request);
    } catch (error) {
      throw error;
    }
  }

  public async getContractsForSymbol(
    symbol: string
  ): Promise<ContractForSymbolResponse> {
    try {
      return await this.api.send({
        contracts_for: symbol,
      });
    } catch (error) {
      throw error;
    }
  }

  public async getPriceProposal(
    request: PriceProposalRequest
  ): Promise<PriceProposalResponse> {
    try {
      return await this.api.send(request);
    } catch (error) {
      throw error;
    }
  }

  public async buyContract(
    request: BuyContractRequest
  ): Promise<BuyContractResponse> {
    try {
      return await this.api.send(request);
    } catch (error) {
      throw error;
    }
  }

  public unsubscribeAll(): void {
    this.activeSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.activeSubscriptions.clear();
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.unsubscribeAll();
    this.connection.close();
  }

  private unsubscribeByPrefix(prefix: string): void {
    for (const [key, subscription] of this.activeSubscriptions) {
      if (key.startsWith(prefix)) {
        subscription.unsubscribe();
        this.activeSubscriptions.delete(key);
      }
    }
  }

  public isConnected(): boolean {
    return this.connection.readyState === WebSocket.OPEN;
  }

  public onConnectionChange(
    handler: (isConnected: boolean) => void
  ): () => void {
    this.connectionChangeHandlers.push(handler);
    // Return cleanup function
    return () => {
      this.connectionChangeHandlers = this.connectionChangeHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  private notifyConnectionChange(isConnected: boolean): void {
    this.connectionChangeHandlers.forEach((handler) => handler(isConnected));
  }
}

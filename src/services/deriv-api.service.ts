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
  private readonly api: DerivAPIBasic;
  private readonly connection: WebSocket;
  private readonly activeSubscriptions: Map<
    string,
    { unsubscribe: () => void }
  >;

  constructor(config: DerivAPIConfig) {
    const endpoint = config.endpoint ?? "wss://ws.derivws.com/websockets/v3";
    this.connection = new WebSocket(
      endpoint + `?app_id=${config.app_id}&l=EN&brand=deriv`
    );
    this.api = new DerivAPIBasic({
      connection: this.connection,
    });
    this.activeSubscriptions = new Map();
  }

  /**
   * Get tick data for a symbol
   * @param symbol - The trading symbol (e.g., "R_100")
   * @returns Promise resolving to tick subscription
   */
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

  /**
   * Get all active trading symbols
   * @returns Promise resolving to active symbols
   */
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

  /**
   * Get contracts available for a symbol
   * @param symbol - The trading symbol
   * @returns Promise resolving to contracts for symbol
   */
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

  /**
   * Request price proposal for a contract
   * @param request - The proposal request parameters
   * @returns Promise resolving to price proposal
   */
  public async getPriceProposal(
    request: PriceProposalRequest
  ): Promise<PriceProposalResponse> {
    try {
      return await this.api.send(request);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buy a contract
   * @param request - The buy contract request
   * @returns Promise resolving to buy contract response
   */
  public async buyContract(
    request: BuyContractRequest
  ): Promise<BuyContractResponse> {
    try {
      return await this.api.send(request);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unsubscribe from all active subscriptions
   */
  public unsubscribeAll(): void {
    this.activeSubscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.activeSubscriptions.clear();
  }

  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    this.unsubscribeAll();
    this.connection.close();
  }

  /**
   * Unsubscribe from subscriptions matching a prefix
   */
  private unsubscribeByPrefix(prefix: string): void {
    for (const [key, subscription] of this.activeSubscriptions) {
      if (key.startsWith(prefix)) {
        subscription.unsubscribe();
        this.activeSubscriptions.delete(key);
      }
    }
  }
}

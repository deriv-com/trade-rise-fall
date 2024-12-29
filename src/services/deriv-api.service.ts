import DerivAPIBasic from "@deriv/deriv-api/dist/DerivAPIBasic";
import {
  DerivAPIConfig,
  TickResponse,
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
    this.connection = new WebSocket(endpoint + `?app_id=${config.app_id}`);
    this.api = new DerivAPIBasic({
      connection: new WebSocket(
        "wss://ws.derivws.com/websockets/v3?app_id=36300&l=EN&brand=deriv"
      ),
    });
    this.activeSubscriptions = new Map();
  }

  /**
   * Get tick data for a symbol
   * @param symbol - The trading symbol (e.g., "R_100")
   * @returns Promise resolving to tick subscription
   */
  public async subscribeTicks(
    request: any,
    callback: (data: TickResponse) => void
  ): Promise<void> {
    console.log(request, "request");
    try {
      // Unsubscribe from any existing tick subscriptions first
      this.unsubscribeByPrefix("ticks_");

      const tickStream = await this.api.subscribe(request);
      console.log(tickStream, "tickStream");

      const subscription = tickStream.subscribe((response) => {
        try {
          // Handle incoming tick data as TickResponse
          const tickResponse = response as TickResponse;
          console.log(response, "response from subscribe service ");

          if (tickResponse.error) {
            throw tickResponse.error;
          }

          callback(tickResponse);
        } catch (error) {
          console.error("Error in tick subscription:", error);
          callback({ error } as TickResponse); // Pass error to callback
        }
      });

      this.activeSubscriptions.set(`ticks_${request.ticks_history}`, {
        unsubscribe: () => subscription.unsubscribe(),
      });
    } catch (error) {
      console.error("Error subscribing to ticks:", error);
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
      console.error("Error fetching active symbols:", error);
      throw error;
    }
  }
  public async sendRequest(request: any): Promise<any> {
    try {
      return await this.api.send(request);
    } catch (error) {
      console.error("Error fetching active symbols:", error);
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
      console.error("Error fetching contracts:", error);
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
      console.error("Error getting price proposal:", error);
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
      console.error("Error buying contract:", error);
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

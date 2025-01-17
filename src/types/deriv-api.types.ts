import { BaseRequest } from "@deriv/deriv-api/dist/DerivAPIBasic";

export interface DerivAPIConfig {
  app_id: string;
  endpoint?: string;
}

export interface TickResponse {
  tick: {
    ask: number;
    bid: number;
    epoch: number;
    id: string;
    pip_size: number;
    quote: number;
    symbol: string;
  };
}

export interface ActiveSymbolsResponse {
  active_symbols: Array<{
    allow_forward_starting: number;
    display_name: string;
    exchange_is_open: number;
    is_trading_suspended: number;
    market: string;
    market_display_name: string;
    pip: number;
    submarket: string;
    submarket_display_name: string;
    symbol: string;
    symbol_type: string;
  }>;
}

export interface ContractForSymbolResponse {
  contracts_for: {
    available: Array<{
      barrier_category: string;
      barriers: number;
      contract_category: string;
      contract_category_display: string;
      contract_display: string;
      contract_type: string;
      exchange_name: string;
      expiry_type: string;
      market: string;
      max_contract_duration: string;
      min_contract_duration: string;
      sentiment: string;
      start_type: string;
      submarket: string;
      underlying_symbol: string;
    }>;
    close: string;
    feed_license: string;
    hit_count: number;
    open: string;
    spot: number;
  };
}

export interface PriceProposalRequest extends BaseRequest {
  proposal: 1;
  subscribe?: 1;
  amount: number;
  basis: "payout" | "stake";
  contract_type: string;
  currency: string;
  duration: number;
  duration_unit: "min" | "hour" | "day";
  symbol: string;
  [key: string]: unknown;
}

export interface PriceProposalResponse {
  proposal?: {
    id: string;
    longcode: string;
    spot: number;
    spot_time: number;
    ask_price: number;
    display_value: string;
    payout: number;
    spot_value: string;
  };
  subscription?: {
    id: string;
  };
}

export interface BuyContractRequest extends BaseRequest {
  buy: string; // proposal ID
  price: number;
  [key: string]: unknown;
}

export interface BuyContractResponse {
  buy: {
    balance_after: number;
    buy_price: number;
    contract_id: number;
    longcode: string;
    payout: number;
    purchase_time: number;
    shortcode: string;
    start_time: number;
    transaction_id: number;
  };
}

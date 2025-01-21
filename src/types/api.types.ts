export interface LoginCredentials {
    accountId: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user?: {
        id: string;
        email: string;
    };
}

export interface BalanceResponse {
    balance: string;
    currency: string;
}

import { makeAutoObservable } from 'mobx';

export class BalanceStore {
    balance: string = '34';
    currency: string = 'USD';

    constructor() {
        makeAutoObservable(this);
    }

    setBalance(balance: string, currency: string) {
        this.balance = balance;
        this.currency = currency;
    }
}

export const balanceStore = new BalanceStore();

import { makeAutoObservable } from 'mobx';

export class BalanceStore {
    balance: string = '';
    currency: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    setBalance(balance: string, currency: string) {
        this.balance = balance;
        this.currency = currency;
    }
}

export const balanceStore = new BalanceStore();

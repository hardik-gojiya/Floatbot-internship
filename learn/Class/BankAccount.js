class BankAccount {
  #balance;

  constructor(initialDeposit) {
    this.#balance = initialDeposit >= 0 ? initialDeposit : 0;
  }

  deposit(amount) {
    if (amount <= 0) {
      return "Amount must be greater than 0";
    }
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount <= 0) {
      return "Withdrawal amount must be positive.";
    }
    
    if (this.#balance <= 0 || this.#balance < amount) {
      return "You Don't have am enough balance";
    }
    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

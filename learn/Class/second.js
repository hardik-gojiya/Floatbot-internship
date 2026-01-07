class BankAccount {
  #balance;
  #pin;
  constructor(initialBalance, pin) {
    this.#balance = initialBalance;
    this.#pin = pin;
  }

  deposit(amount) {
    this.#balance += amount;
    return "Deposit successful";
  }

  withdraw(amount, pin) {
    if (this.#pin == pin) {
      throw new Error("Invalid pin");
    }
    this.#balance -= amount;
    return "Withdraw successful";
  }

  getBalance(pin) {
    if (this.#pin != pin) {
      throw new Error("Invalid pin");
    }
    return this.#balance;
  }
}

const account = new BankAccount(1000, 1234);
console.log(account.deposit(500));
console.log(account.getBalance(1234));

class PaymentGateway {
  constructor() {
    if (this.constructor === PaymentGateway) {
      throw new Error("Abstract class cannot be instantiated");
    }
  }
  pay(amount) {
    throw new Error("pay() must be implemented");
  }
}

class RazorpayGateway extends PaymentGateway {
  pay(amount) {
    return `Paid ₹${amount} via Razorpay`;
  }
}

const gateway = new RazorpayGateway();
console.log(gateway.pay(500));

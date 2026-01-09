const fetchUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: "hardik", number: 123456789 });
    }, 500);
  });
};

const fetchOrder = (number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([{ item: "mobile", price: 500 }]);
    }, 1000);
  });
};

const fetchPayment = (orders) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["payment1", "payment2"]);
    }, 2000);
  });
};

const fetchUserDetail = async () => {
  try {
    const user = await fetchUser();
    console.log(user);
    const orders = await fetchOrder(user.id);
    console.log(orders);
    const payments = await fetchPayment(orders);
    console.log(payments);
  } catch (error) {
    console.log(error);
  }
};

fetchUserDetail();

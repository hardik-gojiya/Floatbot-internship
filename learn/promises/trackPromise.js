function trackPromise(promise) {
  console.log("Pending");

  return promise
    .then((value) => {
      console.log("pending → fulfilled");
      return value;
    })
    .catch((err) => {
      console.log("pending → rejected");
      return err;
    });
}

function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Data not loaded"), 1000);
  });
}

trackPromise(fetchData()).then((data) => console.log("Result:", data));

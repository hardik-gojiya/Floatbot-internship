function retryPromise(fn, retries, delay) {
  return fn().catch((err) => {
    if (retries === 0) {
      return Promise.reject(err);
    }

    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    }).then(() => {
      return retryPromise(fn, retries - 1, delay * 2);
    });
  });
}
let attempt = 0;
const fn = () => {
  return new Promise((resolve, reject) => {
    attempt++;
    console.log(attempt);

    setTimeout(() => {
      if (attempt < 3) {
        reject(new Error("New Error"));
      } else {
        resolve("Success!");
      }
    }, 100);
  });
};

retryPromise(fn, 5, 500)
  .then((result) => {
    console.log(`result: ${result}`);
  })
  .catch((err) => {
    console.log(`err: ${err.message}`);
  });

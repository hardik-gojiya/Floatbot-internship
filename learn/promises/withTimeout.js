function withTimeout(promise, ms) {
  const timOutPromise = new Promise((res, rej) => {
    setTimeout(() => {
      rej(new Error("Operation Timed Out"));
    }, ms);
  });

  return Promise.race([timOutPromise, promise]);
}

const fastPromise = new Promise((resolve) => {
  setTimeout(() => resolve("Done"), 500);
});

withTimeout(fastPromise, 1000).then(console.log).catch(console.error);

function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) {
      Promise.resolve(p).then(resolve).catch(reject);
    }
  });
}

promiseRace([
  new Promise((res) => setTimeout(() => res("Fast"), 200)),
  new Promise((res) => setTimeout(() => res("Slow"), 1000)),
]).then((result) => console.log(result));
